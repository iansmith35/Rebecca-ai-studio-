"use client";
import { useEffect, useRef, useState } from "react";
import HandsFree from "./HandsFree";
import { REBECCA } from "@/lib/rebeccaConfig";

const SYSTEM_RULES = [
  "British English.",
  "Never narrate emoji names (e.g., 'weeping emoji'). If you use emojis, insert the actual symbol only and keep it subtle.",
  "Be concise and practical.",
].join(" ");

async function gemini(prompt:string){
  const res=await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro-latest:generateContent?key=${REBECCA.geminiKey}`,{
    method:'POST',headers:{'Content-Type':'application/json'},
    body:JSON.stringify({
      system_instruction:{role:'system',parts:[{text:SYSTEM_RULES}]},
      contents:[{role:'user',parts:[{text:prompt}]}]
    })
  });
  const j=await res.json(); return (j?.candidates?.[0]?.content?.parts?.[0]?.text||"").toString();
}

function cleanEmojis(reply:string){
  return reply
    .replace(/\*[^*]*emoji[^*]*\*/gi,"")     // remove *weeping emoji*
    .replace(/\b[a-z ]*emoji\b/gi,"")        // remove bare words like 'weeping emoji'
    .replace(/\s{2,}/g," ").trim();
}

export default function Chat({ threadId }:{ threadId:string }){
  const [input,setInput]=useState("");
  const [messages,setMessages]=useState<{role:"you"|"rebecca",text:string}[]>([]);
  const [speech,setSpeech]=useState<string>(""); const boxRef=useRef<HTMLDivElement>(null);
  useEffect(()=>{ boxRef.current?.scrollTo({top:9e9}); },[messages.length]);

  const send=async(text:string)=>{
    if(!text.trim())return;
    setMessages(m=>[...m,{role:"you",text}]); setInput("");
    const replyRaw=await gemini(text); const reply=cleanEmojis(replyRaw);
    setMessages(m=>[...m,{role:"rebecca",text:reply||"(no reply)"}]); setSpeech(reply);
    await fetch("/api/rebecca",{method:"POST",headers:{'Content-Type':'application/json'},body:JSON.stringify({action:'logChat', threadId, sheetId:REBECCA.sheetId, userText:text, botText:reply })});
  };

  return (
    <div className="h-[420px] flex flex-col rounded-2xl bg-[#0b0b15]/80 border border-violet-800/40 shadow-[0_0_30px_#6a00ff35]">
      <div ref={boxRef} className="flex-1 overflow-auto space-y-3 p-3 pr-2">
        {messages.map((m,i)=>(
          <div key={i} className={`max-w-[75%] p-3 rounded-xl ${m.role==='you'?"bg-violet-800/30 ml-auto":"bg-black/40 border border-violet-800/30"}`}>{m.text}</div>
        ))}
      </div>
      <div className="border-t border-violet-800/30 p-3 flex items-center gap-2">
        <input value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=>e.key==='Enter'&&send(input)} placeholder="Type a message" className="flex-1 bg-black/40 border border-violet-800/40 rounded-xl px-3 py-2"/>
        <button onClick={()=>send(input)} className="px-4 py-2 rounded-xl bg-violet-600 hover:bg-violet-500">Send</button>
        <HandsFree onText={send} speech={speech}/>
      </div>
    </div>
  );
}