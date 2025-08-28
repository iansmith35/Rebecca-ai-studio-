"use client";
import { useEffect, useState } from "react";
import { REBECCA } from "@/lib/rebeccaConfig";
import HandsFree from "./HandsFree";

type Task = { row:number; created:string; text:string; status:string; due?:string; completed?:string };

async function api(action:string, payload:any={}){
  const r=await fetch(REBECCA.appsScriptURL,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({action, ...payload})});
  return await r.json();
}

export default function QuickTask(){
  const [text,setText]=useState(""); const [items,setItems]=useState<Task[]>([]);
  const load=async()=>{ const j=await api("listTasks",{ sheetId:REBECCA.sheetId }); setItems(j?.items||[]); };
  useEffect(()=>{ load(); },[]);

  const add=async(t:string)=>{
    const v=t.trim(); if(!v) return;
    await api("addTask",{ sheetId:REBECCA.sheetId, text:v });
    setText(""); await load();
  };
  const markDone=async(row:number)=>{ await api("updateTask",{ sheetId:REBECCA.sheetId, row, status:"DONE" }); await load(); };
  const setDue=async(row:number)=>{
    const iso=prompt("Set due date (YYYY-MM-DD or blank to clear)","");
    await api("updateTask",{ sheetId:REBECCA.sheetId, row, due: iso||"" }); await load();
  };

  return (
    <div className="space-y-3">
      <div className="flex gap-2">
        <input value={text} onChange={e=>setText(e.target.value)} placeholder="e.g., remind me to order valves"
          className="flex-1 bg-black/40 border border-violet-800/40 rounded-xl px-3 py-2"/>
        <button onClick={()=>add(text)} className="px-3 py-2 rounded-xl bg-violet-600">Add</button>
        <HandsFree onText={(t)=>add(t)} />
      </div>
      <div className="text-xs text-zinc-400">Items auto-hide 7 days after completion.</div>
      <div className="max-h-64 overflow-auto border border-violet-800/30 rounded-xl">
        <table className="w-full text-sm">
          <thead className="bg-black/40"><tr>
            <th className="text-left p-2">Created</th>
            <th className="text-left p-2">Text</th>
            <th className="text-left p-2">Due</th>
            <th className="text-left p-2">Completed</th>
            <th className="p-2"></th>
          </tr></thead>
          <tbody>
            {items.map(t=>(
              <tr key={t.row} className="border-t border-violet-800/20">
                <td className="p-2">{t.created}</td>
                <td className="p-2">{t.text}</td>
                <td className="p-2">
                  <button onClick={()=>setDue(t.row)} className="underline">{t.due||"—"}</button>
                </td>
                <td className="p-2">{t.completed||"—"}</td>
                <td className="p-2">
                  {t.status!=="DONE" && <button onClick={()=>markDone(t.row)} className="px-2 py-1 rounded bg-emerald-600 text-xs">Done</button>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}