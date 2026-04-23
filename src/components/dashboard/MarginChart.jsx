import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
  ResponsiveContainer
} from "recharts";
import { useFilters } from "../../context/FilterContext.jsx";
import { useChartSelection } from "../../context/ChartSelectionContext.jsx";

export default function MarginChart() {
  const { filteredCompanies: companies } = useFilters();
  const { selection, select } = useChartSelection();

  const data = companies.map((c) => ({
    name: c.company.length > 14 ? c.company.slice(0, 12) + "…" : c.company,
    fullName: c.company,
    sector: c.sector,
    Margin: c.ebitdaMargin
  }));
  const avg = data.reduce((s, d) => s + d.Margin, 0) / (data.length || 1);

  const matches = (d) =>
    selection.value === null ||
    (selection.type === "company" && selection.value === d.fullName) ||
    (selection.type === "sector" && selection.value === d.sector);

  const handleDotClick = (payload) => {
    if (payload && payload.fullName) select("company", payload.fullName, "margin");
  };

  const renderDot = (props) => {
    const { cx, cy, payload, index } = props;
    const active = matches(payload);
    return (
      <circle
        key={index}
        cx={cx}
        cy={cy}
        r={4}
        fill="#60a5fa"
        opacity={active ? 1 : 0.2}
        style={{ cursor: "pointer" }}
        onClick={() => handleDotClick(payload)}
      />
    );
  };

  const renderActiveDot = (props) => {
    const { cx, cy, payload } = props;
    return (
      <circle
        cx={cx}
        cy={cy}
        r={6}
        fill="#60a5fa"
        style={{ cursor: "pointer" }}
        onClick={() => handleDotClick(payload)}
      />
    );
  };

  return (
    <div className="bg-bg-surface border border-border-default rounded-[10px] p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold">EBITDA Margin</h3>
        <div className="text-[10px] uppercase tracking-wider text-text-muted">
          Avg {avg.toFixed(1)}% · click point to filter
        </div>
      </div>
      <ResponsiveContainer width="100%" height={260}>
        <LineChart data={data} margin={{ top: 5, right: 5, left: -10, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
          <XAxis dataKey="name" tick={{ fill: "#94a3b8", fontSize: 11 }} interval={0} angle={-20} textAnchor="end" height={60} />
          <YAxis tick={{ fill: "#94a3b8", fontSize: 11 }} unit="%" />
          <Tooltip
            contentStyle={{ backgroundColor: "#1e293b", border: "1px solid #334155", borderRadius: 6 }}
            formatter={(v) => [`${v}%`, "Margin"]}
          />
          <ReferenceLine
            y={avg}
            stroke="#f59e0b"
            strokeDasharray="4 4"
            label={{ value: "Avg", fill: "#f59e0b", fontSize: 10, position: "right" }}
          />
          <Line
            type="monotone"
            dataKey="Margin"
            stroke="#60a5fa"
            strokeWidth={2}
            dot={renderDot}
            activeDot={renderActiveDot}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
