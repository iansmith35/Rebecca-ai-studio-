export const metadata = { title: "Rebecca Studio" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <style>{`
          :root{ 
            --bg:#07090e; 
            --panel:#0c1020; 
            --glow:#7c5cff; 
            --ink:#d7d9ff; 
            --muted:#9aa3c7; 
            --border:#1b1f33; 
          }
          html,body{background:var(--bg); color:var(--ink);}
          *{box-sizing:border-box;}
          .neon{ 
            border:1px solid var(--border); 
            background:linear-gradient(180deg,rgba(124,92,255,.08),rgba(124,92,255,.02) 80%), var(--panel); 
            box-shadow:0 0 0 1px rgba(124,92,255,.15) inset, 0 0 40px rgba(124,92,255,.06); 
            border-radius:18px; 
          }
          .btn{ 
            background:#5b48ff; 
            color:white; 
            border-radius:12px; 
            padding:.55rem .9rem; 
            cursor:pointer;
            border:none;
          }
          .input{ 
            background:#0b1122; 
            border:1px solid var(--border); 
            color:var(--ink); 
            border-radius:12px; 
            padding:.55rem .8rem; 
            width:100%; 
          }
          .h{ font-weight:700; letter-spacing:.4px;}
          .small{color:var(--muted); font-size:12px}
          .row{display:flex; gap:10px; align-items:center;}
          .grid{display:grid; gap:16px;}
          .grid-2{grid-template-columns:1fr 1fr;}
          .card-title{font-weight:600; margin-bottom:.4rem;}
          .link{color:#b5b9ff; text-decoration:underline;}
          .chip{padding:.25rem .5rem; border:1px solid var(--border); border-radius:999px; background:#0b1122; color:var(--muted);}
          .badge{font-size:11px; color:#cfe; opacity:.85}
          
          /* Legacy compatibility classes */
          body{
            margin:0; font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial;
            height:100%;
          }
          html{height:100%;}
          a{color:#b5b9ff; text-decoration:none}
          a:hover{text-decoration:underline}
          .neon-title{
            font-weight:800; letter-spacing:.4px;
            text-shadow: 0 0 2px var(--glow), 0 0 24px var(--glow), 0 0 48px var(--glow);
          }
          .glass{
            border:1px solid var(--border); 
            background:linear-gradient(180deg,rgba(124,92,255,.08),rgba(124,92,255,.02) 80%), var(--panel); 
            box-shadow:0 0 0 1px rgba(124,92,255,.15) inset, 0 0 40px rgba(124,92,255,.06); 
            border-radius:18px; 
          }
          .btn:hover{ filter:brightness(1.1)}

          .input{
            background: #0b0f2d; border:1px solid rgba(6,182,212,.35); color:var(--fg);
            border-radius:12px; padding:10px 12px;
          }
          .chip{font-size:12px; color:var(--muted)}
          .h{font-weight:600}
          .small{font-size:12px; color:var(--muted); text-transform:uppercase; letter-spacing:1px}
          .neon{
            border:none; padding:10px 12px; border-radius:8px; 
            color:var(--fg); cursor:pointer; font-size:14px;
          }
          .neon:hover{opacity:0.8}
          .grid{display:grid; gap:4px}

        `}</style>
      </head>
      <body>{children}</body>
    </html>
  );
}