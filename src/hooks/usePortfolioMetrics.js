import { useMemo } from "react";
import { useFilters } from "../context/FilterContext.jsx";
import { portfolioMetrics, sectorBreakdown } from "../utils/metrics.js";

export function usePortfolioMetrics() {
  const { filteredCompanies } = useFilters();
  const metrics = useMemo(() => portfolioMetrics(filteredCompanies), [filteredCompanies]);
  const sectors = useMemo(() => sectorBreakdown(filteredCompanies), [filteredCompanies]);
  return { metrics, sectors, companies: filteredCompanies };
}
