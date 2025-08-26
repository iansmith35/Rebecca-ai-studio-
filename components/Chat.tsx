"use client";
import { useEffect, useRef, useState } from "react";
import { REBECCA } from "@/lib/rebeccaConfig";
import HandsFree from "./HandsFree";
async function gemini(prompt:string){
  const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro-latest:generateContent?key=${REBECCA.geminiKey}`,{
    method:"POST", headers:{ "Content-Type":"application/json" }, body: JSON.stringify({ contents:[{ role:"user", parts:[{ text: prompt }]}] })
  });
  const j = await res.json(); return j?.candidates?.[0]?.content?.parts?.[0]?.text || "";
}
async function proxy(action:string,payload:any){ const r=await fetch("/api/rebecca",{ method:"POST", headers:{ "Content-Type":"application/json" }, body: JSON.stringify({ action, ...payload })}); return await r.json(); }
export default function Chat(){
  const [input,setInput]=useState(""); const [messages,setMessages]=useState<{role:"you"|"rebecca",text:string}[]>([]); const [speech,setSpeech]=useState(""); const boxRef=useRef<HTMLDivElement>(null);
  useEffect(()=>{ boxRef.current?.scrollTo({top:9e9}); },[messages.length]);
  const send = async (text:string)=>{ if(!text.trim()) return;
    setMessages(m=>[...m,{ role:"you", text }]); setInput("");
    if (/^(remind me|add task|todo|to do)/i.test(text)) await proxy("addTask",{ sheetId: REBECCA.sheetId, text });
    const reply = await gemini(text); setMessages(m=>[...m,{ role:"rebecca", text: reply || "(no reply)" }]); setSpeech(reply);
    await proxy("logChat",{ sheetId: REBECCA.sheetId, userText: text, botText: reply });
  };
  return (
    <div style={{ height: 420, display: "flex", flexDirection: "column" }}>
      <div ref={boxRef} style={{ flex:1, overflow:"auto", display:"grid", gap:12, paddingRight:8 }}>
        {messages.map((m,i)=> (<div key={i} style={{ maxWidth:"75%", padding:12, borderRadius:14, background: m.role==="you"?"#27272a":"#0b0b0b", marginLeft: m.role==="you"?"auto":0 }}>{m.text}</div>))}
      </div>
      <div style={{ display:"flex", gap:8, marginTop:12 }}>
        <input value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=>e.key==="Enter"&&send(input)} placeholder="Type a message"
               style={{ flex:1, background:"#0b0b0b", border:"1px solid #18181b", borderRadius:12, padding:"8px 10px", color:"#e4e4e7" }}/>
        <button onClick={()=>send(input)} style={{ padding:"8px 12px", borderRadius:12, background:"#4f46e5", color:"#fff" }}>Send</button>
        <HandsFree onText={send} speech={speech}/>
      </div>
    </div>
  );
}