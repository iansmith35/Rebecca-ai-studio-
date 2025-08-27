
"use client";
import { REBECCA } from "@/lib/rebeccaConfig";

export default function Sidebar({ active, onSelect }:{ active:string; onSelect:(k:string)=>void }){
  return (
    <aside style={{width:240, padding:16}}>
      <div className="h" style={{fontSize:18, marginBottom:16}}>Rebecca</div>
      <div className="small" style={{marginBottom:8}}>BUSINESSES</div>
      <nav className="grid">
        {REBECCA.brands.map(b=>(
          <button key={b.key} onClick={()=>onSelect(b.key)}
            className="neon" style={{padding:"10px 12px", textAlign:"left", background: active===b.key?"#13183a":"var(--panel)"}}>
            {b.label}
          </button>
        ))}
      </nav>
      <div className="small" style={{marginTop:16}}>INTEGRATIONS</div>
      <div className="small">Gmail • Calendar • Drive • Docs • Sheets • QuickBooks • Banking • TextMagic</div>
    </aside>
  );
}
