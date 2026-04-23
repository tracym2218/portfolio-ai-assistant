import React, { useEffect, useRef, useState } from "react";
import { ChevronDown, X, Filter } from "lucide-react";
import { useFilters } from "../../context/FilterContext.jsx";

export default function GlobalFilterBar() {
  const {
    selectedFund,
    setSelectedFund,
    selectedCompanies,
    setSelectedCompanies,
    selectedQuarter,
    setSelectedQuarter,
    availableFunds,
    availableQuarters,
    companiesForSelect,
    clear,
    hasActiveFilters
  } = useFilters();

  const [companyOpen, setCompanyOpen] = useState(false);
  const companyRef = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (companyRef.current && !companyRef.current.contains(e.target)) {
        setCompanyOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const toggleCompany = (name) => {
    setSelectedCompanies(
      selectedCompanies.includes(name)
        ? selectedCompanies.filter((c) => c !== name)
        : [...selectedCompanies, name]
    );
  };

  const companyLabel =
    selectedCompanies.length === 0
      ? "All Companies"
      : selectedCompanies.length === 1
      ? selectedCompanies[0]
      : `${selectedCompanies.length} selected`;

  return (
    <div className="border-b border-border-default bg-bg-surface px-5 py-2 flex flex-wrap items-center gap-2">
      <div className="flex items-center gap-1 text-[10px] uppercase tracking-wider text-text-muted mr-1">
        <Filter className="w-3 h-3" /> Filters
      </div>

      {/* Fund */}
      <Selector label="Fund">
        <select
          value={selectedFund}
          onChange={(e) => setSelectedFund(e.target.value)}
          className="bg-transparent text-sm text-text-primary outline-none pr-1"
        >
          <option value="all">All Funds</option>
          {availableFunds.map((f) => (
            <option key={f} value={f}>
              {f}
            </option>
          ))}
        </select>
      </Selector>

      {/* Company multi-select */}
      <div className="relative" ref={companyRef}>
        <button
          onClick={() => setCompanyOpen((o) => !o)}
          className="inline-flex items-center gap-1.5 bg-bg-card border border-border-default hover:border-border-strong rounded px-2.5 py-1.5 text-sm text-text-primary"
        >
          <span className="text-[10px] uppercase tracking-wider text-text-muted">Company</span>
          <span className="font-medium">{companyLabel}</span>
          <ChevronDown className="w-3 h-3 text-text-muted" />
        </button>
        {companyOpen && (
          <div className="absolute z-30 mt-1 left-0 min-w-[220px] max-h-72 overflow-auto bg-bg-elevated border border-border-strong rounded shadow-lg p-2">
            {companiesForSelect.length === 0 && (
              <div className="text-xs text-text-muted px-2 py-1">No companies in this fund.</div>
            )}
            {companiesForSelect.map((name) => (
              <label
                key={name}
                className="flex items-center gap-2 px-2 py-1 text-sm rounded hover:bg-bg-card cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={selectedCompanies.includes(name)}
                  onChange={() => toggleCompany(name)}
                  className="accent-accent-gold"
                />
                {name}
              </label>
            ))}
            {selectedCompanies.length > 0 && (
              <button
                onClick={() => setSelectedCompanies([])}
                className="mt-1 w-full text-[11px] text-text-secondary hover:text-accent-gold py-1 border-t border-border-default"
              >
                Clear company selection
              </button>
            )}
          </div>
        )}
      </div>

      {/* Quarter */}
      <Selector label="Quarter">
        <select
          value={selectedQuarter}
          onChange={(e) => setSelectedQuarter(e.target.value)}
          className="bg-transparent text-sm text-text-primary outline-none pr-1"
        >
          {availableQuarters.map((q) => (
            <option key={q} value={q}>
              {q}
            </option>
          ))}
        </select>
      </Selector>

      {/* Active pills */}
      <div className="flex items-center gap-1.5 ml-1">
        {selectedFund !== "all" && (
          <Pill onClear={() => setSelectedFund("all")}>{selectedFund}</Pill>
        )}
        {selectedCompanies.map((c) => (
          <Pill key={c} onClear={() => toggleCompany(c)}>
            {c}
          </Pill>
        ))}
      </div>

      {hasActiveFilters && (
        <button
          onClick={clear}
          className="ml-auto inline-flex items-center gap-1 text-[11px] text-text-secondary hover:text-accent-gold"
        >
          <X className="w-3 h-3" /> Clear filters
        </button>
      )}
    </div>
  );
}

function Selector({ label, children }) {
  return (
    <div className="inline-flex items-center gap-1.5 bg-bg-card border border-border-default hover:border-border-strong rounded px-2.5 py-1.5">
      <span className="text-[10px] uppercase tracking-wider text-text-muted">{label}</span>
      {children}
    </div>
  );
}

function Pill({ children, onClear }) {
  return (
    <span className="inline-flex items-center gap-1 text-[11px] bg-accent-gold/15 border border-accent-gold/30 text-accent-gold rounded-full px-2 py-0.5">
      {children}
      <button onClick={onClear} className="hover:text-text-primary">
        <X className="w-3 h-3" />
      </button>
    </span>
  );
}
