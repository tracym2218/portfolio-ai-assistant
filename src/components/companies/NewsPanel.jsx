import React from "react";
import { Newspaper, TrendingUp, TrendingDown, Minus } from "lucide-react";

const SENTIMENT = {
  positive: { color: "#22c55e", icon: TrendingUp, label: "Positive" },
  negative: { color: "#ef4444", icon: TrendingDown, label: "Negative" },
  neutral: { color: "#94a3b8", icon: Minus, label: "Neutral" }
};

export default function NewsPanel({ company }) {
  const news = company.news || [];
  return (
    <div className="space-y-4">
      <div className="bg-bg-surface border border-border-default rounded-[10px] p-4">
        <div className="flex items-center gap-2 mb-3">
          <Newspaper className="w-4 h-4 text-accent-gold" />
          <h3 className="text-sm font-semibold">Recent Coverage</h3>
          <span className="text-[10px] uppercase tracking-wider text-text-muted">
            {news.length} items
          </span>
        </div>
        {news.length === 0 ? (
          <div className="text-sm text-text-muted">No recent news items.</div>
        ) : (
          <div className="space-y-2">
            {news.map((n, i) => {
              const s = SENTIMENT[n.sentiment] || SENTIMENT.neutral;
              const Icon = s.icon;
              return (
                <div
                  key={i}
                  className="flex items-start gap-3 bg-bg-card border border-border-default rounded p-3"
                >
                  <div
                    className="w-1 self-stretch rounded-full shrink-0"
                    style={{ backgroundColor: s.color }}
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 text-[10px] text-text-muted mono uppercase tracking-wider">
                      <span>{n.date}</span>
                      <span>·</span>
                      <span>{n.source}</span>
                    </div>
                    <div className="text-sm text-text-primary mt-0.5 leading-snug">
                      {n.headline}
                    </div>
                  </div>
                  <span
                    className="shrink-0 inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full"
                    style={{ backgroundColor: s.color + "22", color: s.color }}
                  >
                    <Icon className="w-3 h-3" /> {s.label}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>
      <div className="text-[11px] text-text-muted leading-relaxed">
        News items are illustrative. In production, connect NewsAPI, PitchBook News, or the firm's preferred news feed for real-time monitoring.
      </div>
    </div>
  );
}
