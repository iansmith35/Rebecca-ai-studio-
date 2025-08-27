import { NextRequest, NextResponse } from "next/server";
import { REBECCA } from "@/lib/rebeccaConfig";

export async function GET() {
  return NextResponse.json({ ok: true, status: "healthy" });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const res = await fetch(REBECCA.appsScriptURL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const ct = res.headers.get("content-type") || "";
    if (!ct.includes("application/json")) {
      // make sure frontend never renders HTML blobs
      const text = await res.text();
      return NextResponse.json({ ok: false, kind: "BACKEND_HTML", text });
    }
    const data = await res.json();
    return NextResponse.json(data);
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e?.message || String(e) }, { status: 500 });
  }
}