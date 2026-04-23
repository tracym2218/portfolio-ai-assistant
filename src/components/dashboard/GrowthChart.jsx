import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Cell,
  ResponsiveContainer
} from "recharts";
import { useFilters } from "../../context/FilterContext.jsx";
import { useChartSelection } from "../../context/ChartSelectionContext.jsx";

const color = (v) => {
  if (v >= 15) return "#22c55e";
  if (v >= 5) return "#60a5fa";
  if (v >= 0) return "#f59e0b";
  return "#ef4444";
};

export default function GrowthChart() {
  const { filteredCompanies: companies } = useFilters();
  const { selection, select } = useChartSelection();

  const data = [...companies]
    .sort((a, b) => b.revenueGrowth - a.revenueGrowth)
    .map((c) => ({ name: c.company, sector: c.sector, growth: c.revenueGrowth }));

  const matches = (d) =>
    selection.value === null ||
    (selection.type === "company" && selection.value === d.name) ||
    (selection.type === "sector" && selection.value === d.sector);

  const onClick = (d) => {
    if (d && d.name) select("company", d.name, "growth");
  };

  return (
    <div className="bg-bg-surface border border-border-default rounded-[10px] p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold">YoY Revenue Growth</h3>
        <div className="text-[10px] uppercase tracking-wider text-text-muted">% · click to filter</div>
      </div>
      <ResponsiveContainer width="100%" height={260}>
        <BarChart data={data} layout="vertical" margin={{ top: 5, right: 15, left: 10, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
          <XAxis type="number" tick={{ fill: "#94a3b8", fontSize: 11 }} />
          <YAxis type="category" dataKey="name" tick={{ fill: "#94a3b8", fontSize: 11 }} width={120} />
          <Tooltip
            contentStyle={{ backgroundColor: "#1e293b", border: "1px solid #334155", borderRadius: 6 }}
            formatter={(v) => [`${v}%`, "Growth"]}
          />
          <Bar dataKey="growth" radius={[0, 3, 3, 0]} onClick={onClick} cursor="pointer">
            {data.map((d, i) => (
              <Cell key={i} fill={color(d.growth)} opacity={matches(d) ? 1 : 0.2} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
