import React from "react";
import PageWrapper from "../components/layout/PageWrapper.jsx";
import KPICards from "../components/dashboard/KPICards.jsx";
import RevenueChart from "../components/dashboard/RevenueChart.jsx";
import GrowthChart from "../components/dashboard/GrowthChart.jsx";
import MarginChart from "../components/dashboard/MarginChart.jsx";
import SectorBreakdown from "../components/dashboard/SectorBreakdown.jsx";
import QuickInsights from "../components/dashboard/QuickInsights.jsx";
import SelectionStrip from "../components/dashboard/SelectionStrip.jsx";
import { useFilters } from "../context/FilterContext.jsx";

export default function Dashboard() {
  const { selectedFund, selectedQuarter } = useFilters();
  const fundLabel = selectedFund === "all" ? "All Alpha PE funds" : selectedFund;
  return (
    <PageWrapper title="Portfolio Dashboard" subtitle={`${fundLabel} — ${selectedQuarter}`}>
      <KPICards />
      <SelectionStrip />
      <div className="grid md:grid-cols-2 gap-4">
        <RevenueChart />
        <GrowthChart />
        <MarginChart />
        <SectorBreakdown />
      </div>
      <QuickInsights />
    </PageWrapper>
  );
}
