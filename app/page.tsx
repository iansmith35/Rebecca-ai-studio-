"use client";
import "./globals.css";
import Sidebar from "@/components/Sidebar";
import { ISHEPanel, PersonalPanel } from "@/components/Panels";
import { REBECCA } from "@/lib/rebeccaConfig";
import { useState } from "react";

export default function Page(){ return <main><ClientShell/></main>; }

function ClientShell(){
  const [active,setActive]=useState<string>(REBECCA.brands.find(b=>b.default)?.key || "ishe");
  const label=(k:string)=>REBECCA.brands.find(x=>x.key===k)?.label || k;
  return (
    <div style={{display:"flex", minHeight:"100vh"}}>
      <Sidebar active={active} onSelect={setActive}/>
      <section style={{flex:1, padding:20, display:"grid", gap:16}}>
        <header className="row" style={{justifyContent:"space-between"}}>
          <h1 className="h" style={{fontSize:22}}>{label(active)} - Deployment Test {new Date().toISOString().slice(0,16)}</h1>
          <div className="row small">
            <a href="/api/rebecca" className="link">Health</a>
            <a href="/api/rebecca" className="link">•</a>
            <a href="#" onClick={(e)=>{e.preventDefault(); window.open("/api/rebecca","_blank");}} className="link">Authorize Backend</a>
          </div>
        </header>
        {active==="ishe" && <ISHEPanel/>}
        {active==="personal" && <PersonalPanel/>}
        {active==="eventsafe" && <div className="neon" style={{padding:14}}>Event Safe — placeholder</div>}
        {active==="kinkybrizzle" && <div className="neon" style={{padding:14}}>Kinky Brizzle — placeholder</div>}
      </section>
    </div>
  );
}