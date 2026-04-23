import React, { useState } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, Cell, ResponsiveContainer } from "recharts";
import AISectionCard from "../ai/AISectionCard.jsx";
import SourceBadge from "./SourceBadge.jsx";
import { PREQIN_FUND_BENCHMARKS, PREQIN_VINTAGES, PREQIN_LP_INTELLIGENCE } from "../../utils/marketData.js";
import { SYSTEM_PROMPT_BASE } from "../../hooks/useClaudeAI.js";
import { useFilters } from "../../context/FilterContext.jsx";

const DIMS = [
  { value: "quartile-positioning", label: "Quartile positioning", prompt: "Assess fund quartile positioning vs peers. Tie to investment strategy." },
  { value: "lp-reup", label: "LP re-up", prompt: "Assess LP re-up likelihood for the next fund and the narrative required." },
  { value: "dpi-acceleration", label: "DPI acceleration", prompt: "Assess levers to accelerate DPI — realizations, dividend recaps, continuation vehicles." },
  { value: "lp-memo", label: "LP memo narrative", prompt: "Draft an LP memo narrative positioning the fund against Preqin benchmarks. Formal, measured." }
];

const SUBTABS = [
  { id: "benchmarks", label: "Fund benchmarks" },
  { id: "vintage", label: "Vintage comparison" },
  { id: "lp", label: "LP intelligence" }
];

