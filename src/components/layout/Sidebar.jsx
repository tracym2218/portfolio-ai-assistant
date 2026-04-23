import React from "react";
import { NavLink } from "react-router-dom";
import { Home, LayoutDashboard, Building2, Sparkles, MessageSquare, FileDown, Globe2 } from "lucide-react";

const NAV = [
  { to: "/", label: "Home", icon: Home },
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/companies", label: "Companies", icon: Building2 },
  { to: "/insights", label: "Insights", icon: Sparkles },
  { to: "/market-intelligence", label: "Market Intelligence", icon: Globe2 },
  { to: "/chat", label: "Q&A Chat", icon: MessageSquare },
  { to: "/export", label: "Export", icon: FileDown }
];

export default function Sidebar() {
  return (
    <aside className="w-56 shrink-0 border-r border-border-default bg-bg-surface py-4 px-2 hidden md:flex flex-col">
      <div className="text-[10px] uppercase tracking-wider text-text-muted px-3 mb-2">Navigate</div>
      <nav className="flex flex-col gap-0.5">
        {NAV.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            end={to === "/"}
            className={({ isActive }) =>
              `flex items-center gap-2.5 px-3 py-2 rounded text-sm transition ${
                isActive
                  ? "bg-bg-elevated text-accent-gold"
                  : "text-text-secondary hover:text-text-primary hover:bg-bg-card"
              }`
            }
          >
            <Icon className="w-4 h-4" />
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>
      <div className="mt-auto px-3 text-[10px] text-text-muted mono">
        claude-sonnet-4-6
      </div>
    </aside>
  );
}
