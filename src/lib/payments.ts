import { createHmac, randomUUID, timingSafeEqual } from "node:crypto";

export type Attendee = { name: string; email: string; phone: string; city: string };
type Payment = { id: string; order_id: string; amount: number; currency: string; status: string; captured?: boolean; created_at: number };
type Order = { id: string; amount: number; currency: string; notes: Record<string, string> };
export class PaymentError extends Error {
  status: number;
  constructor(message: string, status = 400) { super(message); this.status = status; }
}
const source = "fsp-catalyst-connect-3";
function required(name: string) {
  const value = process.env[name]?.trim();
  if (!value) throw new PaymentError("Registration payments are not available yet. Please try again later.", 503);
  return value;
}
export function paymentSettings() {
  const amount = Number(process.env.PAYMENT_AMOUNT_PAISE);
  let sheetReady = false;
  try { const endpoint = new URL(process.env.GOOGLE_SHEETS_WEB_APP_URL || ""); sheetReady = endpoint.protocol === "https:" && endpoint.hostname === "script.google.com" && endpoint.pathname.endsWith("/exec"); } catch {}
  const ready = sheetReady && ["RAZORPAY_KEY_ID", "RAZORPAY_KEY_SECRET", "RAZORPAY_WEBHOOK_SECRET", "GOOGLE_SHEETS_WEB_APP_URL", "GOOGLE_SHEETS_SHARED_SECRET"].every(k => !!process.env[k]?.trim()) && Number.isSafeInteger(amount) && amount > 0;
  return { ready, amount: Number.isSafeInteger(amount) && amount > 0 ? amount : null, currency: "INR" };
}
export function parseAttendee(input: unknown): Attendee {
  if (!input || typeof input !== "object") throw new PaymentError("Please enter your registration details.");
  const data = input as Record<string, unknown>;
  const text = (key: string, max: number) => {
    const value = typeof data[key] === "string" ? data[key].trim() : "";
    if (!value || value.length > max || /[\u0000-\u001f\u007f]/.test(value)) throw new PaymentError(`Please enter a valid ${key}.`);
    return value;
  };
  const name = text("name", 100), email = text("email", 150).toLowerCase(), city = text("city", 100);
  const phone = text("phone", 25).replace(/[\s()-]/g, "");
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) throw new PaymentError("Please enter a valid email address.");
  if (!/^\+?[1-9]\d{9,14}$/.test(phone)) throw new PaymentError("Please enter a valid mobile number, including country code if outside India.");
  return { name, email, phone, city };
}
export function matchesSignature(message: string, signature: string, secret: string) {
  if (!/^[a-f0-9]{64}$/i.test(signature)) return false;
  const expected = createHmac("sha256", secret).update(message).digest();
  return timingSafeEqual(expected, Buffer.from(signature, "hex"));
}
function attendeeProof(attendee: Attendee, amount: number) {
  return createHmac("sha256", required("RAZORPAY_KEY_SECRET")).update(JSON.stringify([source, amount, attendee.name, attendee.email, attendee.phone, attendee.city])).digest("hex");
}
async function razorpay<T>(path: string, body?: unknown): Promise<T> {
  const auth = Buffer.from(`${required("RAZORPAY_KEY_ID")}:${required("RAZORPAY_KEY_SECRET")}`).toString("base64");
  const response = await fetch(`https://api.razorpay.com/v1/${path}`, {
    method: body ? "POST" : "GET", headers: { Authorization: `Basic ${auth}`, "Content-Type": "application/json" },
    body: body ? JSON.stringify(body) : undefined, cache: "no-store", signal: AbortSignal.timeout(15000),
  });
  if (!response.ok) throw new PaymentError("The payment service is temporarily unavailable. Please try again.", 502);
  return response.json();
}
export async function createOrder(input: unknown) {
  const attendee = parseAttendee(input), settings = paymentSettings();
  if (!settings.ready || !settings.amount) throw new PaymentError("Registration payments are not available yet. Please try again later.", 503);
  const order = await razorpay<Order>("orders", {
    amount: settings.amount, currency: "INR", receipt: `fsp_${randomUUID().replaceAll("-", "")}`,
    notes: { source, ...attendee, proof: attendeeProof(attendee, settings.amount) },
  });
  if (order.amount !== settings.amount || order.currency !== "INR") throw new PaymentError("Could not create your payment order.", 502);
  return { orderId: order.id, amount: order.amount, currency: order.currency, keyId: required("RAZORPAY_KEY_ID") };
}
function id(value: unknown, prefix: string) {
  if (typeof value !== "string" || !new RegExp(`^${prefix}_[A-Za-z0-9]+$`).test(value)) throw new PaymentError("Invalid payment reference.");
  return value;
}
async function validateOrder(orderId: string, payment: Payment, ignoreUnrelated = false) {
  const order = await razorpay<Order>(`orders/${orderId}`);
  if (order.notes?.source !== source) {
    if (ignoreUnrelated) return null;
    throw new PaymentError("This payment does not belong to this registration.");
  }
  const attendee = parseAttendee(order.notes);
  const proof = attendeeProof(attendee, order.amount);
  if (!order.notes.proof || !/^[a-f0-9]{64}$/.test(order.notes.proof) || !timingSafeEqual(Buffer.from(proof), Buffer.from(order.notes.proof))) throw new PaymentError("Invalid registration details.");
  if (payment.order_id !== order.id || payment.amount !== order.amount || payment.currency !== "INR" || order.currency !== "INR" || !Number.isSafeInteger(order.amount) || order.amount <= 0) throw new PaymentError("Payment amount or order does not match.");
  return attendee;
}
export async function verifyPayment(input: Record<string, unknown>) {
  const orderId = id(input.razorpay_order_id, "order"), paymentId = id(input.razorpay_payment_id, "pay");
  if (typeof input.razorpay_signature !== "string" || !matchesSignature(`${orderId}|${paymentId}`, input.razorpay_signature, required("RAZORPAY_KEY_SECRET"))) throw new PaymentError("Payment verification failed.", 401);
  const payment = await razorpay<Payment>(`payments/${paymentId}`);
  await validateOrder(orderId, payment);
  return { status: payment.status === "captured" && payment.captured ? "paid" : "processing", paymentId };
}
export async function processWebhook(raw: string, signature: string) {
  if (!matchesSignature(raw, signature, required("RAZORPAY_WEBHOOK_SECRET"))) throw new PaymentError("Invalid webhook signature.", 401);
  const payload = JSON.parse(raw);
  if (payload.event !== "payment.captured") return { received: true, ignored: true };
  const supplied = payload.payload?.payment?.entity;
  const paymentId = id(supplied?.id, "pay");
  // Re-fetch from Razorpay; only its captured payment and original signed order are trusted.
  const payment = await razorpay<Payment>(`payments/${paymentId}`);
  if (payment.status !== "captured" || !payment.captured) throw new PaymentError("Payment has not been captured.", 409);
  const attendee = await validateOrder(id(payment.order_id, "order"), payment, true);
  if (!attendee) return { received: true, ignored: true };
  const endpoint = new URL(required("GOOGLE_SHEETS_WEB_APP_URL"));
  if (endpoint.protocol !== "https:" || endpoint.hostname !== "script.google.com" || !endpoint.pathname.endsWith("/exec")) throw new PaymentError("Google Sheets integration is not configured correctly.", 503);
  const response = await fetch(endpoint, {
    method: "POST", headers: { "Content-Type": "application/json" }, signal: AbortSignal.timeout(25000),
    body: JSON.stringify({ secret: required("GOOGLE_SHEETS_SHARED_SECRET"), registration: { ...attendee, paymentId, orderId: payment.order_id, amount: payment.amount / 100, currency: payment.currency, status: "PAID", paidAt: new Date(payment.created_at * 1000).toISOString(), event: source } }),
  });
  const result = await response.json();
  if (!response.ok || result.ok !== true) throw new PaymentError("Could not sync the paid registration. Webhook delivery should be retried.", 502);
  return { received: true, duplicate: result.duplicate === true };
}
export function errorResponse(error: unknown) {
  return Response.json({ error: error instanceof PaymentError ? error.message : "The request could not be completed. Please try again." }, { status: error instanceof PaymentError ? error.status : 500, headers: { "Cache-Control": "no-store" } });
}
export async function readJson(request: Request) {
  const raw = await request.text();
  if (raw.length > 8192) throw new PaymentError("Request is too large.", 413);
  try { const value = JSON.parse(raw); if (!value || typeof value !== "object" || Array.isArray(value)) throw new Error(); return value; } catch { throw new PaymentError("Invalid request."); }
}
export function checkOrigin(request: Request) {
  const expected = new URL(process.env.NEXT_PUBLIC_SITE_URL || request.url).origin;
  if (request.headers.get("origin") !== expected) throw new PaymentError("Invalid request origin.", 403);
}
