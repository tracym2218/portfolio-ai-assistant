import React, { useRef, useState } from "react";
import { Sparkles } from "lucide-react";
import AISectionCard from "../ai/AISectionCard.jsx";
import { useFilters } from "../../context/FilterContext.jsx";
import { SYSTEM_PROMPT_BASE, TONE_PROMPTS, buildPortfolioContext } from "../../hooks/useClaudeAI.js";
import { INSIGHTS_DIMENSIONS } from "../../utils/dimensions.js";

const SECTIONS = [
  { id: "executive_summary", title: "Executive Summary", dims: INSIGHTS_DIMENSIONS.executive_summary, task: "Write a 2-3 sentence executive summary of portfolio performance this quarter." },
  { id: "top_performers", title: "Top Performers", dims: INSIGHTS_DIMENSIONS.top_performers, task: "Identify the 2-3 top-performing companies with specific data callouts. Bullet list." },
  { id: "watch_list", title: "Watch List", dims: INSIGHTS_DIMENSIONS.watch_list, task: "Identify at-risk or below-plan companies. For each: name, key metric problem, suggested operator action. Bullet list." },
  { id: "sector_themes", title: "Sector Themes", dims: INSIGHTS_DIMENSIONS.sector_themes, task: "Summarize cross-portfolio themes by the selected dimension. 2-4 bullets." },
  { id: "recommended_actions", title: "Recommended Actions", dims: INSIGHTS_DIMENSIONS.recommended_actions, task: "List 3-5 prioritized deal team action items. Specific, assignable, time-bound. Numbered list." },
  { id: "lp_talking_points", title: "LP Talking Points", dims: INSIGHTS_DIMENSIONS.lp_talking_points, task: "Draft 4-6 bullet points suitable for an LP update memo. Confident and specific." }
];

export default function InsightsPanel() {
  const { filteredCompanies: companies, selectedFund, selectedQuarter: quarter } = useFilters();
  const fund = selectedFund === "all" ? "All Alpha PE funds" : selectedFund;
  const [tone, setTone] = useState("Deal Team Internal");
  const refs = useRef({});

  const buildPromptFor = (section) => (dimension) => {
    const lens = (section.dims.find((d) => d.value === dimension) || {}).prompt || "";
    return {
      system: `${SYSTEM_PROMPT_BASE}\n\n${TONE_PROMPTS[tone]}`,
      user: `${buildPortfolioContext(fund, quarter, companies)}\n\nTASK: ${section.task}\n\nDIMENSION LENS: ${lens}\n\nReturn only the body content — no section heading, no preamble.`,
      maxTokens: 600
    };
  };

  const runAll = async () => {
    for (const s of SECTIONS) {
      const ref = refs.current[s.id];
      if (ref && !ref.isStreaming()) {
        await ref.generate();
      }
    }
  };

  return (
    <div>
      <div className="bg-bg-card border border-border-default rounded-[10px] p-4 mb-4 flex flex-wrap items-center gap-3">
        <button
          onClick={runAll}
          className="inline-flex items-center gap-2 bg-accent-gold text-bg-base font-bold px-4 py-2 rounded hover:bg-accent-gold-dim transition"
        >
          <Sparkles className="w-4 h-4" />
          Generate Commentary
        </button>

        <div className="flex items-center gap-2">
          <span className="text-[11px] uppercase tracking-wider text-text-muted">Tone</span>
          <select
            value={tone}
            onChange={(e) => setTone(e.target.value)}
            className="bg-bg-surface border border-border-default rounded px-2 py-1.5 text-sm focus:border-accent-gold outline-none"
          >
            {Object.keys(TONE_PROMPTS).map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </div>

        <div className="ml-auto text-xs text-text-muted mono">
          {companies.length} companies · {quarter}
        </div>
      </div>

      <div className="space-y-3">
        {SECTIONS.map((s) => (
          <AISectionCard
            key={s.id}
            ref={(r) => {
              refs.current[s.id] = r;
            }}
            sectionKey={`insights.${s.id}`}
            title={s.title}
            dimensions={s.dims}
            buildPrompt={buildPromptFor(s)}
          />
        ))}
      </div>
    </div>
  );
}
