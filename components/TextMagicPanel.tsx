"use client";
import { useEffect, useState } from "react";

async function tm(path:string, opts:any){
  const r = await fetch("/api/textmagic",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({ path, ...opts })});
  return await r.json();
}

export default function TextMagicPanel(){
  const [username,setUsername]=useState<string>("");
  const [apiKey,setApiKey]=useState<string>("");
  const [to,setTo]=useState(""); const [message,setMessage]=useState("");
  const [messages,setMessages]=useState<any[]>([]);

  useEffect(()=>{
    const s=localStorage.getItem("tmCreds");
    if(s){ const {username,apiKey}=JSON.parse(s); setUsername(username); setApiKey(apiKey); }
  },[]);
  const save=()=>{ localStorage.setItem("tmCreds", JSON.stringify({username,apiKey})); alert("TextMagic saved"); };
  const refresh=async()=>{
    if(!username||!apiKey) return;
    const j=await tm("chats",{ method:"GET", username, apiKey, qs:{ limit:"25" }});
    if(j?.ok) setMessages(j.data?.resources||[]);
  };
  const send=async()=>{
    if(!username||!apiKey) return alert("Save TextMagic creds first");
    const j=await tm("messages",{ method:"POST", username, apiKey, body:{ phones: to, text: message }});
    if(!j?.ok) alert("Send failed");
    setMessage(""); await refresh();
  };

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 gap-2">
        <input value={username} onChange={e=>setUsername(e.target.value)} placeholder="TextMagic username"
          className="bg-black/40 border border-violet-800/40 rounded-xl px-3 py-2"/>
        <input value={apiKey} onChange={e=>setApiKey(e.target.value)} placeholder="TextMagic API key"
          className="bg-black/40 border border-violet-800/40 rounded-xl px-3 py-2"/>
      </div>
      <button onClick={save} className="px-3 py-2 rounded-xl bg-violet-600">Save</button>
      
      <div className="grid grid-cols-4 gap-2">
        <input value={to} onChange={e=>setTo(e.target.value)} placeholder="To (e.g. +447...)" 
          className="bg-black/40 border border-violet-800/40 rounded-xl px-3 py-2"/>
        <input value={message} onChange={e=>setMessage(e.target.value)} placeholder="Message" 
          className="col-span-2 bg-black/40 border border-violet-800/40 rounded-xl px-3 py-2"/>
        <div className="flex gap-1">
          <button onClick={send} className="px-3 py-2 rounded-xl bg-emerald-600 text-sm">Send SMS</button>
          <button onClick={refresh} className="px-3 py-2 rounded-xl bg-blue-600 text-sm">Refresh</button>
        </div>
      </div>

      {messages.length > 0 && (
        <div className="space-y-2 max-h-64 overflow-auto">
          <div className="text-xs uppercase tracking-wide text-violet-300/80">Recent Messages</div>
          {messages.map((m:any)=>(
            <div key={m.id} className="bg-black/40 border border-violet-800/40 rounded-xl p-3">
              <div className="font-semibold text-sm">{m.contact?.phone || m.id}</div>
              <div className="text-xs text-zinc-400">{m.lastMessagePreview}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}