
"use client";
import { REBECCA } from "@/lib/rebeccaConfig";
export default function Sidebar({ active, onSelect }:{ active:string; onSelect:(k:string)=>void }){
  return (
    <aside className="w-64 bg-zinc-900 text-zinc-100 h-screen p-4 space-y-6">
      <div className="text-lg font-semibold">Rebecca</div>
      <div className="text-xs uppercase tracking-wide text-zinc-400">Businesses</div>
      <nav className="space-y-2">
        {REBECCA.brands.map(b=> (
          <button key={b.key} onClick={()=>onSelect(b.key)} className={`w-full text-left px-3 py-2 rounded-lg hover:bg-zinc-800 ${active===b.key?"bg-zinc-800":''}`}>{b.label}</button>
        ))}
      </nav>
      <div className="text-xs uppercase tracking-wide text-zinc-400">Integrations</div>
      <div className="text-sm text-zinc-300">Gmail • Calendar • Drive • Docs • Sheets • QuickBooks • Banking</div>
    </aside>
  );
}
