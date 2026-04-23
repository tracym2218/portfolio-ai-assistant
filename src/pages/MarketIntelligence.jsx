import React, { useState } from "react";
import PageWrapper from "../components/layout/PageWrapper.jsx";
import PitchBookPanel from "../components/market-intelligence/PitchBookPanel.jsx";
import PreqinPanel from "../components/market-intelligence/PreqinPanel.jsx";
import CapIQPanel from "../components/market-intelligence/CapIQPanel.jsx";
import AISynthesisPanel from "../components/market-intelligence/AISynthesisPanel.jsx";

const TABS = [
  { id: "pitchbook", label: "PitchBook", accent: "#60a5fa" },
  { id: "preqin", label: "Preqin", accent: "#4ade80" },
  { id: "ciq", label: "Capital IQ", accent: "#c084fc" },
  { id: "ai", label: "AI Synthesis", accent: "#f59e0b" }
];

export default function MarketIntelligence() {
  const [active, setActive] = useState("pitchbook");
  return (
    <PageWrapper
      title="Market Intelligence"
      subtitle="PitchBook · Preqin · Capital IQ · AI Synthesis"
    >
      <div className="border-b border-border-default flex items-center gap-1 overflow-x-auto mb-4">
        {TABS.map((t) => {
          const isActive = active === t.id;
          return (
            <button
              key={t.id}
              onClick={() => setActive(t.id)}
              className={`px-3 py-2 text-sm whitespace-nowrap transition -mb-px border-b-2 ${
                isActive ? "text-text-primary" : "border-transparent text-text-secondary hover:text-text-primary"
              }`}
              style={isActive ? { borderColor: t.accent, color: t.accent } : {}}
            >
              {t.label}
            </button>
          );
        })}
      </div>

      {active === "pitchbook" && <PitchBookPanel />}
      {active === "preqin" && <PreqinPanel />}
      {active === "ciq" && <CapIQPanel />}
      {active === "ai" && <AISynthesisPanel />}
    </PageWrapper>
  );
}
