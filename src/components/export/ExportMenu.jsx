import React, { useState } from "react";
import { FileDown, FileText, Presentation, Loader2, Sparkles } from "lucide-react";
import { useFilters } from "../../context/FilterContext.jsx";
import { useAIContent } from "../../context/AIContentContext.jsx";
import {
  streamText,
  SYSTEM_PROMPT_BASE,
  TONE_PROMPTS,
  buildPortfolioContext,
  apiKeyConfigured
} from "../../hooks/useClaudeAI.js";
import { buildPDF } from "./PDFGenerator.js";
import { buildPPTX } from "./PPTXGenerator.js";

const DEFAULT_SECTIONS = {
  kpi: true,
  chart: true,
  table: true,
  insights: true,
  watchList: true,
  lpTalkingPoints: true,
  marketIntelligence: true
};

// Map internal section keys used by generators → AIContentContext keys + fallback prompts.
const AI_SECTION_DEFS = {
  executiveSummary: {
    contextKey: "insights.executive_summary",
    prompt: "2-3 sentence top-of-house executive summary."
  },
  topPerformers: {
    contextKey: "insights.top_performers",
    prompt: "Identify top 2-3 performers with specific metrics. Short bullets."
  },
  sectorThemes: {
    contextKey: "insights.sector_themes",
    prompt: "2-3 cross-portfolio sector themes. Short bullets."
  },
  recommendedActions: {
    contextKey: "insights.recommended_actions",
    prompt: "3-5 numbered prioritized deal team actions."
  },
  watchList: {
    contextKey: "insights.watch_list",
    prompt: "At-risk / below-plan companies: name, key metric problem, suggested action."
  },
  lpTalkingPoints: {
    contextKey: "insights.lp_talking_points",
    prompt: "4-6 LP-facing bullets suitable for an update memo."
  }
};

