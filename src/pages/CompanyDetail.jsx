import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import PageWrapper from "../components/layout/PageWrapper.jsx";
import { usePortfolio } from "../context/PortfolioContext.jsx";
import { slugify } from "../utils/slug.js";
import CompanyHeader from "../components/companies/CompanyHeader.jsx";
import FinancialSummary from "../components/companies/FinancialSummary.jsx";
import LeadershipPanel from "../components/companies/LeadershipPanel.jsx";
import ESGPanel from "../components/companies/ESGPanel.jsx";
import NewsPanel from "../components/companies/NewsPanel.jsx";
import CompanyAIAnalysis from "../components/companies/CompanyAIAnalysis.jsx";

const TABS = [
  { id: "financial", label: "Financial Summary" },
  { id: "leadership", label: "Leadership & Board" },
  { id: "esg", label: "ESG" },
  { id: "news", label: "News" },
  { id: "ai", label: "AI Analysis" }
];

export default function CompanyDetail() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { companies } = usePortfolio();
  const [active, setActive] = useState("financial");

  const company = companies.find((c) => slugify(c.company) === slug);

  if (!company) {
    return (
      <PageWrapper
        title="Company not found"
        actions={
          <button
            onClick={() => navigate("/companies")}
            className="inline-flex items-center gap-1 text-sm text-text-secondary hover:text-accent-gold"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Companies
          </button>
        }
      >
        <div className="bg-bg-card border border-border-default rounded-[10px] p-6 text-sm text-text-secondary">
          No portfolio company matches slug <span className="mono">{slug}</span>.
        </div>
      </PageWrapper>
    );
  }

  return (
    <div className="p-6 max-w-[1400px] mx-auto space-y-4">
      <button
        onClick={() => navigate("/companies")}
        className="inline-flex items-center gap-1 text-sm text-text-secondary hover:text-accent-gold"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Companies
      </button>

      <CompanyHeader company={company} />

      <div className="border-b border-border-default flex items-center gap-1 overflow-x-auto">
        {TABS.map((t) => (
          <button
            key={t.id}
            onClick={() => setActive(t.id)}
            className={`px-3 py-2 text-sm whitespace-nowrap transition -mb-px border-b-2 ${
              active === t.id
                ? "border-accent-gold text-accent-gold"
                : "border-transparent text-text-secondary hover:text-text-primary"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div>
        {active === "financial" && <FinancialSummary company={company} />}
        {active === "leadership" && <LeadershipPanel company={company} />}
        {active === "esg" && <ESGPanel company={company} />}
        {active === "news" && <NewsPanel company={company} />}
        {active === "ai" && <CompanyAIAnalysis company={company} />}
      </div>
    </div>
  );
}
