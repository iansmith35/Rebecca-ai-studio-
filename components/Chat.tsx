"use client";
import { useEffect, useRef, useState } from "react";
import { REBECCA } from "@/lib/rebeccaConfig";
import HandsFree from "./HandsFree";
async function gemini(prompt:string){
  const res=await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro-latest:generateContent?key=${REBECCA.geminiKey}`,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({contents:[{role:'user',parts:[{text:prompt}]}]})});
  const j=await res.json(); return j?.candidates?.[0]?.content?.parts?.[0]?.text||"";
}
async function proxy(action:string,payload:any){ const r=await fetch('/api/rebecca',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({action,...payload})}); return await r.json(); }
export default function Chat(){
  const [input,setInput]=useState(""); const [messages,setMessages]=useState<{role:'you'|'rebecca',text:string}[]>([]); const [speech,setSpeech]=useState<string>(""); const boxRef=useRef<HTMLDivElement>(null);
  useEffect(()=>{ boxRef.current?.scrollTo({top:9e9}); },[messages.length]);
  const send=async(text:string)=>{
    if(!text.trim())return; setMessages(m=>[...m,{role:'you',text}]); setInput(""); if(/^(remind me|add task|todo|to do)/i.test(text)){ await proxy('addTask',{ sheetId:REBECCA.sheetId, text}); }
    const reply=await gemini(text); setMessages(m=>[...m,{role:'rebecca',text:reply||'(no reply)'}]); setSpeech(reply); await proxy('logChat',{ sheetId:REBECCA.sheetId, userText:text, botText:reply}); };
  return (
    <div className="h-[420px] flex flex-col">
      <div ref={boxRef} className="flex-1 overflow-auto space-y-3 pr-2">{messages.map((m,i)=>(<div key={i} className={`max-w-[75%] p-3 rounded-xl ${m.role==='you'?"bg-zinc-800 ml-auto":"bg-zinc-900/70"}`}>{m.text}</div>))}</div>
      <div className="mt-3 flex items-center gap-2"><input value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=>e.key==='Enter'&&send(input)} placeholder="Type a message" className="flex-1 bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2"/><button onClick={()=>send(input)} className="px-4 py-2 rounded-xl bg-indigo-600">Send</button><HandsFree onText={send} speech={speech}/></div>
    </div>
  );
}