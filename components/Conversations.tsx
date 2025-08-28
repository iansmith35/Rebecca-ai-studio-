"use client";
import { useEffect, useState } from "react";
import { REBECCA } from "@/lib/rebeccaConfig";

type Thread = { id: string; title: string; last?: string };

async function listThreads(): Promise<Thread[]>{
  const r = await fetch(REBECCA.appsScriptURL,{ method:"POST", headers:{ "Content-Type":"application/json" }, body: JSON.stringify({ action:"listChats" })});
  const j = await r.json(); return j?.items||[];
}

export default function Conversations({ active, onSelect }:{ active:string; onSelect:(id:string)=>void }){
  const [threads,setThreads]=useState<Thread[]>([]);
  const [name,setName]=useState("");

  const refresh = async()=> setThreads(await listThreads());
  useEffect(()=>{ refresh(); },[]);

  const create = async()=>{
    const title = name.trim() || "New chat";
    const id = crypto.randomUUID();
    await fetch(REBECCA.appsScriptURL,{ method:"POST", headers:{ "Content-Type":"application/json" }, body: JSON.stringify({ action:"createChat", id, title })});
    setName(""); await refresh(); onSelect(id);
  };
  const rename = async(id:string)=>{
    const title = prompt("Rename conversation", threads.find(t=>t.id===id)?.title||"")||"";
    if(!title.trim()) return;
    await fetch(REBECCA.appsScriptURL,{ method:"POST", headers:{ "Content-Type":"application/json" }, body: JSON.stringify({ action:"renameChat", id, title })});
    await refresh();
  };

  return (
    <div className="mt-4">
      <div className="text-xs uppercase tracking-wide text-violet-300/80 mb-2">Conversations</div>
      <div className="space-y-1 max-h-64 overflow-auto pr-1">
        {threads.map(t=>(
          <button key={t.id} onClick={()=>onSelect(t.id)} onContextMenu={(e)=>{e.preventDefault(); rename(t.id);}}
            className={`w-full text-left px-3 py-2 rounded-lg hover:bg-violet-900/30 ${active===t.id?"bg-violet-900/40":""}`}>
            <div className="truncate">{t.title}</div>
            {t.last && <div className="text-[11px] text-zinc-400 truncate">{t.last}</div>}
          </button>
        ))}
      </div>
      <div className="flex gap-2 mt-2">
        <input value={name} onChange={e=>setName(e.target.value)} placeholder="New chat name"
          className="flex-1 bg-black/40 border border-violet-800/40 rounded-lg px-3 py-2 text-sm"/>
        <button onClick={create} className="px-3 py-2 rounded-lg bg-violet-600 text-sm">Add</button>
      </div>
    </div>
  );
}