import React from "react";
import AISectionCard from "../ai/AISectionCard.jsx";
import { COMPANY_DIMENSIONS } from "../../utils/dimensions.js";
import { SYSTEM_PROMPT_BASE } from "../../hooks/useClaudeAI.js";
import { slugify } from "../../utils/slug.js";

const SECTIONS = [
  { id: "overview", title: "Company Overview", dims: COMPANY_DIMENSIONS.overview, task: "Generate a specific executive commentary on this company for the selected dimension below." },
  { id: "financial_commentary", title: "Financial Commentary", dims: COMPANY_DIMENSIONS.financial_commentary, task: "Generate specific financial commentary for this company in the selected dimension." },
  { id: "value_creation", title: "Value Creation Assessment", dims: COMPANY_DIMENSIONS.value_creation, task: "Generate a value-creation assessment for this company in the selected dimension." },
  { id: "next_steps", title: "Recommended Next Steps", dims: COMPANY_DIMENSIONS.next_steps, task: "Generate prioritized next steps for this company in the selected dimension." }
];

const SYSTEM = `${SYSTEM_PROMPT_BASE}\n\nYou have full financial and operational data for a single portfolio company. Generate sharp, specific commentary in the requested analytical dimension. Use exact numbers. Write for a deal team — direct, no filler. Max 150 words per section.`;

function companyContext(company) {
  return `COMPANY: ${company.company}
Fund: ${company.fund || "—"}  ·  Sector: ${company.sector}  ·  HQ: ${company.hqCity || company.country || "—"}
Investment date: ${company.investmentDate || "—"}
Description: ${company.description || "—"}

FINANCIALS (this quarter):
- Revenue: $${company.revenue}M  (plan $${company.revenuePlan}M, ${((company.revenue / company.revenuePlan - 1) * 100).toFixed(1)}% vs plan)
- EBITDA: $${company.ebitda}M  (plan $${company.ebitdaPlan}M, margin ${company.ebitdaMargin}%)
- YoY revenue growth: ${company.revenueGrowth}%
- Net Debt: $${company.netDebt}M  (implied leverage ~${(company.netDebt / Math.max(company.ebitda, 0.1)).toFixed(1)}x)
- Employees: ${company.employees ?? "—"}`;
}

export default function CompanyAIAnalysis({ company }) {
  const slug = slugify(company.company);
  const ctx = companyContext(company);

  return (
    <div className="space-y-3">
      <div className="text-xs text-text-muted">
        Four analytical sections, each with its own re-run dimension. Content persists across
        navigation and is written to the central AI store.
      </div>
      {SECTIONS.map((s) => (
        <AISectionCard
          key={s.id}
          sectionKey={`company.${slug}.${s.id}`}
          title={s.title}
          dimensions={s.dims}
          buildPrompt={(dim) => {
            const lens = (s.dims.find((d) => d.value === dim) || {}).prompt || "";
            return {
              system: SYSTEM,
              user: `${ctx}\n\nTASK: ${s.task}\n\nDIMENSION LENS: ${lens}\n\nReturn only body content — no heading, no preamble.`,
              maxTokens: 400
            };
          }}
        />
      ))}
    </div>
  );
}
