
"use client";
import { REBECCA } from "@/lib/rebeccaConfig";

export default function Sidebar({ active, onSelect }:{ active:string; onSelect:(k:string)=>void }) {
  return (
    <aside style={{ width: 280, padding: 16, height: "100vh", background: "linear-gradient(180deg,#070818,#04061a)" }}
           className="glass">
      <div className="neon-title" style={{ fontSize: 22, marginBottom: 12 }}>Rebecca</div>
      <div className="chip" style={{ textTransform: "uppercase", letterSpacing: 1 }}>Businesses</div>
      <nav style={{ marginTop: 8, display: "grid", gap: 8 }}>
        {REBECCA.brands.map(b => (
          <button key={b.key} onClick={()=>onSelect(b.key)}
            className="btn" style={{ textAlign:"left", background: active===b.key
              ? "linear-gradient(180deg, rgba(124,58,237,.55), rgba(6,182,212,.35))"
              : "linear-gradient(180deg, rgba(124,58,237,.28), rgba(6,182,212,.18))" }}>
            {b.label}
          </button>
        ))}
      </nav>
      <div className="chip" style={{ marginTop: 14, textTransform: "uppercase", letterSpacing: 1 }}>Integrations</div>
      <div style={{ fontSize: 13, color: "var(--muted)" }}>Gmail • Calendar • Drive • Docs • Sheets • QuickBooks • Banking</div>
    </aside>
  );
}
