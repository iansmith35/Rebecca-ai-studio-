"use client";
import { useEffect, useRef, useState } from "react";

function pickUKFemale(): SpeechSynthesisVoice | null {
  const v = speechSynthesis.getVoices();
  const en = v.filter(x => (x.lang||"").toLowerCase().startsWith("en-gb"));
  return en.find(x=>/female/i.test(x.name)) || en[0] || null;
}

export default function HandsFree({ onText, speech }:{ onText:(t:string)=>void; speech?:string }){
  const recRef = useRef<any>(null);
  const [listening,setListening]=useState(false);
  const [voice,setVoice]=useState<SpeechSynthesisVoice|null>(null);

  useEffect(()=>{ const load=()=>setVoice(pickUKFemale());
    if (speechSynthesis.getVoices().length) load(); else speechSynthesis.onvoiceschanged = load; },[]);
  useEffect(()=>{ if (!speech) return; const u=new SpeechSynthesisUtterance(speech); if(voice) u.voice=voice; u.lang="en-GB"; speechSynthesis.cancel(); speechSynthesis.speak(u); },[speech,voice]);

  const start=()=>{ const SR:any=(window as any).webkitSpeechRecognition||(window as any).SpeechRecognition;
    if(!SR) return alert("SpeechRecognition not supported");
    const rec=new SR(); recRef.current=rec; rec.lang='en-GB'; rec.continuous=true;
    rec.onresult=(e:any)=>{ const t=e.results[e.results.length-1][0].transcript.trim(); onText(t); };
    rec.onend=()=>setListening(false); rec.start(); setListening(true);
  };
  const stop=()=>{ recRef.current?.stop(); setListening(false); };
  return (<button onClick={listening?stop:start} className={`px-3 py-1 rounded-lg text-sm ${listening?"bg-red-600":"bg-violet-700"}`}>{listening?"Stop":"Mic"}</button>);
}