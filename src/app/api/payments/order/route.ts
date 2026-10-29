import { connection } from "next/server";
﻿import { checkOrigin, createOrder, errorResponse, paymentSettings, readJson } from "@/lib/payments";
export async function GET() { await connection(); return Response.json(paymentSettings(), { headers: { "Cache-Control": "no-store" } }); }
export async function POST(request: Request) {
  try { checkOrigin(request); return Response.json(await createOrder(await readJson(request)), { headers: { "Cache-Control": "no-store" } }); }
  catch (error) { return errorResponse(error); }
}
