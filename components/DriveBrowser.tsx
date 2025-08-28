"use client";
import { useCallback, useEffect, useState } from "react";
import { REBECCA } from "@/lib/rebeccaConfig";

async function proxy(action:string,payload:any){ 
  const r=await fetch(REBECCA.appsScriptURL,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({action,...payload})}); 
  return await r.json(); 
}

export default function DriveBrowser({ scope }:{ scope:"ishe"|"personal" }) {
  const [stack,setStack]=useState<{id:string,name:string}[]>([]);
  const cur = stack[stack.length-1];

  const [items,setItems]=useState<any[]>([]);
  const load=useCallback(async()=>{
    const j = await proxy('listDrive',{ scope, folderId:cur?.id || null, max:100 });
    if(j?.ok) setItems(j.items || []);
  },[scope, cur?.id]);
  useEffect(()=>{ load(); },[load]);

  const enter=(it:any)=>{ if(it.kind==="folder") setStack([...stack,{id:it.id,name:it.title}]); };
  const up=()=>{ if(stack.length>0) setStack(stack.slice(0,-1)); };

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <button onClick={up} className="px-2 py-1 rounded bg-zinc-800 border border-violet-800/40 text-xs">Up</button>
        <div className="text-xs text-zinc-400 truncate">Current: {cur?.name || "root"}</div>
      </div>
      <ul className="divide-y divide-violet-800/30">
        {items.map((it:any)=>(
          <li key={it.id} className="py-2 text-sm flex items-center justify-between">
            <div>
              <span className="mr-2">{it.kind==="folder"?"📁":"📄"}</span>
              {it.kind==="folder"
                ? <button className="underline" onClick={()=>enter(it)}>{it.title}</button>
                : <a className="underline" href={`https://drive.google.com/open?id=${it.id}`} target="_blank" rel="noreferrer">{it.title}</a>}
            </div>
            <div className="text-xs text-zinc-400">{it.time ? new Date(it.time).toLocaleString() : ""}</div>
          </li>
        ))}
      </ul>
    </div>
  );
}