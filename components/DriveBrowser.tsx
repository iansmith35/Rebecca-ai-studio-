"use client";
import { useCallback, useEffect, useState } from "react";

type Entry = { id:string; name:string; type:"folder"|"file"; time?:string; mimeType?:string };
type Resp = { items: Entry[]; parentId?:string|null; rootId:string; currentId:string; isRoot:boolean };

async function api(payload:any){ const r=await fetch("/api/rebecca",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(payload)}); return await r.json(); }

export default function DriveBrowser({ scope }:{ scope:"ishe"|"personal" }){
  const [stack,setStack]=useState<string[]>([]); const [data,setData]=useState<Resp|null>(null);
  const load=useCallback(async(parentId?:string)=>{ const j:Resp=await api({action:"listDrive2", scope, parentId}); setData(j); },[scope]);
  useEffect(()=>{ load(); },[load]);
  const enter=(id:string)=>{ setStack(s=>[...s,id]); load(id); };
  const up=()=>{ if(!data) return; if(data.isRoot) return; load(data.parentId||undefined); setStack(s=>s.slice(0,-1)); };

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <button onClick={up} className="px-2 py-1 rounded bg-zinc-800 border border-violet-800/40 text-xs">Up</button>
        <div className="text-xs text-zinc-400 truncate">Current: {data?.currentId||"root"}</div>
      </div>
      <ul className="divide-y divide-violet-800/30">
        {data?.items?.map(it=>(
          <li key={it.id} className="py-2 text-sm flex items-center justify-between">
            <div>
              <span className="mr-2">{it.type==="folder"?"📁":"📄"}</span>
              {it.type==="folder"
                ? <button className="underline" onClick={()=>enter(it.id)}>{it.name}</button>
                : <a className="underline" href={`https://drive.google.com/open?id=${it.id}`} target="_blank" rel="noreferrer">{it.name}</a>}
            </div>
            <div className="text-xs text-zinc-400">{it.time?new Date(it.time).toLocaleString():""}</div>
          </li>
        ))}
      </ul>
    </div>
  );
}