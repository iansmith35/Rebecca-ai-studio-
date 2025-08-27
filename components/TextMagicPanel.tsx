"use client";
import { useEffect, useState } from "react";

export default function TextMagicPanel(){
  const [username,setUsername]=useState(""); const [apiKey,setApiKey]=useState("");
  const [to,setTo]=useState(""); const [text,setText]=useState(""); const [msg,setMsg]=useState("");

  useEffect(()=>{ setUsername(localStorage.getItem("tm_user")||""); setApiKey(localStorage.getItem("tm_key")||""); },[]);
  const save=()=>{ localStorage.setItem("tm_user",username); localStorage.setItem("tm_key",apiKey); setMsg("Saved ✅"); setTimeout(()=>setMsg(""),1200); };
  const send=async()=>{
    const r=await fetch("/api/textmagic",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({action:"send", creds:{username,apiKey}, to, text})});
    const j=await r.json(); setMsg(j?.ok?"Sent ✅":"Error: "+(j?.error||""));
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
      <div className="grid grid-cols-3 gap-2">
        <input value={to} onChange={e=>setTo(e.target.value)} placeholder="To (e.g. +447...)" className="bg-black/40 border border-violet-800/40 rounded-xl px-3 py-2"/>
        <input value={text} onChange={e=>setText(e.target.value)} placeholder="Message" className="col-span-2 bg-black/40 border border-violet-800/40 rounded-xl px-3 py-2"/>
      </div>
      <button onClick={send} className="px-3 py-2 rounded-xl bg-emerald-600">Send SMS</button>
      {msg && <div className="text-sm">{msg}</div>}
    </div>
  );
}