import React from "react";
import { Lightbulb } from "lucide-react";

export const SUGGESTIONS = [
  "Which companies are underperforming revenue plan?",
  "What's the average EBITDA margin by sector?",
  "Which company carries the highest leverage?",
  "Draft a summary I can share with my client",
  "Flag any covenant risk based on net debt levels"
];

export default function SuggestedQuestions({ onPick }) {
  return (
    <aside className="w-72 shrink-0 border-l border-border-default bg-bg-surface p-4 hidden lg:flex flex-col gap-2">
      <div className="flex items-center gap-2 mb-2">
        <Lightbulb className="w-4 h-4 text-accent-gold" />
        <div className="text-sm font-semibold">Suggested</div>
      </div>
      {SUGGESTIONS.map((q) => (
        <button
          key={q}
          onClick={() => onPick(q)}
          className="text-left text-xs text-text-secondary hover:text-text-primary border border-border-default hover:border-accent-gold rounded p-2 transition"
        >
          {q}
        </button>
      ))}
    </aside>
  );
}
