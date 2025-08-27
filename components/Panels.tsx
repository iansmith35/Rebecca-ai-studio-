"use client";
import Card from "./Card";
import Chat from "./Chat";
import QuickTask from "./QuickTask";
import DriveBrowser from "./DriveBrowser";
import TextMagicPanel from "./TextMagicPanel";
import Conversations from "./Conversations";
import { useEffect, useState } from "react";
import { REBECCA } from "@/lib/rebeccaConfig";

export function ISHEPanel(){
  const [thread,setThread]=useState<string>("default-ishe");
  useEffect(()=>{ if(!thread) setThread("default-ishe"); },[thread]);
  return (
    <div className="grid grid-cols-1 xl:grid-cols-[260px_1fr] gap-4">
      <div>
        <Conversations active={thread} onSelect={setThread}/>
      </div>
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        <Card title="Chat (ISHE)"><Chat threadId={thread}/></Card>
        <Card title="Quick Add Task (Heartbeat)"><QuickTask/></Card>
        <Card title="Upcoming Appointments (Calendar)"><CalendarList/></Card>
        <Card title="Recent Emails"><EmailList/></Card>
        <Card title="ISHE Drive"><DriveBrowser scope="ishe"/></Card>
        <Card title="TextMagic"><TextMagicPanel/></Card>
      </div>
    </div>
  );
}

export function PersonalPanel(){
  const [ok,setOk]=useState(false); const [pin,setPin]=useState("");
  const [thread,setThread]=useState<string>("default-personal");
  if(!ok) return (<Card title="Enter PIN to access Personal Hub">
    <div className="flex gap-2">
      <input value={pin} onChange={e=>setPin(e.target.value)} placeholder="PIN" className="bg-black/40 border border-violet-800/40 rounded-xl px-3 py-2"/>
      <button onClick={()=>setOk(pin===REBECCA.personalPin)} className="px-3 py-2 rounded-xl bg-violet-600">Unlock</button>
    </div>
  </Card>);
  return (
    <div className="grid grid-cols-1 xl:grid-cols-[260px_1fr] gap-4">
      <div><Conversations active={thread} onSelect={setThread}/></div>
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        <Card title="Chat (Personal)"><Chat threadId={thread}/></Card>
        <Card title="Personal Drive"><DriveBrowser scope="personal"/></Card>
      </div>
    </div>
  );
}

// lightweight lists driven by backend
async function api(payload:any){ const r=await fetch("/api/rebecca",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(payload)}); return await r.json(); }

function EmailList(){
  const [items,setItems]=useState<any[]>([]);
  useEffect(()=>{ (async()=>{ const j=await api({action:"listEmails",max:10}); setItems(j?.items||[]); })(); },[]);
  return <List items={items} field="subject"/>;
}
function CalendarList(){
  const [items,setItems]=useState<any[]>([]);
  useEffect(()=>{ (async()=>{ const j=await api({action:"listCalendar",max:10}); setItems(j?.items||[]); })(); },[]);
  return <List items={items} field="title"/>;
}
function List({items,field}:{items:any[];field:string}){
  return (<ul className="divide-y divide-violet-800/30">
    {items.map((it,idx)=>(
      <li key={idx} className="py-2 text-sm">
        <div className="font-medium">{it[field]}</div>
        {it.time&&<div className="text-xs text-zinc-400">{String(it.time)}</div>}
        {it.snippet&&<div className="text-xs text-zinc-400">{it.snippet}</div>}
      </li>
    ))}
  </ul>);
}