export default function PreqinPanel() {
  const { selectedFund } = useFilters();
  const [sub, setSub] = useState("benchmarks");

  const activeFundName = selectedFund !== "all" ? selectedFund : null;
  const relevantBenchmarks = activeFundName
    ? PREQIN_FUND_BENCHMARKS.filter((b) => b.fund === activeFundName)
    : PREQIN_FUND_BENCHMARKS;

  const buildPrompt = (dim) => {
    const lens = (DIMS.find((d) => d.value === dim) || {}).prompt || "";
    const ctx = `PREQIN FUND BENCHMARKS:
${relevantBenchmarks
  .map(
    (b) =>
      `- ${b.fund} (vintage ${b.vintage}): TVPI ${b.tvpi}x (peer median ${b.peerMedianTvpi}x, Q${b.quartile}), DPI ${b.dpi}x, IRR ${b.irr}%`
  )
  .join("\n")}

VINTAGE COMPARISON:
${PREQIN_VINTAGES.map((v) => `- ${v.vintage}: Fund TVPI ${v.fundTvpi}x vs peer median ${v.peerMedianTvpi}x`).join("\n")}

LP INTELLIGENCE:
${PREQIN_LP_INTELLIGENCE.map((l) => `- ${l.lpType}: $${l.commitment}M committed, re-up ${l.reUpLikelihood}. ${l.notes}`).join("\n")}`;
    return {
      system: SYSTEM_PROMPT_BASE,
      user: `${ctx}\n\nTASK: Produce concise Preqin-style commentary in the selected dimension.\n\nDIMENSION LENS: ${lens}\n\nBody only. No preamble.`,
      maxTokens: 400
    };
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 flex-wrap">
        <SourceBadge code="PQ" label="Preqin" />
        <div className="flex items-center gap-1 ml-2">
          {SUBTABS.map((t) => (
            <button
              key={t.id}
              onClick={() => setSub(t.id)}
              className={`text-xs px-2.5 py-1 rounded border transition ${
                sub === t.id
                  ? "border-[#4ade80]/40 bg-[#4ade80]/10 text-[#4ade80]"
                  : "border-border-default text-text-secondary hover:border-border-strong"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {sub === "benchmarks" && (
        <div className="bg-bg-surface border border-border-default rounded-[10px] p-4">
          <h3 className="text-sm font-semibold mb-3">Fund Benchmarks</h3>
          <div className="grid sm:grid-cols-2 gap-3">
            {relevantBenchmarks.map((b) => (
              <div key={b.fund} className="bg-bg-card border border-border-default rounded p-3">
                <div className="flex items-center justify-between">
                  <div className="font-semibold text-sm">{b.fund}</div>
                  <span className="text-[10px] uppercase tracking-wider text-text-muted">
                    Vintage {b.vintage}
                  </span>
                </div>
                <div className="mt-2 grid grid-cols-3 gap-2 text-center">
                  <Metric label="TVPI" value={`${b.tvpi}x`} accent />
                  <Metric label="DPI" value={`${b.dpi}x`} />
                  <Metric label="IRR" value={`${b.irr}%`} />
                </div>
                <div className="mt-2 text-xs text-text-secondary">
                  Peer median TVPI <span className="mono">{b.peerMedianTvpi}x</span> · Q
                  <span className="mono">{b.quartile}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {sub === "vintage" && (
        <div className="bg-bg-surface border border-border-default rounded-[10px] p-4">
          <h3 className="text-sm font-semibold mb-3">TVPI by Vintage</h3>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={PREQIN_VINTAGES} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="vintage" tick={{ fill: "#94a3b8", fontSize: 11 }} />
              <YAxis tick={{ fill: "#94a3b8", fontSize: 11 }} unit="x" />
              <Tooltip
                contentStyle={{ backgroundColor: "#1e293b", border: "1px solid #334155", borderRadius: 6 }}
                formatter={(v) => [`${v}x`, ""]}
              />
              <Legend wrapperStyle={{ fontSize: 12 }} />
              <Bar dataKey="fundTvpi" name="Fund TVPI" fill="#4ade80" radius={[3, 3, 0, 0]}>
                {PREQIN_VINTAGES.map((_, i) => (
                  <Cell key={i} fill="#4ade80" />
                ))}
              </Bar>
              <Bar dataKey="peerMedianTvpi" name="Peer Median" fill="#475569" radius={[3, 3, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {sub === "lp" && (
        <div className="bg-bg-surface border border-border-default rounded-[10px] overflow-hidden">
          <div className="px-4 py-3 border-b border-border-default flex items-center gap-2">
            <SourceBadge code="PQ" />
            <h3 className="text-sm font-semibold">LP Intelligence</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-[13px]">
              <thead className="bg-bg-elevated text-text-secondary">
                <tr>
                  <Th>LP Type</Th>
                  <Th align="right">Commitment ($M)</Th>
                  <Th>Re-up likelihood</Th>
                  <Th>Notes</Th>
                </tr>
              </thead>
              <tbody>
                {PREQIN_LP_INTELLIGENCE.map((l, i) => (
                  <tr key={l.lpType} className={i % 2 ? "bg-bg-surface" : "bg-bg-base"}>
                    <td className="px-3 py-2 text-text-primary font-medium">{l.lpType}</td>
                    <td className="px-3 py-2 text-right mono">${l.commitment}</td>
                    <td className="px-3 py-2">
                      <ReupPill likelihood={l.reUpLikelihood} />
                    </td>
                    <td className="px-3 py-2 text-text-secondary">{l.notes}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <AISectionCard
        sectionKey="market.preqin.insight"
        title="Preqin AI Insight"
        dimensions={DIMS}
        buildPrompt={buildPrompt}
      />
    </div>
  );
}

function Metric({ label, value, accent }) {
  return (
    <div>
      <div className="text-[10px] uppercase tracking-wider text-text-muted">{label}</div>
      <div className={`mono font-bold text-base ${accent ? "text-[#4ade80]" : ""}`}>{value}</div>
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

function ReupPill({ likelihood }) {
  const map = {
    High: "text-status-out bg-status-out/15 border-status-out/30",
    Medium: "text-status-below bg-status-below/15 border-status-below/30",
    Low: "text-status-risk bg-status-risk/15 border-status-risk/30"
  };
  return (
    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${map[likelihood] || ""}`}>
      {likelihood}
    </span>
  );
}
