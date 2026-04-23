import React from "react";
import { AlertTriangle } from "lucide-react";
import { useFilters } from "../../context/FilterContext.jsx";
import { computeStatus, STATUS, STATUS_COLOR, revenueVariancePct, ebitdaVariancePct } from "../../utils/metrics.js";
import { fmtMoneyPlain, fmtPct } from "../../utils/formatters.js";

export default function WatchList() {
  const { filteredCompanies: companies } = useFilters();
  const atRisk = companies.filter((c) => {
    const s = computeStatus(c);
    return s === STATUS.RISK || s === STATUS.BELOW;
  });

  if (!atRisk.length) {
    return (
      <div className="bg-bg-card border border-border-default rounded-[10px] p-4">
        <div className="flex items-center gap-2 mb-2">
          <AlertTriangle className="w-4 h-4 text-status-out" />
          <h3 className="text-sm font-semibold">Watch List</h3>
        </div>
        <div className="text-sm text-text-secondary">No companies flagged at-risk or below plan.</div>
      </div>
    );
  }

  return (
    <div className="bg-bg-card border border-border-default rounded-[10px] p-4">
      <div className="flex items-center gap-2 mb-3">
        <AlertTriangle className="w-4 h-4 text-status-risk" />
        <h3 className="text-sm font-semibold">Watch List</h3>
        <span className="text-[10px] uppercase tracking-wider text-text-muted">{atRisk.length} flagged</span>
      </div>
      <div className="space-y-2">
        {atRisk.map((c) => {
          const status = computeStatus(c);
          const revVar = revenueVariancePct(c);
          const ebVar = ebitdaVariancePct(c);
          return (
            <div key={c.company} className="flex items-center gap-3 bg-bg-surface border border-border-default rounded p-3">
              <span
                className="text-[10px] font-semibold px-2 py-0.5 rounded-full shrink-0"
                style={{ backgroundColor: STATUS_COLOR[status] + "22", color: STATUS_COLOR[status] }}
              >
                {status}
              </span>
              <div className="min-w-0 flex-1">
                <div className="text-sm font-medium">{c.company}</div>
                <div className="text-xs text-text-secondary mono">
                  Rev {fmtMoneyPlain(c.revenue)} ({fmtPct(revVar)}) · EBITDA {fmtMoneyPlain(c.ebitda)} ({fmtPct(ebVar)}) · {c.sector}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
