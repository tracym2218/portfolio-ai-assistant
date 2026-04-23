import React from "react";
import { Leaf, Users2, Shield, Flag } from "lucide-react";

const scoreColor = (score) => {
  if (score >= 75) return "#22c55e";
  if (score >= 60) return "#60a5fa";
  if (score >= 45) return "#f59e0b";
  return "#ef4444";
};

export default function ESGPanel({ company }) {
  const esg = company.esg;
  if (!esg) {
    return (
      <div className="bg-bg-surface border border-border-default rounded-[10px] p-4 text-sm text-text-muted">
        No ESG data available for this company.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="grid sm:grid-cols-3 gap-3">
        <ScoreCard
          icon={Leaf}
          label="Environment"
          score={esg.environmentScore}
          rating={esg.environmentRating}
        />
        <ScoreCard
          icon={Users2}
          label="Social"
          score={esg.socialScore}
          rating={esg.socialRating}
        />
        <ScoreCard
          icon={Shield}
          label="Governance"
          score={esg.governanceScore}
          rating={esg.governanceRating}
        />
      </div>

      <div className="bg-bg-surface border border-border-default rounded-[10px] p-4 flex items-center justify-between">
        <div>
          <div className="text-[10px] uppercase tracking-wider text-text-muted">Overall ESG Rating</div>
          <div className="text-xl font-bold mono mt-0.5">{esg.overallRating || "—"}</div>
        </div>
        <div className="text-xs text-text-secondary max-w-md text-right">
          Composite rating based on E/S/G pillar scores and sector benchmark weighting.
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-3">
        <DetailSection icon={Leaf} title="Environment">
          <li>{esg.carbonIntensity || "—"}</li>
        </DetailSection>
        <DetailSection icon={Users2} title="Social">
          <li>{esg.diversityNote || "—"}</li>
        </DetailSection>
        <DetailSection icon={Shield} title="Governance">
          <li>Board independence: {esg.boardIndependence || "—"}</li>
          <li>Audit committee: operational, independent chair</li>
        </DetailSection>
        <DetailSection icon={Flag} title="Flags">
          {esg.flags && esg.flags.length > 0
            ? esg.flags.map((f, i) => <li key={i}>{f}</li>)
            : <li className="text-text-muted">No material flags.</li>}
        </DetailSection>
      </div>

      <div className="text-[11px] text-text-muted leading-relaxed">
        ESG data is estimated based on sector benchmarks and available disclosures. For verified scores, connect MSCI ESG, Sustainalytics, or the firm's ESG data feed.
      </div>
    </div>
  );
}

function ScoreCard({ icon: Icon, label, score, rating }) {
  const color = scoreColor(score);
  return (
    <div className="bg-bg-surface border border-border-default rounded-[10px] p-4">
      <div className="flex items-center justify-between mb-1.5">
        <div className="inline-flex items-center gap-1.5 text-[11px] uppercase tracking-wider text-text-muted font-semibold">
          <Icon className="w-3.5 h-3.5" /> {label}
        </div>
        <span
          className="text-[10px] font-semibold px-2 py-0.5 rounded-full"
          style={{ backgroundColor: color + "22", color }}
        >
          {rating || "—"}
        </span>
      </div>
      <div className="flex items-end gap-2">
        <div className="mono font-bold text-2xl" style={{ color }}>
          {score ?? "—"}
        </div>
        <div className="text-xs text-text-muted mono mb-1">/ 100</div>
      </div>
      <div className="mt-2 h-1.5 rounded-full bg-bg-elevated overflow-hidden">
        <div
          className="h-full rounded-full"
          style={{ width: `${Math.max(0, Math.min(100, score || 0))}%`, backgroundColor: color }}
        />
      </div>
    </div>
  );
}

function DetailSection({ icon: Icon, title, children }) {
  return (
    <div className="bg-bg-surface border border-border-default rounded-[10px] p-4">
      <div className="flex items-center gap-1.5 mb-2">
        <Icon className="w-3.5 h-3.5 text-accent-gold" />
        <h4 className="text-sm font-semibold">{title}</h4>
      </div>
      <ul className="text-xs text-text-secondary space-y-1 list-disc list-inside leading-relaxed">
        {children}
      </ul>
    </div>
  );
}
