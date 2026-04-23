import React from "react";

const COLORS = {
  PB: { bg: "bg-[#60a5fa]/15", text: "text-[#60a5fa]", border: "border-[#60a5fa]/40" },
  PQ: { bg: "bg-[#4ade80]/15", text: "text-[#4ade80]", border: "border-[#4ade80]/40" },
  CIQ: { bg: "bg-[#c084fc]/15", text: "text-[#c084fc]", border: "border-[#c084fc]/40" },
  AI: { bg: "bg-accent-gold/15", text: "text-accent-gold", border: "border-accent-gold/40" }
};

export default function SourceBadge({ code = "PB", label }) {
  const c = COLORS[code] || COLORS.PB;
  return (
    <span
      className={`inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border ${c.bg} ${c.text} ${c.border}`}
    >
      <span>{code}</span>
      {label && <span className="font-semibold tracking-normal normal-case">{label}</span>}
    </span>
  );
}
