"use client";
import { useEffect, useRef, useState } from "react";
import { REBECCA } from "@/lib/rebeccaConfig";
import HandsFree from "./HandsFree";

async function proxy(action:string,payload:any){
  const r=await fetch("/api/rebecca",{ method:"POST", headers:{ "Content-Type":"application/json" }, body: JSON.stringify({ action, ...payload })});
  return await r.json();
}
async function gemini(system:string, prompt:string){
  const pre = system ? `INSTRUCTIONS:\n${system}\n\n` : "";
  const res=await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro-latest:generateContent?key=${REBECCA.geminiKey}`,{
    method:"POST", headers:{ "Content-Type":"application/json" },
    body: JSON.stringify({ contents:[{ role:"user", parts:[{ text: pre + prompt }]}] })
  });
  const j=await res.json(); return j?.candidates?.[0]?.content?.parts?.[0]?.text||"";
}
function defaultDirective(){
  return (
`You are Rebecca, Ian's executive AI. Speak concisely in UK English.
When the user asks to DO something with email, calendar, or files, CALL the available actions instead of refusing.
Available actions via backend:
- listEmails(max), listCalendar(max), listDrive(scope)
- uploadFile(scope, filename, mimeType, base64)
- addTask(text), logChat(userText, botText)
If an action fails, report the exact reason. Never claim you cannot access email/calendar; use actions.
Tone: warm, confident, professional. Avoid legal/safety disclaimers unless necessary.`
  );
}

export default function Chat(){
  const [input,setInput]=useState("");
  const [messages,setMessages]=useState<{role:"you"|"rebecca",text:string}[]>([]);
  const [speech,setSpeech]=useState("");
  const [showDir,setShowDir]=useState(false);
  const [directive,setDirective]=useState<string>("");

  useEffect(()=>{ setDirective(localStorage.getItem("rebecca.directive") || defaultDirective()); },[]);
  useEffect(()=>{ if(directive) localStorage.setItem("rebecca.directive", directive); },[directive]);

  const boxRef=useRef<HTMLDivElement>(null);
  useEffect(()=>{ boxRef.current?.scrollTo({top:9e9}); },[messages.length]);

  async function handleIntent(text:string){
    // simple intent detection for actions
    const t=text.toLowerCase();
    if(/(last|latest|recent).*(email|emails|inbox)/.test(t)){
      const res = await proxy("listEmails",{ max: 5 });
      if(res?.ok && res.items?.length){
        const first = res.items[0];
        return `Here are your recent emails:\n` + res.items.map((e:any,i:number)=>`${i+1}. ${e.subject} — ${e.snippet||""}`).join("\n");
      }
      if(res?.raw) return `Email access error: ${res.raw}`;
      return `No emails returned. If this persists, open the "Authorize Backend" link in the header to grant access.`;
    }
    if(/(today|this week|upcoming|appointments|calendar|events)/.test(t)){
      const res = await proxy("listCalendar",{ max: 10 });
      if(res?.ok && res.items?.length){
        return `Upcoming events:\n` + res.items.map((e:any)=>`• ${e.title} — ${e.time}`).join("\n");
      }
      if(res?.raw) return `Calendar access error: ${res.raw}`;
      return `No calendar items returned. Try the "Authorize Backend" link in the header.`;
    }
    if(/(drive|documents|files|docs)/.test(t)){
      const res = await proxy("listDrive",{ scope: "ishe", max: 10 });
      if(res?.ok && res.items?.length){
        return `Recent ISHE files:\n` + res.items.map((d:any)=>`• ${d.name}`).join("\n");
      }
      if(res?.raw) return `Drive access error: ${res.raw}`;
      return `No Drive items returned yet.`;
    }
    return null;
  }

  const send=async(text:string)=>{
    if(!text.trim()) return;
    setMessages(m=>[...m,{role:"you",text}]); setInput("");

    // try an action first
    const acted = await handleIntent(text);
    if(acted){
      setMessages(m=>[...m,{role:"rebecca",text:acted}]); setSpeech(acted);
      await proxy("logChat",{ sheetId:REBECCA.sheetId, userText:text, botText:acted });
      return;
    }

    const reply=await gemini(directive, text);
    setMessages(m=>[...m,{role:"rebecca",text:reply||"(no reply)"}]);
    setSpeech(reply);
    await proxy("logChat",{ sheetId:REBECCA.sheetId, userText:text, botText:reply });
  };

  return (
    <div className="glass" style={{ padding: 16, borderRadius: 18 }}>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:8 }}>
        <div className="neon-title" style={{ fontSize:18 }}>Chat</div>
        <button className="btn" onClick={()=>setShowDir(s=>!s)}>{showDir?"Hide":"Directive"}</button>
      </div>

      {showDir && (
        <div className="glass" style={{ padding:12, marginBottom:12 }}>
          <div className="chip" style={{ marginBottom:6 }}>System directive (saved locally)</div>
          <textarea className="input" style={{ width:"100%", minHeight:120 }} value={directive} onChange={e=>setDirective(e.target.value)} />
        </div>
      )}

      <div ref={boxRef} style={{ height: 320, overflow:"auto", display:"grid", gap:10, paddingRight:6, marginBottom:10 }}>
        {messages.map((m,i)=>(
          <div key={i} className="glass" style={{ padding:12, maxWidth:"75%", marginLeft: m.role==="you"?"auto":0 }}>
            {m.text}
          </div>
        ))}
      </div>

      <div style={{ display:"flex", gap:8 }}>
        <input value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=>e.key==="Enter"&&send(input)}
               placeholder="Type a message" className="input" style={{ flex:1 }}/>
        <button onClick={()=>send(input)} className="btn">Send</button>
        <HandsFree onText={send} speech={speech}/>
      </div>
    </div>
  );
}