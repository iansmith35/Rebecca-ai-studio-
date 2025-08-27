"use client";
import { useEffect, useState } from "react";
import { REBECCA } from "@/lib/rebeccaConfig";
import HandsFree from "./HandsFree";

async function proxy(action:string,payload:any){ 
  const r=await fetch('/api/rebecca',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({action,...payload})}); 
  return await r.json(); 
}

type Task={ id:string; created:string; text:string; status:"PENDING"|"DONE"; due?:string; doneAt?:string };

export default function Tasks() {
  const [text,setText]=useState("");
  const [tasks,setTasks]=useState<Task[]>([]);
  const [speech,setSpeech]=useState<string>("");

  const refresh=async()=>{
    const j = await proxy('listTasks',{ sheetId:REBECCA.sheetId });
    setTasks(j?.items||[]);
  };

  useEffect(()=>{ refresh(); },[]);

  const add=async(t:string)=>{
    if(!t.trim()) return;
    await proxy('addTask',{ sheetId:REBECCA.sheetId, text:t.trim() });
    setText(""); await refresh();
  };
  const complete=async(id:string)=>{
    await proxy('completeTask',{ sheetId:REBECCA.sheetId, id });
    await refresh();
  };

  return (
    <div className="neon" style={{padding:14}}>
      <div className="card-title">Quick Add Task (Heartbeat)</div>
      <div className="row">
        <input className="input" value={text} onChange={e=>setText(e.target.value)} onKeyDown={e=>e.key==="Enter"&&add(text)} placeholder="e.g., remind me to order valves by Friday 3pm"/>
        <button onClick={()=>add(text)} className="btn">Add</button>
        <HandsFree onText={add} speech={speech}/>
      </div>
      <div className="small" style={{marginTop:6}}>Items auto-hide 7 days after completion.</div>
      <ul style={{marginTop:10, display:"grid", gap:8}}>
        {tasks.map(t=>(
          <li key={t.id} className="neon" style={{padding:"8px 10px"}}>
            <div className="row" style={{justifyContent:"space-between"}}>
              <div>
                <b>{t.text}</b>
                <div className="small">Created {t.created}{t.due?` • Due ${t.due}`:""} {t.status==="DONE" && t.doneAt?` • Done ${t.doneAt}`:""}</div>
              </div>
              {t.status==="PENDING" ? <button className="btn" onClick={()=>complete(t.id)}>Complete</button> : <span className="badge">Done</span>}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}