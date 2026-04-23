import React from "react";
import { Link } from "react-router-dom";
import { Activity } from "lucide-react";
import { usePortfolio } from "../../context/PortfolioContext.jsx";

export default function Header() {
  const { fund, quarter } = usePortfolio();
  return (
    <header className="h-14 border-b border-border-default bg-bg-surface flex items-center px-5 shrink-0">
      <Link to="/" className="flex items-center gap-2">
        <div className="w-7 h-7 rounded bg-accent-gold flex items-center justify-center">
          <Activity className="w-4 h-4 text-bg-base" strokeWidth={2.5} />
        </div>
        <div className="font-semibold tracking-tight text-text-primary">Portfolio AI Assistant</div>
      </Link>
      <div className="mx-4 h-5 w-px bg-border-default" />
      <div className="text-xs text-text-secondary mono">
        <span className="text-text-primary">{fund}</span>
        <span className="mx-2 text-text-muted">·</span>
        <span>{quarter}</span>
      </div>
      <div className="ml-auto text-xs text-text-muted mono">Alpha FMC Hackathon</div>
    </header>
  );
}
