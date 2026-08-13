import { NextResponse } from "next/server";

const COUNTRY_HEADERS = ["x-vercel-ip-country", "cf-ipcountry", "cloudfront-viewer-country"];

export function GET(request) {
  const country = COUNTRY_HEADERS
    .map((name) => request.headers.get(name)?.trim().toUpperCase())
    .find((value) => /^[A-Z]{2}$/.test(value));

  return NextResponse.json({ country: country || null });
}
