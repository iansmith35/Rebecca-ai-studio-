"use client";
import Chat from "./Chat";
import QuickTask from "./QuickTask";
import Tasks from "./Tasks";
import DriveBrowser from "./DriveBrowser";
import TextMagicPanel from "./TextMagicPanel";
import { REBECCA } from "@/lib/rebeccaConfig";
import { useEffect, useState } from "react";

async function proxy(action:string,payload:any){ 
  const r=await fetch(REBECCA.appsScriptURL,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({action,...payload})}); 
  return await r.json(); 
}

function List({title, items}:{title:string; items:any[]}) {
  return (
    <div className="neon" style={{padding:14}}>
      <div className="card-title">{title}</div>
      <ul style={{display:"grid", gap:8}}>
        {items.map((it:any, i:number)=>(
          <li key={i} className="neon" style={{padding:"8px 10px"}}>
            <b>{it.title || it.subject || it.name}</b>
            {it.time && <span className="small"> • {String(it.time)}</span>}
            {it.snippet && <div className="small">{it.snippet}</div>}
          </li>
        ))}
      </ul>
    </div>
  );
}

export function ISHEPanel(){
  const [emails,setEmails]=useState<any[]>([]);
  const [events,setEvents]=useState<any[]>([]);
  useEffect(()=>{ (async()=>{
    const e=await proxy('listEmails',{ max:15 }); setEmails(e?.items||[]);
    const c=await proxy('listCalendar',{ max:20 }); setEvents(c?.items||[]);
  })(); },[]);
  return (

    <div className="grid" style={{gap:16}}>
      <Chat threadId="default-ishe"/>
      <QuickTask/>
      <List title="Upcoming Appointments (Calendar)" items={events}/>
      <List title="Recent Emails" items={emails}/>
      <DriveBrowser scope="ishe"/>
      <TextMagicPanel/>
      <div className="neon" style={{padding:14}}>
        <div className="card-title">QuickBooks</div>
        <div className="small">We&apos;ll add OAuth here (QuickBooks requires a Connect button). For now this is a placeholder.</div>

      </div>
    </div>
  );
}

export function PersonalPanel(){
  const [ok,setOk]=useState(false);
  const [pin,setPin]=useState("");
  if(!ok) return (
    <div className="neon" style={{padding:14}}>
      <div className="card-title">Personal Hub</div>
      <div className="row">
        <input className="input" value={pin} onChange={e=>setPin(e.target.value)} placeholder="Enter PIN"/>
        <button onClick={()=>setOk(pin===REBECCA.personalPin)} className="btn">Unlock</button>
      </div>
    </div>
  );
  return (
    <div className="grid" style={{gap:16}}>
      <Chat threadId="default-personal"/>
      <DriveBrowser scope="personal"/>
    </div>
  );
}