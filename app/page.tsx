"use client";

import Sidebar from "@/components/Sidebar";
import { ISHEPanel, PersonalPanel } from "@/components/Panels";
import Card from "@/components/Card";
import { REBECCA } from "@/lib/rebeccaConfig";
import { useState } from "react";

export default function Page() {
  const defaultTab = (REBECCA.brands.find(b => b.default)?.key ?? "ishe") as string;
  const [active, setActive] = useState<string>(defaultTab);

  return (
    <main className="min-h-screen" style={{ display: "flex" }}>
      <Sidebar active={active} onSelect={(k: string) => setActive(k)} />
      <section style={{ flex: 1, padding: 24 }}>
        <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <h1 style={{ fontSize: 20, fontWeight: 600 }}>{label(active)}</h1>
          <div style={{ fontSize: 13, color: "#a1a1aa" }}>
            Health: <a href="/api/health">/api/health</a>
          </div>
        </header>
        {active === "ishe" && <ISHEPanel />}
        {active === "personal" && <PersonalPanel />}
        {active === "eventsafe" && <Card title="Event Safe">Linked later. Placeholder panel.</Card>}
        {active === "kinkybrizzle" && <Card title="Kinky Brizzle">Linked later. Placeholder panel.</Card>}
      </section>
    </main>
  );

  function label(key: string) {
    const m = REBECCA.brands.find(x => x.key === key);
    return m?.label || key;
  }
}