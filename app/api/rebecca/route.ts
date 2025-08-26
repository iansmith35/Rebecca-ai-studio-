import { NextRequest, NextResponse } from "next/server";
import { REBECCA } from "@/lib/rebeccaConfig";

export async function OPTIONS(){ return NextResponse.json({}, { headers: corsHeaders() }); }

export async function POST(req: NextRequest){
  try{
    const body = await req.json();
    const res  = await fetch(REBECCA.appsScriptURL, {
      method:"POST", headers:{ "Content-Type":"application/json" }, body: JSON.stringify(body)
    });

    const text = await res.text();
    const ct = res.headers.get("content-type") || "";
    let data: any = null;
    if (ct.includes("application/json")) {
      try { data = JSON.parse(text); } catch {}
    }
    if (!data) {
      // Most common cause: Web App not public ("Anyone") OR domain-scoped URL.
      return NextResponse.json({
        ok:false,
        error:"BACKEND_HTML",
        hint:"Your Apps Script returned HTML (likely auth page). Re-deploy Web App with 'Who has access: Anyone' and use the generic URL https://script.google.com/macros/s/.../exec.",
        rawSnippet: text.slice(0,600)
      }, { status: 500, headers: corsHeaders() });
    }
    return NextResponse.json(data, { headers: corsHeaders() });
  }catch(e:any){
    return NextResponse.json({ ok:false, error: e?.message||String(e) }, { status: 500, headers: corsHeaders() });
  }
}

function corsHeaders(){
  return {
    "Access-Control-Allow-Origin":"*",
    "Access-Control-Allow-Methods":"POST, OPTIONS",
    "Access-Control-Allow-Headers":"Content-Type",
  };
}