import React from "react";
import { BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { revenueVariancePct, ebitdaVariancePct, computeStatus, STATUS_COLOR } from "../../utils/metrics.js";
import { fmtMoneyPlain, fmtPct, fmtPctAbs } from "../../utils/formatters.js";
import { usePortfolio } from "../../context/PortfolioContext.jsx";

export default function FinancialSummary({ company }) {
  const { notes, updateNote } = usePortfolio();
  const status = computeStatus(company);
  const revVar = revenueVariancePct(company);
  const ebVar = ebitdaVariancePct(company);
  const leverage = company.ebitda ? company.netDebt / company.ebitda : null;
  const note = notes[company.company] || "";

  const chartData = [
    { label: "Revenue", Actual: company.revenue, Plan: company.revenuePlan },
    { label: "EBITDA", Actual: company.ebitda, Plan: company.ebitdaPlan }
  ];

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        <Metric label="Revenue" value={fmtMoneyPlain(company.revenue)} sub={`Plan ${fmtMoneyPlain(company.revenuePlan)}`} />
        <Metric label="vs Plan" value={fmtPct(revVar)} tone={revVar >= 0 ? "good" : "risk"} />
        <Metric label="EBITDA" value={fmtMoneyPlain(company.ebitda)} sub={`Plan ${fmtMoneyPlain(company.ebitdaPlan)}`} />
        <Metric label="Margin" value={fmtPctAbs(company.ebitdaMargin)} />
        <Metric label="YoY Growth" value={fmtPct(company.revenueGrowth)} tone={company.revenueGrowth >= 0 ? "good" : "risk"} />
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div className="bg-bg-surface border border-border-default rounded-[10px] p-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-semibold">Actual vs Plan</h3>
            <span
              className="text-[10px] font-semibold px-2 py-0.5 rounded-full"
              style={{ backgroundColor: STATUS_COLOR[status] + "22", color: STATUS_COLOR[status] }}
            >
              {status}
            </span>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={chartData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="label" tick={{ fill: "#94a3b8", fontSize: 11 }} />
              <YAxis tick={{ fill: "#94a3b8", fontSize: 11 }} />
              <Tooltip contentStyle={{ backgroundColor: "#1e293b", border: "1px solid #334155", borderRadius: 6 }} />
              <Legend wrapperStyle={{ fontSize: 12 }} />
              <Bar dataKey="Plan" fill="#475569" radius={[3, 3, 0, 0]} />
              <Bar dataKey="Actual" fill="#f59e0b" radius={[3, 3, 0, 0]}>
                {chartData.map((d, i) => (
                  <Cell key={i} fill={d.Actual >= d.Plan ? "#22c55e" : "#ef4444"} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
          <div className="mt-2 grid grid-cols-2 gap-2 text-xs mono">
            <div className="text-text-secondary">Revenue var: <span className={revVar >= 0 ? "text-status-out" : "text-status-risk"}>{fmtPct(revVar)}</span></div>
            <div className="text-text-secondary">EBITDA var: <span className={ebVar >= 0 ? "text-status-out" : "text-status-risk"}>{fmtPct(ebVar)}</span></div>
          </div>
        </div>

        <div className="bg-bg-surface border border-border-default rounded-[10px] p-4">
          <h3 className="text-sm font-semibold mb-3">Debt Summary</h3>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <DebtRow label="Net Debt" value={fmtMoneyPlain(company.netDebt)} />
            <DebtRow label="Net Debt / EBITDA" value={leverage != null ? `${leverage.toFixed(1)}x` : "—"} tone={leverage && leverage > 5 ? "risk" : leverage && leverage > 3.5 ? "warn" : "good"} />
            <DebtRow label="EBITDA (LTM proxy)" value={fmtMoneyPlain(company.ebitda * 4)} />
            <DebtRow label="Covenant headroom" value={leverage && leverage > 5 ? "Tight — monitor" : leverage && leverage > 3.5 ? "Moderate" : "Comfortable"} tone={leverage && leverage > 5 ? "risk" : leverage && leverage > 3.5 ? "warn" : "good"} />
          </div>
          <div className="mt-4 text-[11px] text-text-muted leading-relaxed">
            Covenant headroom is indicative, assuming a 6.0x maintenance covenant on senior debt. Confirm against actual credit agreement.
          </div>
        </div>
      </div>

      <div className="bg-bg-surface border border-border-default rounded-[10px] p-4">
        <div className="text-[11px] uppercase tracking-wider text-text-muted mb-1.5">Analyst Notes</div>
        <textarea
          value={note}
          onChange={(e) => updateNote(company.company, e.target.value)}
          placeholder="Add internal notes…"
          rows={3}
          className="w-full bg-bg-base border border-border-default rounded p-2 text-sm focus:border-accent-gold outline-none resize-none"
        />
      </div>
    </div>
  );
}

function Metric({ label, value, sub, tone }) {
  const toneClass = {
    good: "text-status-out",
    risk: "text-status-risk"
  }[tone] || "";
  return (
    <div className="bg-bg-card border border-border-default rounded p-3">
      <div className="text-[10px] uppercase tracking-wider text-text-muted">{label}</div>
      <div className={`mono font-semibold text-lg ${toneClass}`}>{value}</div>
      {sub && <div className="text-[10px] text-text-muted mono mt-0.5">{sub}</div>}
    </div>
  );
}

function DebtRow({ label, value, tone }) {
  const toneClass = {
    good: "text-status-out",
    warn: "text-status-below",
    risk: "text-status-risk"
  }[tone] || "text-text-primary";
  return (
    <div>
      <div className="text-[10px] uppercase tracking-wider text-text-muted">{label}</div>
      <div className={`mono font-semibold ${toneClass}`}>{value}</div>
    </div>
  );
}
