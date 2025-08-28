"use client";
import { useEffect, useRef, useState } from "react";
import HandsFree from "./HandsFree";
import { REBECCA } from "@/lib/rebeccaConfig";
import { getAIResponse, getAvailableProviders } from "@/utils/aiProvider";

export default function Chat({ threadId }:{ threadId:string }){
  const [input,setInput]=useState("");
  const [messages,setMessages]=useState<{role:"you"|"rebecca",text:string}[]>([]);
  const [speech,setSpeech]=useState<string>(""); 
  const boxRef=useRef<HTMLDivElement>(null);
  const [providers, setProviders] = useState(getAvailableProviders());
  
  useEffect(()=>{ boxRef.current?.scrollTo({top:9e9}); },[messages.length]);

  const send=async(text:string)=>{
    if(!text.trim())return;
    setMessages(m=>[...m,{role:"you",text}]); setInput("");
    
    // Task detection - automatically add tasks for reminders/todos
    if(/^(\s*(remind|add task|todo|to do))/i.test(text)) {
      await fetch(REBECCA.appsScriptURL,{method:"POST",headers:{'Content-Type':'application/json'},body:JSON.stringify({action:'addTask', sheetId:REBECCA.sheetId, text})});
    }
    
    try {
      const reply = await getAIResponse(text);
      setMessages(m=>[...m,{role:"rebecca",text:reply||"(no reply)"}]); 
      setSpeech(reply);
      await fetch(REBECCA.appsScriptURL,{method:"POST",headers:{'Content-Type':'application/json'},body:JSON.stringify({action:'logChat', threadId, sheetId:REBECCA.sheetId, userText:text, botText:reply })});
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "An unexpected error occurred";
      setMessages(m=>[...m,{role:"rebecca",text:`Sorry, I encountered an error: ${errorMessage}`}]);
      console.error('Chat error:', error);
    }
  };

  return (
    <div className="h-[420px] flex flex-col rounded-2xl bg-[#0b0b15]/80 border border-violet-800/40 shadow-[0_0_30px_#6a00ff35]">
      {/* AI Provider Status */}
      <div className="px-3 py-1 text-xs text-violet-400/70 border-b border-violet-800/20">
        AI: {providers.gemini ? 'Gemini' : ''}{providers.gemini && providers.openai ? ' + ' : ''}{providers.openai ? 'OpenAI fallback' : ''}{!providers.gemini && !providers.openai ? 'No providers configured' : ''}
      </div>
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