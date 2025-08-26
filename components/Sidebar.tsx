
"use client";
import { REBECCA } from "@/lib/rebeccaConfig";
export default function Sidebar({ active, onSelect }:{ active:string; onSelect:(k:string)=>void }) {
  return (
    <aside style={{ width: 256, background: "#0a0a0a", color: "#e4e4e7", height: "100vh", padding: 16 }}>
      <div style={{ fontSize: 18, fontWeight: 600, marginBottom: 12 }}>Rebecca</div>
      <div style={{ fontSize: 11, letterSpacing: 1, color: "#a1a1aa", textTransform: "uppercase" }}>Businesses</div>
      <nav style={{ marginTop: 8, display: "grid", gap: 8 }}>
        {REBECCA.brands.map(b => (
          <button key={b.key} onClick={() => onSelect(b.key)}
            style={{ textAlign: "left", padding: "8px 12px", borderRadius: 10, background: active===b.key ? "#18181b":"transparent", color: "#e4e4e7", border:"1px solid #18181b" }}>
            {b.label}
          </button>
        ))}
      </nav>
      <div style={{ marginTop: 16, fontSize: 11, letterSpacing: 1, color: "#a1a1aa", textTransform: "uppercase" }}>Integrations</div>
      <div style={{ fontSize: 13, color: "#c4c4cc" }}>Gmail • Calendar • Drive • Docs • Sheets • QuickBooks • Banking</div>
    </aside>
  );
}
