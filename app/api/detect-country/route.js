import { NextResponse } from "next/server";

export function GET(request) {
  const country = request.headers.get("x-vercel-ip-country")
    || request.headers.get("cf-ipcountry")
    || null;
  return NextResponse.json({ country });
}
