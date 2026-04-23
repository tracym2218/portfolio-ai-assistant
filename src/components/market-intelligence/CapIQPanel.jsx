import React, { useMemo, useState } from "react";
import { UploadCloud } from "lucide-react";
import AISectionCard from "../ai/AISectionCard.jsx";
import SourceBadge from "./SourceBadge.jsx";
import { CIQ_TRANSACTION_COMPS, CIQ_PUBLIC_COMPS } from "../../utils/marketData.js";
import { SYSTEM_PROMPT_BASE } from "../../hooks/useClaudeAI.js";
import { useFilters } from "../../context/FilterContext.jsx";

const DIMS = [
  { value: "implied-exit", label: "Implied exit value", prompt: "Estimate implied exit value range for portfolio companies based on the transaction and public comps. Name specific companies and ranges." },
  { value: "entry-vs-current", label: "Entry vs current multiple", prompt: "Compare estimated entry multiples to current market multiples. Where is multiple expansion or compression risk?" },
  { value: "strategic-vs-sponsor", label: "Strategic vs sponsor", prompt: "Contrast strategic vs sponsor buyer landscape by sector. Which portfolio companies fit each?" },
  { value: "sector-m-and-a", label: "Sector M&A activity", prompt: "Characterize sector-level M&A activity and direction of multiples. What does this mean for the portfolio's exit timing?" }
];

const SUBTABS = [
  { id: "transaction", label: "Transaction comps" },
  { id: "public", label: "Public comps" }
];

