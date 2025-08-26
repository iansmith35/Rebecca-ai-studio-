import { NextRequest, NextResponse } from "next/server";
import { REBECCA } from "@/lib/rebeccaConfig";
export async function OPTIONS(){ return NextResponse.json({}, { headers: corsHeaders() }); }
export async function POST(req: NextRequest){
  try{
    const body = await req.json();
    const res = await fetch(REBECCA.appsScriptURL,{ method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(body)});
    const data = await res.json().catch(()=>null);
    return NextResponse.json(data ?? { ok:true }, { headers: corsHeaders() });
  }catch(e:any){ return NextResponse.json({ ok:false, error: e?.message||String(e)}, { status:500, headers: corsHeaders()}); }
}
function corsHeaders(){ return {"Access-Control-Allow-Origin":"*","Access-Control-Allow-Methods":"POST, OPTIONS","Access-Control-Allow-Headers":"Content-Type"}; }