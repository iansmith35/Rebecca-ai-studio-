export const metadata = { title: "Rebecca Studio" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <style>{`
          :root{
            --bg:#070818;
            --panel:#0b0e2a;
            --panel-2:#0a0d24;
            --fg:#e8eaff;
            --muted:#9aa3c7;
            --neon-1:#7c3aed;    /* purple */
            --neon-2:#06b6d4;    /* cyan   */
            --neon-3:#22c55e;    /* green  */
            --glow: 0 0 15px var(--neon-2), 0 0 35px var(--neon-1);
            --card-glow: 0 0 12px rgba(6,182,212,.35), inset 0 0 34px rgba(124,58,237,.15);
            --radius: 18px;
          }
          *{box-sizing:border-box}
          html,body{height:100%}
          body{
            margin:0; font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial;
            color:var(--fg); background: radial-gradient(1200px 800px at -10% -20%, rgba(124,58,237,.25), transparent 60%),
                              radial-gradient(900px 700px at 120% 120%, rgba(6,182,212,.18), transparent 55%),
                              var(--bg);
          }
          a{color:var(--neon-2); text-decoration:none}
          a:hover{text-decoration:underline}
          .neon-title{
            font-weight:800; letter-spacing:.4px;
            text-shadow: 0 0 2px var(--neon-2), 0 0 24px var(--neon-1), 0 0 48px var(--neon-1);
          }
          .glass{
            background: linear-gradient(180deg, rgba(255,255,255,.05), rgba(255,255,255,.03));
            border:1px solid rgba(124,58,237,.25);
            border-radius: var(--radius);
            box-shadow: var(--card-glow);
          }
          .btn{
            border-radius:12px; padding:10px 14px; border:1px solid rgba(124,58,237,.45);
            background: linear-gradient(180deg, rgba(124,58,237,.35), rgba(6,182,212,.25));
            color:#fff; cursor:pointer;
            box-shadow: 0 0 10px rgba(124,58,237,.5), inset 0 0 24px rgba(6,182,212,.22);
          }
          .btn:hover{ filter:brightness(1.1)}
          .input{
            background: #0b0f2d; border:1px solid rgba(6,182,212,.35); color:var(--fg);
            border-radius:12px; padding:10px 12px;
          }
          .chip{font-size:12px; color:var(--muted)}
        `}</style>
      </head>
      <body>{children}</body>
    </html>
  );
}