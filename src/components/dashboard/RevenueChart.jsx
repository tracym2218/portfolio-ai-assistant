import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  Cell,
  ResponsiveContainer
} from "recharts";
import { useFilters } from "../../context/FilterContext.jsx";
import { useChartSelection } from "../../context/ChartSelectionContext.jsx";

export default function RevenueChart() {
  const { filteredCompanies: companies } = useFilters();
  const { selection, select, isSelected } = useChartSelection();

  const data = companies.map((c) => ({
    name: c.company.length > 14 ? c.company.slice(0, 12) + "…" : c.company,
    fullName: c.company,
    sector: c.sector,
    Actual: c.revenue,
    Plan: c.revenuePlan
  }));

  const matches = (d) =>
    selection.value === null ||
    (selection.type === "company" && selection.value === d.fullName) ||
    (selection.type === "sector" && selection.value === d.sector);

  const onBarClick = (d) => {
    if (d && d.fullName) select("company", d.fullName, "revenue");
  };

  return (
    <div data-pdf-chart="revenue" className="bg-bg-surface border border-border-default rounded-[10px] p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold">Revenue vs Plan</h3>
        <div className="text-[10px] uppercase tracking-wider text-text-muted">$M · click to filter</div>
      </div>
      <ResponsiveContainer width="100%" height={260}>
        <BarChart data={data} margin={{ top: 5, right: 5, left: -10, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
          <XAxis dataKey="name" tick={{ fill: "#94a3b8", fontSize: 11 }} interval={0} angle={-20} textAnchor="end" height={60} />
          <YAxis tick={{ fill: "#94a3b8", fontSize: 11 }} />
          <Tooltip
            contentStyle={{ backgroundColor: "#1e293b", border: "1px solid #334155", borderRadius: 6 }}
            labelStyle={{ color: "#e2e8f0" }}
          />
          <Legend wrapperStyle={{ fontSize: 12 }} />
          <Bar dataKey="Plan" radius={[3, 3, 0, 0]} onClick={onBarClick} cursor="pointer">
            {data.map((d, i) => (
              <Cell key={i} fill="#475569" opacity={matches(d) ? 1 : 0.2} />
            ))}
          </Bar>
          <Bar dataKey="Actual" radius={[3, 3, 0, 0]} onClick={onBarClick} cursor="pointer">
            {data.map((d, i) => (
              <Cell key={i} fill="#f59e0b" opacity={matches(d) ? 1 : 0.2} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
