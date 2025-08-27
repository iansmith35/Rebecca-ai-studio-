import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest){
  try{
    const { path, method = "GET", username, apiKey, qs, body, ...rest } = await req.json();
    
    if (!username || !apiKey) {
      return NextResponse.json({ ok:false, error:"Missing TextMagic credentials" }, { status: 400 });
    }
    
    const auth = Buffer.from(`${username}:${apiKey}`).toString("base64");
    
    // Handle new API structure for different paths
    if (path === "chats") {
      const url = new URL("https://api.textmagic.com/api/v2/chats");
      if (qs) {
        Object.entries(qs).forEach(([key, value]) => {
          url.searchParams.append(key, value as string);
        });
      }
      
      const r = await fetch(url.toString(), {
        method,
        headers: {
          "Authorization": `Basic ${auth}`,
          "Content-Type": "application/json",
        },
      });
      const data = await r.json();
      return NextResponse.json({ ok: true, data });
    }
    
    if (path === "messages") {
      const r = await fetch("https://api.textmagic.com/api/v2/messages", {
        method,
        headers: {
          "Authorization": `Basic ${auth}`,
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: body ? new URLSearchParams(body) : undefined,
      });
      const data = await r.json();
      return NextResponse.json({ ok: true, data });
    }
    
    // Legacy support for existing "send" action
    const { action, creds } = rest;
    if (action === "send" && creds) {
      const legacyAuth = Buffer.from(`${creds.username}:${creds.apiKey}`).toString("base64");
      const r = await fetch("https://api.textmagic.com/api/v2/messages", {
        method: "POST",
        headers: {
          "Authorization": `Basic ${legacyAuth}`,
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({ phones: rest.to, text: rest.text }),
      });
      const j = await r.json();
      return NextResponse.json({ ok:true, result:j });
    }

    return NextResponse.json({ ok:false, error:"Unknown TextMagic path or action" }, { status: 400 });
  }catch(e:any){
    return NextResponse.json({ ok:false, error:e?.message||String(e) }, { status: 500 });
  }
}