export default function ExportMenu() {
  const { filteredCompanies: companies, selectedFund, selectedQuarter: quarter } = useFilters();
  const fund = selectedFund === "all" ? "All Alpha PE funds" : selectedFund;
  const { aiContent, setSection } = useAIContent();

  const [sections, setSections] = useState(DEFAULT_SECTIONS);
  const [format, setFormat] = useState("pdf");
  const [status, setStatus] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");

  const toggle = (k) => setSections((s) => ({ ...s, [k]: !s[k] }));

  const generateAll = async () => {
    setBusy(true);
    setErr("");
    setStatus("");
    try {
      const aiText = {};
      const needAI = sections.insights || sections.watchList || sections.lpTalkingPoints;
      if (needAI) {
        const ctx = buildPortfolioContext(fund, quarter, companies);
        const system = `${SYSTEM_PROMPT_BASE}\n\n${TONE_PROMPTS["LP Update"]}`;
        const wanted = Object.keys(AI_SECTION_DEFS).filter((k) => {
          if (k === "watchList") return sections.watchList;
          if (k === "lpTalkingPoints") return sections.lpTalkingPoints;
          return sections.insights;
        });

        for (const k of wanted) {
          const def = AI_SECTION_DEFS[k];
          const existing = aiContent[def.contextKey]?.content;
          if (existing && existing.trim()) {
            aiText[k] = existing;
            continue;
          }
          if (!apiKeyConfigured()) {
            throw new Error(
              "VITE_ANTHROPIC_API_KEY is not set. Either add it to .env or generate sections from the Insights page first."
            );
          }
          setStatus(`Generating ${k}…`);
          const generated = await streamText({
            system,
            user: `${ctx}\n\nTASK: ${def.prompt}\n\nReturn only body content. No heading, no preamble.`,
            maxTokens: 500,
            onDelta: () => {}
          });
          aiText[k] = generated;
          setSection(def.contextKey, {
            content: generated,
            original: generated,
            isEdited: false,
            isStreaming: false,
            generatedAt: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
          });
        }
      }

      if (sections.marketIntelligence) {
        const mi = aiContent["market.synthesis"]?.content;
        if (mi && mi.trim()) aiText.marketSynthesis = mi;
      }

      setStatus(`Building ${format.toUpperCase()}…`);
      const args = { fund, quarter, companies, sections, aiText };
      if (format === "pdf") await buildPDF(args);
      else await buildPPTX(args);
      setStatus(`${format.toUpperCase()} downloaded.`);
    } catch (e) {
      setErr(e.message || "Export failed.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="grid md:grid-cols-[1fr_auto] gap-5">
      <div className="space-y-4">
        <div className="bg-bg-card border border-border-default rounded-[10px] p-4">
          <div className="text-[11px] uppercase tracking-wider text-text-muted mb-3">Sections</div>
          <div className="grid sm:grid-cols-2 gap-2.5">
            {[
              ["kpi", "KPI Summary"],
              ["chart", "Charts"],
              ["table", "Company Table"],
              ["insights", "AI Insights"],
              ["watchList", "Watch List"],
              ["lpTalkingPoints", "LP Talking Points"],
              ["marketIntelligence", "Market Intelligence Summary"]
            ].map(([k, label]) => (
              <label
                key={k}
                className="flex items-center gap-2 text-sm cursor-pointer hover:text-accent-gold"
              >
                <input
                  type="checkbox"
                  checked={sections[k]}
                  onChange={() => toggle(k)}
                  className="accent-accent-gold"
                />
                {label}
              </label>
            ))}
          </div>
        </div>

        <div className="bg-bg-card border border-border-default rounded-[10px] p-4">
          <div className="text-[11px] uppercase tracking-wider text-text-muted mb-3">Format</div>
          <div className="flex gap-2">
            <FormatButton
              active={format === "pdf"}
              onClick={() => setFormat("pdf")}
              icon={FileText}
              label="PDF"
            />
            <FormatButton
              active={format === "pptx"}
              onClick={() => setFormat("pptx")}
              icon={Presentation}
              label="PowerPoint"
            />
          </div>
        </div>

        <div>
          <button
            onClick={generateAll}
            disabled={busy}
            className="inline-flex items-center gap-2 bg-accent-gold text-bg-base font-bold px-5 py-2.5 rounded hover:bg-accent-gold-dim transition disabled:opacity-50"
          >
            {busy ? <Loader2 className="w-4 h-4 animate-spin" /> : <FileDown className="w-4 h-4" />}
            Generate Report
          </button>
          {status && <div className="text-xs text-text-secondary mt-2">{status}</div>}
          {err && <div className="text-sm text-status-risk mt-2">{err}</div>}
        </div>
      </div>

      <div className="bg-bg-card border border-border-default rounded-[10px] p-5 w-full md:w-72 self-start">
        <div className="text-[11px] uppercase tracking-wider text-text-muted mb-2">Will include</div>
        <ul className="text-sm space-y-1 text-text-primary">
          <li className="flex items-center gap-2"><Sparkles className="w-3 h-3 text-accent-gold" /> Cover page</li>
          {sections.kpi && <li>• Portfolio snapshot</li>}
          {sections.chart && <li>• Charts (Revenue, EBITDA, Margin)</li>}
          {sections.table && <li>• Company performance table</li>}
          {sections.insights && <li>• AI executive summary + actions</li>}
          {sections.watchList && <li>• Watch list</li>}
          {sections.lpTalkingPoints && <li>• LP talking points</li>}
          {sections.marketIntelligence && <li>• Market Intelligence synthesis (if generated)</li>}
        </ul>
        <div className="mt-4 text-[11px] text-text-muted leading-relaxed">
          Confidential — Prepared for internal use only. Not for distribution. Exports pull current
          content from the AI store, including any analyst edits.
        </div>
      </div>
    </div>
  );
}

function FormatButton({ active, onClick, icon: Icon, label }) {
  return (
    <button
      onClick={onClick}
      className={`flex-1 inline-flex items-center justify-center gap-2 px-4 py-2 rounded border transition ${
        active
          ? "border-accent-gold bg-accent-gold/10 text-accent-gold"
          : "border-border-default text-text-secondary hover:border-border-strong"
      }`}
    >
      <Icon className="w-4 h-4" />
      {label}
    </button>
  );
}
