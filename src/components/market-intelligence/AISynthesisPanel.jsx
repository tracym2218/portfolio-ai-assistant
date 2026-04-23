import React from "react";
import AISectionCard from "../ai/AISectionCard.jsx";
import SourceBadge from "./SourceBadge.jsx";
import { useFilters } from "../../context/FilterContext.jsx";
import {
  PITCHBOOK_SECTOR_MULTIPLES,
  PREQIN_FUND_BENCHMARKS,
  CIQ_TRANSACTION_COMPS
} from "../../utils/marketData.js";
import { SYSTEM_PROMPT_BASE, buildPortfolioContext } from "../../hooks/useClaudeAI.js";

const DIMS = [
  { value: "full-synthesis", label: "Full synthesis", prompt: "Produce a cross-source synthesis — PitchBook valuation view, Preqin fund positioning, CIQ transaction environment. Tie to portfolio." },
  { value: "exit-opportunities", label: "Exit opportunities", prompt: "Identify the 2-3 portfolio companies best positioned for exit, with buyer type and indicative value range." },
  { value: "watch-list-deep", label: "Watch list deep dive", prompt: "Deep dive on the at-risk names, cross-referencing transaction comps and benchmarks. What would change the trajectory?" },
  { value: "lp-memo", label: "LP memo narrative", prompt: "Draft a tight LP memo narrative incorporating all three data sources. Formal, confident." }
];

export default function AISynthesisPanel() {
  const { filteredCompanies, selectedFund, selectedQuarter } = useFilters();
  const fund = selectedFund === "all" ? "All Alpha PE funds" : selectedFund;

  const buildPrompt = (dim) => {
    const lens = (DIMS.find((d) => d.value === dim) || {}).prompt || "";
    const portfolioCtx = buildPortfolioContext(fund, selectedQuarter, filteredCompanies);
    const pb = Object.entries(PITCHBOOK_SECTOR_MULTIPLES)
      .map(([sec, m]) => `${sec}: median ${m.median}x (P25 ${m.p25}x · P75 ${m.p75}x)`)
      .join("; ");
    const pq = PREQIN_FUND_BENCHMARKS.map(
      (b) => `${b.fund} vintage ${b.vintage}: TVPI ${b.tvpi}x (Q${b.quartile}), DPI ${b.dpi}x, IRR ${b.irr}%`
    ).join("; ");
    const ciq = CIQ_TRANSACTION_COMPS.slice(0, 6)
      .map((t) => `${t.date} ${t.target} (${t.sector}) EV $${t.ev}M at ${t.evEbitda}x`)
      .join("; ");

    return {
      system: SYSTEM_PROMPT_BASE,
      user: `${portfolioCtx}

MARKET INTELLIGENCE CONTEXT:
PitchBook sector multiples — ${pb}
Preqin benchmarks — ${pq}
Capital IQ recent transactions — ${ciq}

TASK: Produce cross-source synthesis commentary for the portfolio in the selected dimension. Reference specific numbers.

DIMENSION LENS: ${lens}

Body only. No preamble.`,
      maxTokens: 700
    };
  };

  return (
    <div className="space-y-4">
      <div className="bg-bg-surface border border-border-default rounded-[10px] p-4">
        <div className="flex items-center gap-2 flex-wrap mb-2">
          <SourceBadge code="AI" label="Cross-source synthesis" />
        </div>
        <p className="text-sm text-text-secondary leading-relaxed">
          Combines PitchBook sector multiples, Preqin fund benchmarks, and Capital IQ transaction
          activity with the current filtered portfolio. Content persists across navigation and
          respects any analyst edits.
        </p>
      </div>

      <AISectionCard
        sectionKey="market.synthesis"
        title="AI Synthesis"
        dimensions={DIMS}
        buildPrompt={buildPrompt}
      />
    </div>
  );
}
