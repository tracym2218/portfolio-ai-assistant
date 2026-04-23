import React from "react";
import { TrendingUp, TrendingDown, AlertTriangle, Building2, Target } from "lucide-react";
import { fmtMoney, fmtPct } from "../../utils/formatters.js";
import { usePortfolioMetrics } from "../../hooks/usePortfolioMetrics.js";

function Card({ label, value, sub, icon: Icon, tone = "default" }) {
  const toneClass = {
    default: "",
    risk: "text-status-risk",
    good: "text-status-out",
    warn: "text-status-below"
  }[tone];
  return (
    <div className="bg-bg-card border border-border-default rounded-[10px] p-5 min-w-0">
      <div className="flex items-center justify-between mb-2">
        <div className="text-[11px] uppercase tracking-wider text-text-muted font-semibold">
          {label}
        </div>
        {Icon && <Icon className="w-4 h-4 text-text-muted" />}
      </div>
      <div className={`text-[26px] leading-tight font-bold mono ${toneClass}`}>{value}</div>
      {sub && <div className="text-xs text-text-secondary mt-1.5 mono">{sub}</div>}
    </div>
  );
}

export default function KPICards() {
  const { metrics } = usePortfolioMetrics();
  const {
    totalRevenue,
    totalRevenuePlan,
    totalEbitda,
    avgMargin,
    revenueVsPlanPct,
    companyCount,
    outperformingCount,
    atRiskCount
  } = metrics;

  const DeltaIcon = revenueVsPlanPct >= 0 ? TrendingUp : TrendingDown;

  return (
    <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 mb-5">
      <Card
        label="Portfolio Revenue"
        value={fmtMoney(totalRevenue)}
        sub={`Plan ${fmtMoney(totalRevenuePlan)}`}
        icon={Target}
      />
      <Card
        label="Total EBITDA"
        value={fmtMoney(totalEbitda)}
        sub={`Avg margin ${avgMargin.toFixed(1)}%`}
      />
      <Card
        label="Companies"
        value={`${companyCount}`}
        sub={`${outperformingCount} outperforming`}
        icon={Building2}
        tone="good"
      />
      <Card
        label="At Risk"
        value={`${atRiskCount}`}
        sub={atRiskCount > 0 ? "Requires attention" : "None flagged"}
        icon={AlertTriangle}
        tone={atRiskCount > 0 ? "risk" : "default"}
      />
      <Card
        label="Revenue vs Plan"
        value={fmtPct(revenueVsPlanPct)}
        sub={
          <span className="inline-flex items-center gap-1">
            <DeltaIcon className="w-3 h-3" />
            {revenueVsPlanPct >= 0 ? "Above plan" : "Below plan"}
          </span>
        }
        tone={revenueVsPlanPct >= 0 ? "good" : "warn"}
      />
    </div>
  );
}
