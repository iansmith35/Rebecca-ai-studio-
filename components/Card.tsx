import { ReactNode } from "react";
export default function Card({ title, children }:{ title:string; children:ReactNode }) {
  return (
    <div style={{ borderRadius: 16, background: "#0b0b0b", border: "1px solid #18181b", padding: 16 }}>
      <div style={{ fontWeight: 600, marginBottom: 8, color: "#e4e4e7" }}>{title}</div>
      <div style={{ fontSize: 14, color: "#c4c4cc" }}>{children}</div>
    </div>
  );
}