import { checkOrigin, errorResponse, readJson, verifyPayment } from "@/lib/payments";
export async function POST(request: Request) {
  try { checkOrigin(request); return Response.json(await verifyPayment(await readJson(request)), { headers: { "Cache-Control": "no-store" } }); }
  catch (error) { return errorResponse(error); }
}
