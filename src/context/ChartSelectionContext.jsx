import React, { createContext, useCallback, useContext, useState } from "react";

const ChartSelectionContext = createContext(null);

const EMPTY = { type: null, value: null, source: null };

export function ChartSelectionProvider({ children }) {
  const [selection, setSelection] = useState(EMPTY);

  const select = useCallback((type, value, source) => {
    setSelection((prev) =>
      prev.type === type && prev.value === value ? EMPTY : { type, value, source }
    );
  }, []);

  const clear = useCallback(() => setSelection(EMPTY), []);

  const isSelected = useCallback(
    (type, value) =>
      selection.value === null || (selection.type === type && selection.value === value),
    [selection]
  );

  const value = { selection, select, clear, isSelected };

  return (
    <ChartSelectionContext.Provider value={value}>{children}</ChartSelectionContext.Provider>
  );
}

export function useChartSelection() {
  const ctx = useContext(ChartSelectionContext);
  if (!ctx) throw new Error("useChartSelection must be used within ChartSelectionProvider");
  return ctx;
}
