import React from "react";
import { X, Filter } from "lucide-react";
import { useChartSelection } from "../../context/ChartSelectionContext.jsx";

export default function SelectionStrip() {
  const { selection, clear } = useChartSelection();
  if (!selection.value) return null;

  const label = selection.type === "sector" ? "sector" : "company";

  return (
    <div className="mb-3 flex items-center gap-2 bg-accent-gold/15 border border-accent-gold/40 rounded-lg px-3 py-2 text-sm">
      <Filter className="w-3.5 h-3.5 text-accent-gold shrink-0" />
      <span className="text-text-primary">
        Charts filtered to {label}: <strong className="text-accent-gold">{selection.value}</strong>
      </span>
      <button
        onClick={clear}
        className="ml-auto inline-flex items-center gap-1 text-[11px] text-text-secondary hover:text-accent-gold"
      >
        <X className="w-3 h-3" /> Clear
      </button>
    </div>
  );
}
