import React from "react";
import { Building2, MapPin, Calendar, Users } from "lucide-react";
import { computeStatus, STATUS_COLOR } from "../../utils/metrics.js";
import { fmtNum } from "../../utils/formatters.js";

export default function CompanyHeader({ company }) {
  const status = computeStatus(company);
  const investmentYear = company.investmentDate ? company.investmentDate.slice(0, 4) : null;

  return (
    <div className="bg-bg-card border border-border-default rounded-[10px] p-5">
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 shrink-0 rounded-lg bg-bg-elevated border border-border-strong flex items-center justify-center text-accent-gold font-bold text-lg mono">
          {company.company
            .split(/\s+/)
            .map((w) => w[0])
            .slice(0, 2)
            .join("")
            .toUpperCase()}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 flex-wrap">
            <h1 className="text-xl font-semibold tracking-tight">{company.company}</h1>
            <span
              className="text-[10px] font-semibold px-2 py-0.5 rounded-full"
              style={{ backgroundColor: STATUS_COLOR[status] + "22", color: STATUS_COLOR[status] }}
            >
              {status}
            </span>
            {company.fund && (
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-bg-elevated text-text-secondary border border-border-default">
                {company.fund}
              </span>
            )}
          </div>
          <div className="mt-1 text-xs text-text-secondary flex items-center flex-wrap gap-x-3 gap-y-1">
            <span className="inline-flex items-center gap-1">
              <Building2 className="w-3 h-3" /> {company.sector}
            </span>
            {company.hqCity && (
              <span className="inline-flex items-center gap-1">
                <MapPin className="w-3 h-3" /> {company.hqCity}
              </span>
            )}
            {investmentYear && (
              <span className="inline-flex items-center gap-1">
                <Calendar className="w-3 h-3" /> Invested {investmentYear}
              </span>
            )}
            {company.employees && (
              <span className="inline-flex items-center gap-1">
                <Users className="w-3 h-3" /> {fmtNum(company.employees)} employees
              </span>
            )}
            {company.website && (
              <a
                href={`https://${company.website.replace(/^https?:\/\//, "")}`}
                target="_blank"
                rel="noreferrer"
                className="text-accent-gold hover:underline"
              >
                {company.website}
              </a>
            )}
          </div>
          {company.description && (
            <p className="mt-3 text-sm text-text-primary leading-relaxed">{company.description}</p>
          )}
        </div>
      </div>
    </div>
  );
}
