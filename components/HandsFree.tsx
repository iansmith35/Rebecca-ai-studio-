"use client";
import { useEffect, useRef, useState } from "react";

export default function HandsFree({ onText, speech }:{ onText:(t:string)=>void; speech?:string }) {
  const recRef = useRef<any>(null);
  const [listening,setListening]=useState(false);
  const [voice,setVoice]=useState<SpeechSynthesisVoice|null>(null);

  useEffect(()=>{
    const pick = ()=>{
      const voices = window.speechSynthesis.getVoices();
      // Prefer en-GB female voices commonly available
      const preferred = ["Google UK English Female","en-GB","Samantha","Serena","Martha","Hazel"];
      const found = voices.find(v=> v.lang?.toLowerCase().includes("en-gb") && /female|Google UK English/i.test(v.name))
                  || voices.find(v=> preferred.some(p => v.name.includes(p)));
      setVoice(found || voices[0] || null);
    };
    window.speechSynthesis.onvoiceschanged = pick;
    pick();
  },[]);

  useEffect(()=>{
    if (speech){
      const u = new SpeechSynthesisUtterance(speech);
      if(voice) u.voice = voice;
      u.lang = "en-GB"; u.pitch = 1.05; u.rate = 0.98;
      speechSynthesis.cancel(); speechSynthesis.speak(u);
    }
  },[speech,voice]);

  const start=()=>{
    const SR:any=(window as any).webkitSpeechRecognition||(window as any).SpeechRecognition;
    if(!SR) return alert("SpeechRecognition not supported in this browser.");
    const rec=new SR(); recRef.current=rec; rec.lang="en-GB"; rec.continuous=true;
    rec.onresult=(e:any)=>{ const t=e.results[e.results.length-1][0].transcript.trim(); onText(t); };
    rec.onend=()=>setListening(false); rec.start(); setListening(true);
  };
  const stop=()=>{ recRef.current?.stop(); setListening(false); };

  return <button onClick={listening?stop:start} className="btn">{listening?"Stop":"Hands-Free"}</button>;
}