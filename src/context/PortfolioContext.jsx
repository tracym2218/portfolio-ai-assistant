import React, { createContext, useContext, useState, useCallback } from "react";
import { SAMPLE_PORTFOLIO } from "../utils/sampleData.js";

const PortfolioContext = createContext(null);

export function PortfolioProvider({ children }) {
  const [fund, setFund] = useState(SAMPLE_PORTFOLIO.fund);
  const [quarter, setQuarter] = useState(SAMPLE_PORTFOLIO.quarter);
  const [companies, setCompanies] = useState(SAMPLE_PORTFOLIO.companies);
  const [notes, setNotes] = useState({}); // { [companyName]: string }
  const [priorQuarterCompanies, setPriorQuarterCompanies] = useState(null);

  const loadSample = useCallback(() => {
    setFund(SAMPLE_PORTFOLIO.fund);
    setQuarter(SAMPLE_PORTFOLIO.quarter);
    setCompanies(SAMPLE_PORTFOLIO.companies);
    setNotes({});
  }, []);

  const replaceCompanies = useCallback((next) => {
    setCompanies(next);
  }, []);

  const updateNote = useCallback((companyName, text) => {
    setNotes((prev) => ({ ...prev, [companyName]: text }));
  }, []);

  const value = {
    fund,
    setFund,
    quarter,
    setQuarter,
    companies,
    replaceCompanies,
    notes,
    updateNote,
    loadSample,
    priorQuarterCompanies,
    setPriorQuarterCompanies
  };

  return <PortfolioContext.Provider value={value}>{children}</PortfolioContext.Provider>;
}

export function usePortfolio() {
  const ctx = useContext(PortfolioContext);
  if (!ctx) throw new Error("usePortfolio must be used within PortfolioProvider");
  return ctx;
}
