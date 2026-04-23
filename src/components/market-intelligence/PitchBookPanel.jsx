import React, { useMemo, useState } from "react";
import { BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ReferenceLine, ResponsiveContainer } from "recharts";
import { useFilters } from "../../context/FilterContext.jsx";
import AISectionCard from "../ai/AISectionCard.jsx";
import SourceBadge from "./SourceBadge.jsx";
import { PITCHBOOK_COMPS, PITCHBOOK_SECTOR_MULTIPLES } from "../../utils/marketData.js";
import { SYSTEM_PROMPT_BASE } from "../../hooks/useClaudeAI.js";
import { slugify } from "../../utils/slug.js";

const DIMS = [
  { value: "valuation-gap", label: "Valuation gap", prompt: "Analyze valuation gap — target company EV/EBITDA proxy vs sector median and quartiles. Quantify upside or downside." },
  { value: "rerating-catalysts", label: "Rerating catalysts", prompt: "Identify concrete catalysts that could rerate the target higher — margin expansion, growth inflection, category leadership, M&A." },
  { value: "comp-quality", label: "Comp quality", prompt: "Assess whether the comp set genuinely reflects the target. Flag anchor vs aspirational comps, and any that are stretched." },
  { value: "sector-sentiment", label: "Sector sentiment", prompt: "Characterize sector sentiment right now — capital flow, transaction activity, buyer appetite." }
];

function impliedEvEbitda(company) {
  // Illustrative: multiple bounded by sector median ± margin delta.
  const m = PITCHBOOK_SECTOR_MULTIPLES[company.sector] || { median: 10 };
  const sectorMarginAvg = 22;
  const marginDelta = (company.ebitdaMargin - sectorMarginAvg) / 10; // +/- multiple points
  return Math.max(4, m.median + marginDelta);
}

export default function PitchBookPanel() {
  const { filteredCompanies } = useFilters();
  const eligible = filteredCompanies.filter((c) => PITCHBOOK_COMPS[c.sector]);
  const [targetName, setTargetName] = useState(eligible[0]?.company || "");

  const target = eligible.find((c) => c.company === targetName) || eligible[0];
  const comps = target ? PITCHBOOK_COMPS[target.sector] || [] : [];
  const sectorMult = target ? PITCHBOOK_SECTOR_MULTIPLES[target.sector] : null;
  const targetMult = target ? impliedEvEbitda(target) : 0;

  const chartData = useMemo(() => {
    if (!target) return [];
    return [
      ...comps.map((c) => ({ name: c.name, evEbitda: c.evEbitda, isTarget: false })),
      { name: target.company, evEbitda: Number(targetMult.toFixed(1)), isTarget: true }
    ].sort((a, b) => b.evEbitda - a.evEbitda);
  }, [target, comps, targetMult]);

  if (!target) {
    return (
      <div className="bg-bg-surface border border-border-default rounded-[10px] p-6 text-sm text-text-muted">
        No comp coverage for the current filter. Broaden the filter to see PitchBook comps.
      </div>
    );
  }

  const buildPrompt = (dim) => {
    const lens = (DIMS.find((d) => d.value === dim) || {}).prompt || "";
    const ctx = `TARGET: ${target.company} (${target.sector})
  Implied EV/EBITDA: ${targetMult.toFixed(1)}x
  Revenue: $${target.revenue}M  ·  EBITDA margin: ${target.ebitdaMargin}%  ·  Growth: ${target.revenueGrowth}%

SECTOR MULTIPLES: P25 ${sectorMult.p25}x  ·  Median ${sectorMult.median}x  ·  P75 ${sectorMult.p75}x

PITCHBOOK COMP SET:
${comps.map((c) => `- ${c.name} (${c.stage}, ${c.sponsor}): Rev $${c.revenue}M, margin ${c.margin}%, growth ${c.growth}%, EV/EBITDA ${c.evEbitda}x`).join("\n")}`;
    return {
      system: SYSTEM_PROMPT_BASE,
      user: `${ctx}\n\nTASK: Produce one concise paragraph of PitchBook-style commentary in the selected dimension.\n\nDIMENSION LENS: ${lens}\n\nReturn body content only. No preamble.`,
      maxTokens: 400
    };
  };

  return (
    <div className="space-y-4">
      <div className="bg-bg-surface border border-border-default rounded-[10px] p-4">
        <div className="flex items-center gap-2 flex-wrap mb-3">
          <SourceBadge code="PB" label="PitchBook" />
          <h3 className="text-sm font-semibold">Comp Set & Valuation</h3>
          <div className="ml-auto inline-flex items-center gap-1 bg-bg-card border border-border-default rounded px-2 py-1">
            <span className="text-[10px] uppercase tracking-wider text-text-muted">Target</span>
            <select
              value={target.company}
              onChange={(e) => setTargetName(e.target.value)}
              className="bg-transparent text-sm text-text-primary outline-none"
            >
              {eligible.map((c) => (
                <option key={c.company} value={c.company}>
                  {c.company}
                </option>
              ))}
            </select>
          </div>
        </div>

        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={chartData} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
            <XAxis dataKey="name" tick={{ fill: "#94a3b8", fontSize: 10 }} interval={0} angle={-20} textAnchor="end" height={60} />
            <YAxis tick={{ fill: "#94a3b8", fontSize: 11 }} />
            <Tooltip
              contentStyle={{ backgroundColor: "#1e293b", border: "1px solid #334155", borderRadius: 6 }}
              formatter={(v) => [`${v}x`, "EV/EBITDA"]}
            />
            <ReferenceLine y={sectorMult.median} stroke="#f59e0b" strokeDasharray="4 4" label={{ value: "Median", fill: "#f59e0b", fontSize: 10, position: "right" }} />
            <Bar dataKey="evEbitda" radius={[3, 3, 0, 0]}>
              {chartData.map((d, i) => (
                <Cell key={i} fill={d.isTarget ? "#60a5fa" : "#475569"} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="bg-bg-surface border border-border-default rounded-[10px] overflow-hidden">
        <div className="px-4 py-3 border-b border-border-default flex items-center gap-2">
          <SourceBadge code="PB" />
          <h3 className="text-sm font-semibold">Comparable Companies — {target.sector}</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-[13px]">
            <thead className="bg-bg-elevated text-text-secondary">
              <tr>
                <Th>Name</Th>
                <Th>Stage</Th>
                <Th>Sponsor</Th>
                <Th align="right">Revenue</Th>
                <Th align="right">Margin</Th>
                <Th align="right">Growth</Th>
                <Th align="right">EV/EBITDA</Th>
              </tr>
            </thead>
            <tbody>
              {comps.map((c, i) => (
                <tr key={c.name} className={i % 2 ? "bg-bg-surface" : "bg-bg-base"}>
                  <td className="px-3 py-2 text-text-primary">{c.name}</td>
                  <td className="px-3 py-2 text-text-secondary">{c.stage}</td>
                  <td className="px-3 py-2 text-text-secondary">{c.sponsor}</td>
                  <td className="px-3 py-2 text-right mono">${c.revenue}M</td>
                  <td className="px-3 py-2 text-right mono">{c.margin}%</td>
                  <td className="px-3 py-2 text-right mono">{c.growth}%</td>
                  <td className="px-3 py-2 text-right mono text-accent-gold">{c.evEbitda}x</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <AISectionCard
        sectionKey={`market.pitchbook.${slugify(target.company)}`}
        title="PitchBook AI Insight"
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
