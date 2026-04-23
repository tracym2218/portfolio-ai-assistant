import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Database, UploadCloud, ArrowRight, FileSpreadsheet } from "lucide-react";
import PageWrapper from "../components/layout/PageWrapper.jsx";
import { usePortfolio } from "../context/PortfolioContext.jsx";
import ExcelUploader from "../components/upload/ExcelUploader.jsx";
import ColumnMapper from "../components/upload/ColumnMapper.jsx";

const QUARTERS = ["Q1", "Q2", "Q3", "Q4"];
const YEARS = ["2023", "2024", "2025", "2026"];

export default function Home() {
  const navigate = useNavigate();
  const { fund, setFund, quarter, setQuarter, loadSample } = usePortfolio();
  const [uploadState, setUploadState] = useState(null); // { rows, headers } after parsing
  const [q, setQ] = useState(quarter.split(" ")[0] || "Q1");
  const [y, setY] = useState(quarter.split(" ")[1] || "2025");

  const applyQuarter = (nq, ny) => {
    setQ(nq);
    setY(ny);
    setQuarter(`${nq} ${ny}`);
  };

  return (
    <PageWrapper
      title="Portfolio AI Assistant"
      subtitle="Upload quarterly portfolio data — get AI-ready commentary, dashboards, and client-ready exports."
    >
      <div className="bg-bg-card border border-border-default rounded-[10px] p-6 mb-5">
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-[11px] uppercase tracking-wider text-text-muted mb-1.5">
              Fund Name
            </label>
            <input
              value={fund}
              onChange={(e) => setFund(e.target.value)}
              className="w-full bg-bg-surface border border-border-default rounded px-3 py-2 text-sm focus:border-accent-gold outline-none"
              placeholder="e.g. Alpha Private Equity Fund III"
            />
          </div>
          <div>
            <label className="block text-[11px] uppercase tracking-wider text-text-muted mb-1.5">
              Reporting Quarter
            </label>
            <div className="flex gap-2">
              <select
                value={q}
                onChange={(e) => applyQuarter(e.target.value, y)}
                className="bg-bg-surface border border-border-default rounded px-3 py-2 text-sm focus:border-accent-gold outline-none"
              >
                {QUARTERS.map((x) => (
                  <option key={x} value={x}>
                    {x}
                  </option>
                ))}
              </select>
              <select
                value={y}
                onChange={(e) => applyQuarter(q, e.target.value)}
                className="bg-bg-surface border border-border-default rounded px-3 py-2 text-sm focus:border-accent-gold outline-none"
              >
                {YEARS.map((x) => (
                  <option key={x} value={x}>
                    {x}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div className="bg-bg-card border border-border-default rounded-[10px] p-6">
          <div className="flex items-center gap-2 mb-3">
            <UploadCloud className="w-5 h-5 text-accent-gold" />
            <h2 className="font-semibold">Upload Excel</h2>
          </div>
          <p className="text-sm text-text-secondary mb-4">
            Drop an .xlsx or .csv file. You'll map the columns on the next step.
          </p>
          <ExcelUploader onParsed={setUploadState} />
        </div>

        <div className="bg-bg-card border border-border-default rounded-[10px] p-6">
          <div className="flex items-center gap-2 mb-3">
            <Database className="w-5 h-5 text-accent-gold" />
            <h2 className="font-semibold">Load Sample Data</h2>
          </div>
          <p className="text-sm text-text-secondary mb-4">
            Pre-populates 7 companies across 6 sectors. Ideal for demo and exploration.
          </p>
          <button
            onClick={() => {
              loadSample();
              navigate("/dashboard");
            }}
            className="inline-flex items-center gap-2 bg-accent-gold text-bg-base font-bold px-4 py-2 rounded hover:bg-accent-gold-dim transition"
          >
            <FileSpreadsheet className="w-4 h-4" />
            Load Sample Portfolio
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {uploadState && (
        <ColumnMapper
          rows={uploadState.rows}
          headers={uploadState.headers}
          onCancel={() => setUploadState(null)}
          onConfirm={() => {
            setUploadState(null);
            navigate("/dashboard");
          }}
        />
      )}
    </PageWrapper>
  );
}
