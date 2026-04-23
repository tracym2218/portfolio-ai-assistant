import React from "react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { usePortfolioMetrics } from "../../hooks/usePortfolioMetrics.js";
import { useChartSelection } from "../../context/ChartSelectionContext.jsx";

const COLORS = ["#f59e0b", "#60a5fa", "#22c55e", "#a78bfa", "#ef4444", "#06b6d4", "#f97316"];

export default function SectorBreakdown() {
  const { sectors } = usePortfolioMetrics();
  const { selection, select } = useChartSelection();

  const matches = (sector) =>
    selection.value === null || (selection.type === "sector" && selection.value === sector);

  const onClick = (d) => {
    if (d && d.sector) select("sector", d.sector, "sector");
  };

  return (
    <div className="bg-bg-surface border border-border-default rounded-[10px] p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold">Sector Breakdown</h3>
        <div className="text-[10px] uppercase tracking-wider text-text-muted">
          Revenue $M · click to filter
        </div>
      </div>
      <ResponsiveContainer width="100%" height={260}>
        <PieChart>
          <Pie
            data={sectors}
            dataKey="revenue"
            nameKey="sector"
            innerRadius={50}
            outerRadius={90}
            paddingAngle={2}
            onClick={onClick}
            cursor="pointer"
          >
            {sectors.map((entry, i) => (
              <Cell
                key={i}
                fill={COLORS[i % COLORS.length]}
                stroke="#0f1420"
                strokeWidth={2}
                opacity={matches(entry.sector) ? 1 : 0.2}
              />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{ backgroundColor: "#1e293b", border: "1px solid #334155", borderRadius: 6 }}
            formatter={(v) => [`$${Number(v).toFixed(1)}M`, "Revenue"]}
          />
          <Legend wrapperStyle={{ fontSize: 11 }} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
