import React from "react";
import { ChevronRight } from "lucide-react";
import { STATUS_COLOR, computeStatus, revenueVariancePct } from "../../utils/metrics.js";
import { fmtMoneyPlain, fmtPct, fmtPctAbs } from "../../utils/formatters.js";

export default function CompanyRow({ company, onClick, zebra }) {
  const status = computeStatus(company);
  const variance = revenueVariancePct(company);
  const varClass = variance >= 0 ? "text-status-out" : "text-status-risk";

  return (
    <tr
      onClick={onClick}
      className={`${zebra ? "bg-bg-base" : "bg-bg-surface"} hover:bg-bg-elevated cursor-pointer transition group`}
    >
      <td className="px-3 py-2 text-text-primary font-medium">
        <span className="inline-flex items-center gap-1">
          {company.company}
          <ChevronRight className="w-3 h-3 text-text-muted opacity-0 group-hover:opacity-100 transition" />
        </span>
      </td>
      <td className="px-3 py-2 text-text-secondary">{company.sector}</td>
      <td className="px-3 py-2 mono text-right">{fmtMoneyPlain(company.revenue)}</td>
      <td className="px-3 py-2 mono text-right text-text-secondary">{fmtMoneyPlain(company.revenuePlan)}</td>
      <td className={`px-3 py-2 mono text-right ${varClass}`}>{fmtPct(variance)}</td>
      <td className="px-3 py-2 mono text-right">{fmtMoneyPlain(company.ebitda)}</td>
      <td className="px-3 py-2 mono text-right">{fmtPctAbs(company.ebitdaMargin)}</td>
      <td className={`px-3 py-2 mono text-right ${company.revenueGrowth >= 0 ? "text-status-out" : "text-status-risk"}`}>
        {fmtPct(company.revenueGrowth)}
      </td>
      <td className="px-3 py-2 mono text-right text-text-secondary">{fmtMoneyPlain(company.netDebt)}</td>
      <td className="px-3 py-2">
        <span
          className="inline-block text-[10px] font-semibold px-2 py-0.5 rounded-full"
          style={{ backgroundColor: STATUS_COLOR[status] + "22", color: STATUS_COLOR[status] }}
        >
          {status}
        </span>
      </td>
    </tr>
  );
}
