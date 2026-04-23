import React, { useCallback, useEffect, useState } from "react";
import { Sparkles, RotateCw } from "lucide-react";
import { useFilters } from "../../context/FilterContext.jsx";
import { useAIContent } from "../../context/AIContentContext.jsx";
import {
  generateNonStream,
  SYSTEM_PROMPT_BASE,
  buildPortfolioContext,
  apiKeyConfigured
} from "../../hooks/useClaudeAI.js";

const KEY = "dashboard.quick_insights";

const timestamp = () =>
  new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

// Lightweight signature of the portfolio — regens if data materially changed.
const portfolioSignature = (fund, quarter, companies) =>
  `${fund}|${quarter}|${companies.length}|${companies
    .map((c) => `${c.company}:${c.revenue}:${c.ebitda}`)
    .join(",")}`;

export default function QuickInsights() {
  const { filteredCompanies: companies, selectedFund, selectedQuarter: quarter } = useFilters();
  const fund = selectedFund === "all" ? "All Alpha PE funds" : selectedFund;
  const { aiContent, setSection, getSection } = useAIContent();

  const section = aiContent[KEY] || { content: [], signature: null, isStreaming: false };
  const items = Array.isArray(section.content) ? section.content : [];
  const loading = !!section.isStreaming;

  const [err, setErr] = useState("");
  const currentSig = portfolioSignature(fund, quarter, companies);

  const generate = useCallback(async () => {
    if (!apiKeyConfigured()) {
      setErr("Add VITE_ANTHROPIC_API_KEY to .env to see AI callouts.");
      return;
    }
    setErr("");
    setSection(KEY, { isStreaming: true });
    const sig = portfolioSignature(fund, quarter, companies);
    const ctx = buildPortfolioContext(fund, quarter, companies);
    const prompt = `${ctx}\n\nReturn exactly 3 one-sentence portfolio callouts as a JSON array. Each should start with an emoji (⚠ for risk, ✦ for strength, → for neutral). Be specific — include company names and numbers. Return ONLY the JSON array, no markdown fences.\nFormat: ["sentence1","sentence2","sentence3"]`;
    try {
      const text = await generateNonStream({
        system: SYSTEM_PROMPT_BASE,
        user: prompt,
        maxTokens: 400
      });
      const match = text.match(/\[[\s\S]*\]/);
      const parsed = match ? JSON.parse(match[0]) : [];
      setSection(KEY, {
        content: Array.isArray(parsed) ? parsed.slice(0, 3) : [],
        isStreaming: false,
        generatedAt: timestamp(),
        signature: sig
      });
    } catch (e) {
      setErr(e.message || "Failed to load AI callouts.");
      setSection(KEY, { isStreaming: false });
    }
  }, [companies, fund, quarter, setSection]);

  useEffect(() => {
    const existing = getSection(KEY);
    const cached = Array.isArray(existing.content) && existing.content.length > 0;
    if (cached && existing.signature === currentSig) return; // up-to-date
    generate();
  }, [currentSig, generate, getSection]);

  return (
    <div className="mt-5 bg-bg-card border border-border-default rounded-[10px] p-4">
      <div className="flex items-center gap-2 mb-3">
        <Sparkles className="w-4 h-4 text-accent-gold" />
        <h3 className="text-sm font-semibold">Quick Insights</h3>
        <span className="text-[10px] uppercase tracking-wider text-text-muted">AI-generated</span>
        {section.generatedAt && !loading && (
          <span className="text-[10px] text-text-dim mono">Generated {section.generatedAt}</span>
        )}
        <button
          onClick={generate}
          disabled={loading}
          className="ml-auto text-[11px] text-text-secondary hover:text-accent-gold inline-flex items-center gap-1 disabled:opacity-40"
          title="Refresh"
        >
          <RotateCw className={`w-3 h-3 ${loading ? "animate-spin" : ""}`} />
          Refresh
        </button>
      </div>
      {err && <div className="text-sm text-status-below">{err}</div>}
      {loading && !items.length && (
        <div className="text-sm text-text-muted">Generating callouts…</div>
      )}
      {!err && items.length > 0 && (
        <div className="grid md:grid-cols-3 gap-3">
          {items.map((s, i) => (
            <div key={i} className="bg-bg-surface border border-border-default rounded p-3 text-sm leading-relaxed">
              {s}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
