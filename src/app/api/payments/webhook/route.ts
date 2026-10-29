import { errorResponse, PaymentError, processWebhook } from "@/lib/payments";
export async function POST(request: Request) {
  try {
    const raw = await request.text();
    if (raw.length > 262144) throw new PaymentError("Request is too large.", 413);
    return Response.json(await processWebhook(raw, request.headers.get("x-razorpay-signature") || ""));
  } catch (error) { return errorResponse(error); }
}
