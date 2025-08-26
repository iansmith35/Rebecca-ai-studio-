"use client";
import Sidebar from "@/components/Sidebar";
import { ISHEPanel, PersonalPanel } from "@/components/Panels";
import Card from "@/components/Card";
import { REBECCA } from "@/lib/rebeccaConfig";
import { useState } from "react";

export default function Page(){
  const defaultTab = (REBECCA.brands.find(b=>b.default)?.key ?? "ishe") as string;
  const [active,setActive]=useState<string>(defaultTab);
  return (
    <main style={{ display:"flex", minHeight:"100vh", gap:16, padding:16 }}>
      <Sidebar active={active} onSelect={(k:string)=>setActive(k)} />
      <section style={{ flex:1, display:"grid", gap:16 }}>
        <header className="glass" style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:14 }}>
          <div className="neon-title" style={{ fontSize:24 }}>{label(active)}</div>
          <div className="chip">
            <a href="/api/health">Health</a> • <a href={REBECCA.appsScriptURL} target="_blank">Authorize Backend</a>
          </div>
        </header>
        {active==='ishe'&&<ISHEPanel/>}
        {active==='personal'&&<PersonalPanel/>}
        {active==='eventsafe'&&<Card title="Event Safe">Linked later. Placeholder panel.</Card>}
        {active==='kinkybrizzle'&&<Card title="Kinky Brizzle">Linked later. Placeholder panel.</Card>}
      </section>
    </main>
  );
  function label(key:string){ const m=REBECCA.brands.find(x=>x.key===key); return m?.label||key; }
}