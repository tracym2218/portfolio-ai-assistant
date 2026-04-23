import React from "react";
import { User, Users } from "lucide-react";

export default function LeadershipPanel({ company }) {
  const leadership = company.leadership || [];
  const board = company.boardMembers || [];

  const initials = (name) =>
    name
      .split(/\s+/)
      .map((w) => w[0])
      .slice(0, 2)
      .join("")
      .toUpperCase();

  return (
    <div className="space-y-4">
      <section className="bg-bg-surface border border-border-default rounded-[10px] p-4">
        <div className="flex items-center gap-2 mb-3">
          <User className="w-4 h-4 text-accent-gold" />
          <h3 className="text-sm font-semibold">C-Suite</h3>
          <span className="text-[10px] uppercase tracking-wider text-text-muted">
            {leadership.length} leaders
          </span>
        </div>
        {leadership.length === 0 ? (
          <div className="text-sm text-text-muted">No leadership data.</div>
        ) : (
          <div className="space-y-3">
            {leadership.map((p) => (
              <Person key={p.name} initials={initials(p.name)} name={p.name} role={p.title} background={p.background} tenure={p.tenure} />
            ))}
          </div>
        )}
      </section>

      <section className="bg-bg-surface border border-border-default rounded-[10px] p-4">
        <div className="flex items-center gap-2 mb-3">
          <Users className="w-4 h-4 text-accent-gold" />
          <h3 className="text-sm font-semibold">Board of Directors</h3>
          <span className="text-[10px] uppercase tracking-wider text-text-muted">
            {board.length} directors
          </span>
        </div>
        {board.length === 0 ? (
          <div className="text-sm text-text-muted">No board data.</div>
        ) : (
          <div className="space-y-3">
            {board.map((p) => (
              <Person key={p.name} initials={initials(p.name)} name={p.name} role={p.role} background={p.background} />
            ))}
          </div>
        )}
      </section>

      <div className="text-[11px] text-text-muted leading-relaxed">
        Leadership and board data is illustrative. In production, connect PitchBook People, LinkedIn Sales Navigator, or the firm's own people-tracker.
      </div>
    </div>
  );
}

function Person({ initials, name, role, background, tenure }) {
  return (
    <div className="flex items-start gap-3 bg-bg-card border border-border-default rounded p-3">
      <div className="w-10 h-10 shrink-0 rounded-full bg-bg-elevated border border-border-strong flex items-center justify-center text-accent-gold font-semibold text-xs mono">
        {initials}
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-baseline gap-2 flex-wrap">
          <div className="font-semibold text-sm">{name}</div>
          <div className="text-xs text-text-secondary">{role}</div>
          {tenure && <div className="text-[10px] text-text-muted mono">· {tenure}</div>}
        </div>
        {background && <div className="text-xs text-text-secondary mt-1 leading-relaxed">{background}</div>}
      </div>
    </div>
  );
}
