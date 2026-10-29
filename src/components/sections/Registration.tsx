"use client";

import { useEffect, useState, type FormEvent } from "react";
import { CheckCircle2, LockKeyhole } from "lucide-react";
import { brand, event } from "@/config/site";
import { Container, Eyebrow, Section } from "../ui/Section";

type PaymentResult = { razorpay_payment_id: string; razorpay_order_id: string; razorpay_signature: string };
type CheckoutOptions = {
  key: string; amount: number; currency: string; order_id: string; name: string; description: string;
  prefill: { name: string; email: string; contact: string }; theme: { color: string };
  handler: (result: PaymentResult) => void; modal: { ondismiss: () => void };
};
type Checkout = { open: () => void; on: (event: string, callback: () => void) => void };
declare global { interface Window { Razorpay?: new (options: CheckoutOptions) => Checkout } }
let checkoutScript: Promise<void> | undefined;
function loadCheckout() {
  if (window.Razorpay) return Promise.resolve();
  if (!checkoutScript) checkoutScript = new Promise<void>((resolve, reject) => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    script.onload = () => window.Razorpay ? resolve() : reject(new Error("Payment checkout could not load. Please try again."));
    script.onerror = () => { script.remove(); checkoutScript = undefined; reject(new Error("Unable to load checkout. Check your connection and try again.")); };
    document.body.appendChild(script);
  });
  return checkoutScript;
}
async function post(path: string, body: unknown) {
  const response = await fetch(path, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
  const data = await response.json();
  if (!response.ok) throw new Error(data.error || "Unable to complete your request. Please try again.");
  return data;
}
const benefits = ["Connect with trainers, facilitators, and coaches", "Share experiences and learn from your peers", "Explore fresh perspectives on leadership and facilitation", "Build meaningful professional connections"];

export function Registration() {
  const [settings, setSettings] = useState<{ ready: boolean; amount: number | null } | null>(null);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [paid, setPaid] = useState(false);
  const [paymentId, setPaymentId] = useState("");
  const [checkoutResult, setCheckoutResult] = useState<PaymentResult | null>(null);
  useEffect(() => {
    let active = true;
    fetch("/api/payments/order", { cache: "no-store" }).then(r => { if (!r.ok) throw new Error(); return r.json(); }).then(data => { if (active) setSettings(data); }).catch(() => { if (active) setSettings({ ready: false, amount: null }); });
    return () => { active = false; };
  }, []);
  const price = settings?.amount ? new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", minimumFractionDigits: 0, maximumFractionDigits: 2 }).format(settings.amount / 100) : null;

  async function checkPayment(result: PaymentResult) {
    setBusy(true); setCheckoutResult(result);
    try {
      const verified = await post("/api/payments/verify", result);
      setPaymentId(verified.paymentId);
      if (verified.status === "paid") { setPaid(true); setMessage("Payment verified. Thank you for registering! Your payment confirmation is being recorded."); }
      else setMessage("Your payment is still processing. Please do not pay again. You can check its status below.");
    } catch { setPaymentId(result.razorpay_payment_id); setMessage("We could not check your payment status yet. If money was debited, do not pay again. Check the status below or contact the organiser with your payment reference."); }
    finally { setBusy(false); }
  }

  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (busy || paid || paymentId || !settings?.ready) return;
    const values = new FormData(e.currentTarget);
    const attendee = Object.fromEntries(["name", "email", "phone", "city"].map(key => [key, String(values.get(key) || "").trim()]));
    setBusy(true); setMessage("");
    try {
      await loadCheckout();
      const order = await post("/api/payments/order", attendee);
      const checkout = new window.Razorpay!({
        key: order.keyId, amount: order.amount, currency: order.currency, order_id: order.orderId,
        name: brand.eventFull, description: "Event registration",
        prefill: { name: attendee.name, email: attendee.email, contact: attendee.phone }, theme: { color: "#FAA81C" },
        modal: { ondismiss: () => { setBusy(false); setMessage("Checkout closed. Your registration has not been confirmed. You can try again."); } },
        handler: checkPayment,
      });
      checkout.on("payment.failed", () => setMessage("Payment was unsuccessful. You can retry in checkout or close it and try again."));
      checkout.open();
    } catch (error) { setMessage(error instanceof Error ? error.message : "Unable to open checkout. Please try again."); setBusy(false); }
  }
  const inputClass = "border-line-strong bg-ink/50 text-cream placeholder:text-cream-faint mt-2 min-h-14 w-full rounded-xl border px-4 py-3 text-base font-normal focus:border-accent";
  return (
    <Section id="registration" labelledBy="registration-heading">
      <Container size="wide">
        <div className="grid items-start gap-8 lg:grid-cols-2 lg:gap-12">
          <div className="border-line bg-surface/60 rounded-3xl border p-6 sm:p-9">
            <Eyebrow>Be part of the community</Eyebrow>
            <h2 className="mt-5 text-[length:var(--text-headline)] leading-tight">Your next meaningful connection starts here.</h2>
            <ul className="mt-8 space-y-5">
              {benefits.map(benefit => <li key={benefit} className="flex gap-3 type-body"><CheckCircle2 className="text-accent mt-1 size-5 shrink-0" aria-hidden="true" /><span>{benefit}</span></li>)}
            </ul>
            <p className="text-cream-dim border-line mt-8 border-t pt-6 type-small">{event.dateLabelLong} · {event.locationLabel}</p>
          </div>
          <div className="border-line bg-surface-2/70 rounded-3xl border p-6 sm:p-9">
            <h2 id="registration-heading" className="text-3xl sm:text-4xl">{price ? `Register for ${price}` : "Reserve your place"}</h2>
            <p className="text-cream-dim mt-3 type-body">Enter your details to continue to secure payment.</p>
            <form onSubmit={submit} className="mt-7 space-y-5" aria-busy={busy}>
              <fieldset disabled={busy || paid || !!paymentId} className="space-y-5 disabled:opacity-70">
                <legend className="sr-only">Your registration details</legend>
                <label className="block text-sm font-semibold">Full name<input className={inputClass} name="name" autoComplete="name" placeholder="Enter your full name" maxLength={100} required /></label>
                <label className="block text-sm font-semibold">Email address<input className={inputClass} name="email" type="email" autoComplete="email" placeholder="you@example.com" maxLength={150} required /></label>
                <label className="block text-sm font-semibold">Mobile number<input className={inputClass} name="phone" type="tel" autoComplete="tel" inputMode="tel" placeholder="Enter your mobile number" pattern="[+0-9 ()\-]{10,25}" maxLength={25} required /></label>
                <label className="block text-sm font-semibold">City / Town / Village<input className={inputClass} name="city" autoComplete="address-level2" placeholder="Enter your location" maxLength={100} required /></label>
              </fieldset>
              <button type="submit" disabled={busy || paid || !!paymentId || !settings?.ready} className="bg-accent text-on-accent hover:bg-accent-bright min-h-14 w-full rounded-xl px-5 py-4 text-base font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-50">{paid ? "Payment verified" : paymentId && !paid ? "Payment processing" : busy ? "Processing…" : price ? `Register & Pay ${price}` : "Register & Pay"}</button>
              {checkoutResult && !paid && <button type="button" disabled={busy} onClick={() => checkPayment(checkoutResult)} className="text-accent min-h-11 w-full rounded-xl border border-current px-4 py-3 font-semibold disabled:opacity-50">Check payment status</button>}
              {settings && !settings.ready && <p className="text-cream-dim text-sm" role="status">Online registration will open soon. Payment is currently unavailable.</p>}
              <p className="text-cream-faint flex items-center justify-center gap-2 text-sm"><LockKeyhole className="size-4 shrink-0" aria-hidden="true" />Payments processed securely by Razorpay</p>
              <div role="status" aria-live="polite" className="text-cream type-small break-words">{message}{paymentId && <p className="mt-2 text-sm">Payment reference: {paymentId}</p>}</div>
            </form>
          </div>
        </div>
      </Container>
    </Section>
  );
}