export default function CapIQPanel() {
  const { filteredCompanies } = useFilters();
  const [sub, setSub] = useState("transaction");
  const [uploaded, setUploaded] = useState(false);

  const portfolioSectors = useMemo(
    () => Array.from(new Set(filteredCompanies.map((c) => c.sector))),
    [filteredCompanies]
  );

  const transactionCompsFiltered = CIQ_TRANSACTION_COMPS.filter(
    (t) => portfolioSectors.length === 0 || portfolioSectors.includes(t.sector)
  );
  const publicCompsFiltered = CIQ_PUBLIC_COMPS.filter(
    (t) => portfolioSectors.length === 0 || portfolioSectors.includes(t.sector)
  );

  const buildPrompt = (dim) => {
    const lens = (DIMS.find((d) => d.value === dim) || {}).prompt || "";
    const ctx = `PORTFOLIO SECTORS: ${portfolioSectors.join(", ")}

TRANSACTION COMPS:
${transactionCompsFiltered
  .map(
    (t) =>
      `- ${t.date} · ${t.target} <- ${t.buyer} (${t.rationale}, ${t.sector}): EV $${t.ev}M, EV/EBITDA ${t.evEbitda}x, EV/Revenue ${t.evRevenue}x`
  )
  .join("\n")}

PUBLIC COMPS:
${publicCompsFiltered
  .map(
    (p) =>
      `- ${p.ticker} (${p.sector}): mkt cap $${p.marketCap}M, EV/Rev ${p.evRevenue}x, EV/EBITDA ${p.evEbitda}x, growth ${p.revenueGrowth}%, margin ${p.margin}%`
  )
  .join("\n")}`;
    return {
      system: SYSTEM_PROMPT_BASE,
      user: `${ctx}\n\nTASK: Produce Capital IQ-style commentary in the selected dimension.\n\nDIMENSION LENS: ${lens}\n\nBody only. No preamble.`,
      maxTokens: 400
    };
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 flex-wrap">
        <SourceBadge code="CIQ" label="Capital IQ" />
        <div className="flex items-center gap-1 ml-2">
          {SUBTABS.map((t) => (
            <button
              key={t.id}
              onClick={() => setSub(t.id)}
              className={`text-xs px-2.5 py-1 rounded border transition ${
                sub === t.id
                  ? "border-[#c084fc]/40 bg-[#c084fc]/10 text-[#c084fc]"
                  : "border-border-default text-text-secondary hover:border-border-strong"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        <label
          onClick={(e) => {
            e.preventDefault();
            setUploaded(true);
          }}
          className="ml-auto inline-flex items-center gap-1.5 bg-bg-card border border-dashed border-border-strong hover:border-[#c084fc] text-text-secondary hover:text-[#c084fc] rounded px-3 py-1.5 text-xs cursor-pointer transition"
          title="Simulate a Capital IQ screening upload"
        >
          <UploadCloud className="w-3.5 h-3.5" />
          {uploaded ? "Mock upload loaded" : "Upload CIQ screen"}
        </label>
      </div>

      {sub === "transaction" && (
        <div className="bg-bg-surface border border-border-default rounded-[10px] overflow-hidden">
          <div className="px-4 py-3 border-b border-border-default flex items-center gap-2">
            <SourceBadge code="CIQ" />
            <h3 className="text-sm font-semibold">Transaction Comps</h3>
            <span className="text-[10px] uppercase tracking-wider text-text-muted">
              {transactionCompsFiltered.length} deals
            </span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-[13px]">
              <thead className="bg-bg-elevated text-text-secondary">
                <tr>
                  <Th>Date</Th>
                  <Th>Target</Th>
                  <Th>Buyer</Th>
                  <Th>Sector</Th>
                  <Th align="right">EV ($M)</Th>
                  <Th align="right">EV/EBITDA</Th>
                  <Th align="right">EV/Revenue</Th>
                  <Th>Rationale</Th>
                </tr>
              </thead>
              <tbody>
                {transactionCompsFiltered.map((t, i) => (
                  <tr key={`${t.target}-${i}`} className={i % 2 ? "bg-bg-surface" : "bg-bg-base"}>
                    <td className="px-3 py-2 text-text-muted mono">{t.date}</td>
                    <td className="px-3 py-2 text-text-primary">{t.target}</td>
                    <td className="px-3 py-2 text-text-secondary">{t.buyer}</td>
                    <td className="px-3 py-2 text-text-secondary">{t.sector}</td>
                    <td className="px-3 py-2 text-right mono">${t.ev.toLocaleString()}</td>
                    <td className="px-3 py-2 text-right mono text-[#c084fc]">{t.evEbitda}x</td>
                    <td className="px-3 py-2 text-right mono">{t.evRevenue}x</td>
                    <td className="px-3 py-2 text-text-secondary">{t.rationale}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {sub === "public" && (
        <div className="bg-bg-surface border border-border-default rounded-[10px] overflow-hidden">
          <div className="px-4 py-3 border-b border-border-default flex items-center gap-2">
            <SourceBadge code="CIQ" />
            <h3 className="text-sm font-semibold">Public Comps</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-[13px]">
              <thead className="bg-bg-elevated text-text-secondary">
                <tr>
                  <Th>Ticker</Th>
                  <Th>Sector</Th>
                  <Th align="right">Market Cap ($M)</Th>
                  <Th align="right">EV/Revenue</Th>
                  <Th align="right">EV/EBITDA</Th>
                  <Th align="right">Growth</Th>
                  <Th align="right">Margin</Th>
                </tr>
              </thead>
              <tbody>
                {publicCompsFiltered.map((p, i) => (
                  <tr key={p.ticker} className={i % 2 ? "bg-bg-surface" : "bg-bg-base"}>
                    <td className="px-3 py-2 text-text-primary mono font-semibold">{p.ticker}</td>
                    <td className="px-3 py-2 text-text-secondary">{p.sector}</td>
                    <td className="px-3 py-2 text-right mono">${p.marketCap.toLocaleString()}</td>
                    <td className="px-3 py-2 text-right mono">{p.evRevenue}x</td>
                    <td className="px-3 py-2 text-right mono text-[#c084fc]">{p.evEbitda}x</td>
                    <td className="px-3 py-2 text-right mono">{p.revenueGrowth}%</td>
                    <td className="px-3 py-2 text-right mono">{p.margin}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <AISectionCard
        sectionKey="market.ciq.insight"
        title="Capital IQ AI Insight"
        dimensions={DIMS}
        buildPrompt={buildPrompt}
      />
    </div>
  );
}

function Th({ children, align }) {
  return (
    <th className={`px-3 py-2 text-[11px] uppercase tracking-wider font-semibold ${align === "right" ? "text-right" : "text-left"}`}>
      {children}
    </th>
  );
}
