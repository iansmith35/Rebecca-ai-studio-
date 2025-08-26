"use client";
import { useState } from "react"; import { REBECCA } from "@/lib/rebeccaConfig";
export default function Dropzone({ scope }:{ scope:"ishe"|"personal" }) {
  const [busy,setBusy]=useState(false); const [msg,setMsg]=useState("");
  const onChange=async(files:FileList|null)=>{ if(!files||!files.length) return; setBusy(true); setMsg("");
    try{ for(const f of Array.from(files)){ const buf=await f.arrayBuffer(); const base64=btoa(String.fromCharCode(...new Uint8Array(buf)));
      const res=await fetch("/api/rebecca",{ method:"POST", headers:{ "Content-Type":"application/json" },
        body: JSON.stringify({ action:"uploadFile", sheetId:REBECCA.sheetId, filename:f.name, mimeType:f.type||"application/octet-stream", base64, scope })});
      const j=await res.json(); if(!j?.ok) throw new Error(j?.error||"Upload failed"); } setMsg("Uploaded ✅");
    }catch(e:any){ setMsg(e.message||String(e)); } setBusy(false);
  };
  return (<label className={`block`} style={{ border:"2px dashed #27272a", borderRadius:16, padding:24, textAlign:"center", opacity:busy?0.6:1 }}>
    <div style={{ marginBottom:8, fontWeight:600 }}>Drop files here or click to browse</div>
    <input type="file" multiple className="hidden" onChange={e=>onChange(e.target.files)} />
    <div style={{ fontSize:12, color:"#a1a1aa" }}>Target: {scope==="ishe"?"ISHE_Uploads":"Personal_Uploads"}</div>
    {msg && <div style={{ marginTop:8 }}>{msg}</div>}
  </label>);
}