export const STATUS = {
  OUT: "Outperforming",
  TRACK: "On Track",
  BELOW: "Below Plan",
  RISK: "At Risk"
};

export const STATUS_COLOR = {
  [STATUS.OUT]: "#22c55e",
  [STATUS.TRACK]: "#60a5fa",
  [STATUS.BELOW]: "#f59e0b",
  [STATUS.RISK]: "#ef4444"
};

export function computeStatus(c) {
  const revPct = c.revenuePlan ? c.revenue / c.revenuePlan : 1;
  const ebPct = c.ebitdaPlan ? c.ebitda / c.ebitdaPlan : 1;
  if (revPct < 0.85 || ebPct < 0.80) return STATUS.RISK;
  if (revPct >= 1.05 && ebPct >= 1.0) return STATUS.OUT;
  if (revPct >= 0.95 && revPct <= 1.05) return STATUS.TRACK;
  if (revPct >= 0.85 && revPct < 0.95) return STATUS.BELOW;
  return STATUS.TRACK;
}

export function revenueVariancePct(c) {
  if (!c.revenuePlan) return 0;
  return ((c.revenue - c.revenuePlan) / c.revenuePlan) * 100;
}

export function ebitdaVariancePct(c) {
  if (!c.ebitdaPlan) return 0;
  return ((c.ebitda - c.ebitdaPlan) / c.ebitdaPlan) * 100;
}

export function portfolioMetrics(companies) {
  if (!companies || companies.length === 0) {
    return {
      totalRevenue: 0,
      totalRevenuePlan: 0,
      totalEbitda: 0,
      totalEbitdaPlan: 0,
      avgMargin: 0,
      revenueVsPlanPct: 0,
      companyCount: 0,
      outperformingCount: 0,
      atRiskCount: 0,
      belowPlanCount: 0
    };
  }
  const totalRevenue = companies.reduce((s, c) => s + (c.revenue || 0), 0);
  const totalRevenuePlan = companies.reduce((s, c) => s + (c.revenuePlan || 0), 0);
  const totalEbitda = companies.reduce((s, c) => s + (c.ebitda || 0), 0);
  const totalEbitdaPlan = companies.reduce((s, c) => s + (c.ebitdaPlan || 0), 0);
  const avgMargin = companies.reduce((s, c) => s + (c.ebitdaMargin || 0), 0) / companies.length;
  const revenueVsPlanPct = totalRevenuePlan
    ? ((totalRevenue - totalRevenuePlan) / totalRevenuePlan) * 100
    : 0;

  let outperformingCount = 0;
  let atRiskCount = 0;
  let belowPlanCount = 0;
  companies.forEach((c) => {
    const s = computeStatus(c);
    if (s === STATUS.OUT) outperformingCount++;
    if (s === STATUS.RISK) atRiskCount++;
    if (s === STATUS.BELOW) belowPlanCount++;
  });

  return {
    totalRevenue,
    totalRevenuePlan,
    totalEbitda,
    totalEbitdaPlan,
    avgMargin,
    revenueVsPlanPct,
    companyCount: companies.length,
    outperformingCount,
    atRiskCount,
    belowPlanCount
  };
}

export function sectorBreakdown(companies) {
  const map = {};
  companies.forEach((c) => {
    const key = c.sector || "Unclassified";
    map[key] = (map[key] || 0) + (c.revenue || 0);
  });
  return Object.entries(map)
    .map(([sector, revenue]) => ({ sector, revenue }))
    .sort((a, b) => b.revenue - a.revenue);
}
