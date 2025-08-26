"use client";
import { useEffect, useRef, useState } from "react";
export default function HandsFree({ onText, speech }:{ onText:(t:string)=>void; speech?:string }) {
  const recRef = useRef<any>(null); const [listening,setListening]=useState(false);
  useEffect(()=>{ if (speech){ const u = new SpeechSynthesisUtterance(speech); speechSynthesis.cancel(); speechSynthesis.speak(u);} },[speech]);
  const start=()=>{ const SR:any=(window as any).webkitSpeechRecognition||(window as any).SpeechRecognition; if(!SR) return alert("SpeechRecognition not supported"); const rec=new SR(); recRef.current=rec; rec.lang="en-GB"; rec.continuous=true; rec.onresult=(e:any)=>{ const t=e.results[e.results.length-1][0].transcript.trim(); onText(t);}; rec.onend=()=>setListening(false); rec.start(); setListening(true); };
  const stop=()=>{ recRef.current?.stop(); setListening(false); };
  return (<button onClick={listening?stop:start} style={{ padding:"6px 10px", borderRadius:8, background:listening?"#dc2626":"#3f3f46", color:"#fff" }}>{listening?"Stop":"Hands-Free"}</button>);
}