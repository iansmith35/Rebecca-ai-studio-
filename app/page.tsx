"use client";
import { useState } from "react";
import Sidebar from "@/components/Sidebar"; 
import { ISHEPanel, PersonalPanel } from "@/components/Panels"; 
import Card from "@/components/Card"; 
import { REBECCA } from "@/lib/rebeccaConfig";

export default function Page(){ return (<main className="min-h-screen bg-black text-zinc-100"><div className="flex"><ClientShell/></div></main>); }

function ClientShell(){ const [active,setActive]=useState<string>(REBECCA.brands.find(b=>b.default)?.key||'ishe'); return (<><Sidebar active={active} onSelect={setActive}/><section className="flex-1 p-6 space-y-4"><header className="flex items-center justify-between"><h1 className="text-xl font-semibold">{label(active)}</h1><div className="text-sm text-zinc-400">Hands‑Free works from the chat widget</div></header>{active==='ishe'&&<ISHEPanel/>}{active==='personal'&&<PersonalPanel/>}{active==='eventsafe'&&<Card title="Event Safe">Linked later. Placeholder panel.</Card>}{active==='kinkybrizzle'&&<Card title="Kinky Brizzle">Linked later. Placeholder panel.</Card>}</section></>); }
function label(key:string){ const m=REBECCA.brands.find(x=>x.key===key); return m?.label||key; }