"use client";
import { useEffect, useRef, useState } from "react";

function pickUKFemaleVoice() {
  const voices = speechSynthesis.getVoices();
  const cand = voices.find(v => v.lang?.startsWith("en-GB") && /female/i.test(v.name))
             || voices.find(v => v.lang?.startsWith("en-GB"))
             || voices[0];
  return cand || null;
}
function cleanForSpeech(t: string) {
  // Strip "*emoji*", "(crying emoji)", ":smile:" etc.
  return t
    .replace(/\*+[^*]*emoji[^*]*\*+/gi, "")
    .replace(/\([^)]*emoji[^)]*\)/gi, "")
    .replace(/:[a-z_]+:/gi, "")
    .replace(/\*\*/g,"");
}

export default function HandsFree({ onText, speech }:{ onText:(t:string)=>void; speech?:string }) {
  const recRef = useRef<any>(null);
  const [listening,setListening]=useState(false);

  // speak replies
  useEffect(()=>{
    if(!speech) return;
    const u = new SpeechSynthesisUtterance(cleanForSpeech(speech));
    u.voice = pickUKFemaleVoice();
    u.rate = 1.0; u.pitch = 1.05;
    speechSynthesis.cancel(); speechSynthesis.speak(u);
  },[speech]);

  const start=()=>{
    const SR:any=(window as any).webkitSpeechRecognition||(window as any).SpeechRecognition;
    if(!SR) return alert("SpeechRecognition not supported in this browser");
    const rec=new SR(); recRef.current=rec; rec.lang='en-GB'; rec.continuous=true; rec.interimResults=false;
    rec.onresult=(e:any)=>{ const t=e.results[e.results.length-1][0].transcript.trim(); onText(t);};
    rec.onend=()=>setListening(false); rec.start(); setListening(true);
  };
  const stop=()=>{ recRef.current?.stop(); setListening(false); };

  return <button onClick={listening?stop:start} className="btn">{listening?"Stop":"Hands-Free"}</button>;
}