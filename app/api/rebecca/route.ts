import { NextRequest, NextResponse } from "next/server";
import { REBECCA, BACKEND_SECRET } from "@/lib/rebeccaConfig";

function corsHeaders(){
  return {
    "Access-Control-Allow-Origin":"*",
    "Access-Control-Allow-Methods":"POST, OPTIONS",
    "Access-Control-Allow-Headers":"Content-Type",
  };
}
export async function OPTIONS(){ return NextResponse.json({}, { headers: corsHeaders() }); }

export async function POST(req: NextRequest){
  try{
    const body = await req.json();
    const payload = { ...body, secret: BACKEND_SECRET };

    const res = await fetch(REBECCA.appsScriptURL, {
      method: "POST",
      headers: { "Content-Type":"application/json" },
      body: JSON.stringify(payload),
    });

    const text = await res.text();
    const ct = res.headers.get("content-type") || "";

    if (!ct.includes("application/json")) {
      return NextResponse.json({
        ok:false,
        error:"BACKEND_HTML",
        hint:"Apps Script returned HTML. Use generic https://script.google.com/macros/s/{ID}/exec and Web App: Execute as Me, Who has access: Anyone.",
        rawSnippet: text.slice(0,400)
      }, { status: 500, headers: corsHeaders() });
    }

    const data = JSON.parse(text);
    return NextResponse.json(data, { headers: corsHeaders() });
  }catch(e:any){
    return NextResponse.json({ ok:false, error: e?.message||String(e) }, { status: 500, headers: corsHeaders() });
  }
}