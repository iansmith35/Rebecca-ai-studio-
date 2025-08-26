"use client";
import Card from "./Card"; import Chat from "./Chat"; import Dropzone from "./Dropzone"; import { REBECCA } from "@/lib/rebeccaConfig"; import { useEffect, useState } from "react";
async function proxy(action:string,payload:any){ const r=await fetch("/api/rebecca",{ method:"POST", headers:{ "Content-Type":"application/json" }, body: JSON.stringify({ action, ...payload })}); return await r.json(); }
function List({ items }:{ items:any[] }){ return (<ul style={{ borderTop:"1px solid #18181b" }}>{items.map((it:any,idx:number)=>(<li key={idx} style={{ padding:"8px 0", borderBottom:"1px solid #18181b" }}>
  <div style={{ fontWeight:600 }}>{it.title||it.subject||it.name}</div>{it.time&&<div style={{ fontSize:12, color:"#a1a1aa" }}>{String(it.time)}</div>}{it.snippet&&<div style={{ fontSize:12, color:"#a1a1aa" }}>{it.snippet}</div>}
</li>))}</ul>); }
export function ISHEPanel(){
  const [emails,setEmails]=useState<any[]>([]); const [events,setEvents]=useState<any[]>([]); const [drive,setDrive]=useState<any[]>([]);
  useEffect(()=>{ (async()=>{ const e=await proxy("listEmails",{ max:10 }); setEmails(e?.items||[]); const c=await proxy("listCalendar",{ max:10 }); setEvents(c?.items||[]); const d=await proxy("listDrive",{ scope:"ishe", max:15 }); setDrive(d?.items||[]); })(); },[]);
  return (<div style={{ display:"grid", gap:16, gridTemplateColumns:"1fr 1fr" }}>
    <Card title="Chat (ISHE)"><Chat/></Card>
    <Card title="Quick Add Task (Heartbeat)"><QuickTask/></Card>
    <Card title="Upcoming Appointments (Calendar)"><List items={events}/></Card>
    <Card title="Recent Emails"><List items={emails}/></Card>
    <Card title="ISHE Documents (Drive)"><List items={drive}/></Card>
    <Card title="Drop Files to ISHE Drive"><Dropzone scope="ishe"/></Card>
  </div>);
}
export function PersonalPanel(){
  const [ok,setOk]=useState(false); const [pin,setPin]=useState(""); const [drive,setDrive]=useState<any[]>([]);
  useEffect(()=>{ if(ok){ (async()=>{ const d=await proxy("listDrive",{ scope:"personal", max:20 }); setDrive(d?.items||[]); })(); } },[ok]);
  if(!ok) return (<Card title="Enter PIN to access Personal Hub"><div style={{ display:"flex", gap:8 }}>
    <input value={pin} onChange={e=>setPin(e.target.value)} placeholder="PIN" style={{ background:"#0b0b0b", border:"1px solid #18181b", borderRadius:12, padding:"8px 10px", color:"#e4e4e7" }}/>
    <button onClick={()=>setOk(pin===REBECCA.personalPin)} style={{ padding:"8px 12px", borderRadius:12, background:"#4f46e5", color:"#fff" }}>Unlock</button>
  </div></Card>);
  return (<div style={{ display:"grid", gap:16, gridTemplateColumns:"1fr 1fr" }}>
    <Card title="Chat (Personal)"><Chat/></Card>
    <Card title="Personal Documents (Drive)"><List items={drive}/></Card>
    <Card title="Drop Files to Personal Drive"><Dropzone scope="personal"/></Card>
  </div>);
}
function QuickTask(){ const [text,setText]=useState(""); const add=async()=>{ if(!text.trim()) return; await proxy("addTask",{ sheetId: REBECCA.sheetId, text }); setText(""); alert("Task added to Heartbeat ✅"); };
  return (<div style={{ display:"flex", gap:8 }}><input value={text} onChange={e=>setText(e.target.value)} placeholder="e.g., remind me to order valves"
    style={{ flex:1, background:"#0b0b0b", border:"1px solid #18181b", borderRadius:12, padding:"8px 10px", color:"#e4e4e7" }}/><button onClick={add} style={{ padding:"8px 12px", borderRadius:12, background:"#4f46e5", color:"#fff" }}>Add</button></div>);
}