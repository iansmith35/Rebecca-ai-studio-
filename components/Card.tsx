import { ReactNode } from "react";
export default function Card({ title, children }:{ title:string; children:ReactNode }){
  return (
    <div className="glass" style={{ padding:16, borderRadius:18 }}>
      <div className="neon-title" style={{ fontSize:16, marginBottom:8 }}>{title}</div>
      <div style={{ fontSize:14, color:"var(--ink)" }}>{children}</div>
    </div>
  );
}