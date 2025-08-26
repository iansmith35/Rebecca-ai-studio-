"use client";
import Card from "./Card"; import Chat from "./Chat"; import Dropzone from "./Dropzone"; import { REBECCA } from "@/lib/rebeccaConfig"; import { useEffect, useState } from "react";

async function proxy(action:string,payload:any){ 
  const r=await fetch("/api/rebecca",{ method:"POST", headers:{ "Content-Type":"application/json" }, body: JSON.stringify({ action, ...payload })});
  return await r.json(); 
}
function List({items}:{items:any[]}){ 
  return (<ul style={{ margin:0, padding:0, listStyle:"none" }}>
    {items.map((it:any,idx:number)=>(<li key={idx} style={{ padding:"8px 0", borderBottom:"1px solid rgba(255,255,255,.06)" }}>
      <div style={{ fontWeight:600 }}>{it.title||it.subject||it.name}</div>
      {it.time&&<div className="chip">{String(it.time)}</div>}
      {it.snippet&&<div className="chip">{it.snippet}</div>}
    </li>))}
  </ul>); 
}

export function ISHEPanel(){
  const [emails,setEmails]=useState<any[]>([]); const [events,setEvents]=useState<any[]>([]); const [drive,setDrive]=useState<any[]>([]);
  const [err,setErr]=useState<string>("");

  useEffect(()=>{ (async()=>{
    const e=await proxy("listEmails",{max:10}); if(e?.ok) setEmails(e.items||[]); else setErr(e?.raw||e?.error||"");
    const c=await proxy("listCalendar",{max:10}); if(c?.ok) setEvents(c.items||[]); else setErr(prev=>prev||c?.raw||c?.error||"");
    const d=await proxy("listDrive",{scope:"ishe",max:12}); if(d?.ok) setDrive(d.items||[]); else setErr(prev=>prev||d?.raw||d?.error||"");
  })(); },[]);

  return (
    <div style={{ display:"grid", gap:16, gridTemplateColumns:"1fr 1fr" }}>
      <Card title="Chat (ISHE)"><Chat/></Card>
      <Card title="Quick Add Task (Heartbeat)"><QuickTask/></Card>
      <Card title="Upcoming Appointments (Calendar)">{events.length?<List items={events}/>:<Empty err={err}/>}</Card>
      <Card title="Recent Emails">{emails.length?<List items={emails}/>:<Empty err={err}/>}</Card>
      <Card title="ISHE Documents (Drive)">{drive.length?<List items={drive}/>:<Empty err={err}/>}</Card>
      <Card title="Drop Files to ISHE Drive"><Dropzone scope="ishe"/></Card>
    </div>
  );
}

export function PersonalPanel(){
  const [ok,setOk]=useState(false); const [pin,setPin]=useState("");
  const [drive,setDrive]=useState<any[]>([]); const [err,setErr]=useState("");
  useEffect(()=>{ if(ok){ (async()=>{ const d=await proxy("listDrive",{scope:"personal",max:16}); if(d?.ok) setDrive(d.items||[]); else setErr(d?.raw||d?.error||""); })(); } },[ok]);
  if(!ok) return (<Card title="Enter PIN to access Personal Hub">
    <div style={{ display:"flex", gap:8 }}>
      <input value={pin} onChange={e=>setPin(e.target.value)} placeholder="PIN" className="input"/>
      <button onClick={()=>setOk(pin===REBECCA.personalPin)} className="btn">Unlock</button>
    </div>
  </Card>);
  return (
    <div style={{ display:"grid", gap:16, gridTemplateColumns:"1fr 1fr" }}>
      <Card title="Chat (Personal)"><Chat/></Card>
      <Card title="Personal Documents (Drive)">{drive.length?<List items={drive}/>:<Empty err={err}/>}</Card>
      <Card title="Drop Files to Personal Drive"><Dropzone scope="personal"/></Card>
    </div>
  );
}

function Empty({err}:{err?:string}){ 
  return <div className="chip">{err?`Backend says: ${err}`:"Nothing to show yet."}</div>;
}
function QuickTask(){ const [text,setText]=useState(""); 
  const add=async()=>{ if(!text.trim())return; await proxy("addTask",{ sheetId:REBECCA.sheetId, text}); setText(""); alert("Task added to Heartbeat ✅"); };
  return (<div style={{ display:"flex", gap:8 }}><input value={text} onChange={e=>setText(e.target.value)} placeholder="e.g., remind me to order valves" className="input" style={{ flex:1 }}/><button onClick={add} className="btn">Add</button></div>);
}