import React, { createContext, useContext, useMemo, useState } from "react";
import { usePortfolio } from "./PortfolioContext.jsx";

const FilterContext = createContext(null);

export function FilterProvider({ children }) {
  const { companies: allCompanies, quarter, setQuarter } = usePortfolio();

  const [selectedFund, setSelectedFund] = useState("all");
  const [selectedCompanies, setSelectedCompanies] = useState([]); // [] = all

  const filteredCompanies = useMemo(() => {
    return allCompanies
      .filter((c) => selectedFund === "all" || c.fund === selectedFund)
      .filter(
        (c) => selectedCompanies.length === 0 || selectedCompanies.includes(c.company)
      );
  }, [allCompanies, selectedFund, selectedCompanies]);

  const availableFunds = useMemo(() => {
    const set = new Set();
    allCompanies.forEach((c) => {
      if (c.fund) set.add(c.fund);
    });
    return Array.from(set).sort();
  }, [allCompanies]);

  // Companies available to choose from, narrowed by active fund filter
  const companiesForSelect = useMemo(() => {
    return allCompanies
      .filter((c) => selectedFund === "all" || c.fund === selectedFund)
      .map((c) => c.company)
      .sort();
  }, [allCompanies, selectedFund]);

  const availableQuarters = ["Q4 2024", "Q1 2025", "Q2 2025"];

  const clear = () => {
    setSelectedFund("all");
    setSelectedCompanies([]);
  };

  const hasActiveFilters =
    selectedFund !== "all" || selectedCompanies.length > 0;

  // Quarter is proxied to PortfolioContext so there's only one source of truth.
  const value = {
    selectedFund,
    setSelectedFund,
    selectedCompanies,
    setSelectedCompanies,
    selectedQuarter: quarter,
    setSelectedQuarter: setQuarter,
    availableQuarters,
    filteredCompanies,
    availableFunds,
    companiesForSelect,
    clear,
    hasActiveFilters
  };

  return <FilterContext.Provider value={value}>{children}</FilterContext.Provider>;
}

export function useFilters() {
  const ctx = useContext(FilterContext);
  if (!ctx) throw new Error("useFilters must be used within FilterProvider");
  return ctx;
}
