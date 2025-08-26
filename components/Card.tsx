import { ReactNode } from "react";
export default function Card({ title, children }:{ title:string; children:ReactNode }){
  return (<div className="rounded-2xl bg-zinc-900/50 border border-zinc-800 p-4"><div className="font-medium mb-2 text-zinc-200">{title}</div><div className="text-zinc-300 text-sm">{children}</div></div>);
}