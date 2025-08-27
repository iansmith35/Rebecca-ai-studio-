import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest){
  try{
    const { action, creds, ...rest } = await req.json();
    if (!creds?.username || !creds?.apiKey) {
      return NextResponse.json({ ok:false, error:"Missing TextMagic credentials" }, { status: 400 });
    }
    const auth = Buffer.from(`${creds.username}:${creds.apiKey}`).toString("base64");

    if (action === "send") {
      // rest: { to: string, text: string }
      const r = await fetch("https://api.textmagic.com/api/v2/messages", {
        method: "POST",
        headers: {
          "Authorization": `Basic ${auth}`,
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({ phones: rest.to, text: rest.text }),
      });
      const j = await r.json();
      return NextResponse.json({ ok:true, result:j });
    }

    return NextResponse.json({ ok:false, error:"Unknown TextMagic action" }, { status: 400 });
  }catch(e:any){
    return NextResponse.json({ ok:false, error:e?.message||String(e) }, { status: 500 });
  }
}