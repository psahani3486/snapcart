import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  return NextResponse.json({ ok: true, now: new Date().toISOString() });
}

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  return NextResponse.json({ ok: true, received: body });
}
