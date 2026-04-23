import React, { createContext, useCallback, useContext, useRef, useState } from "react";

const AIContentContext = createContext(null);

const DEFAULT_SECTION = {
  content: "",
  original: "",
  isEditing: false,
  isEdited: false,
  dimension: null,
  generatedAt: null,
  isStreaming: false
};

const INITIAL_STATE = {
  // Insights page sections
  "insights.executive_summary": { ...DEFAULT_SECTION, dimension: "performance" },
  "insights.top_performers": { ...DEFAULT_SECTION, dimension: "revenue-growth" },
  "insights.watch_list": { ...DEFAULT_SECTION, dimension: "financial-risk" },
  "insights.sector_themes": { ...DEFAULT_SECTION, dimension: "by-sector" },
  "insights.recommended_actions": { ...DEFAULT_SECTION, dimension: "deal-team" },
  "insights.lp_talking_points": { ...DEFAULT_SECTION, dimension: "pension-endowment" },
  // Dashboard auto-generated callouts (content is an array of strings)
  "dashboard.quick_insights": {
    content: [],
    generatedAt: null,
    isStreaming: false,
    signature: null
  },
  // Market intelligence AI synthesis
  "market.synthesis": { ...DEFAULT_SECTION, dimension: "full-synthesis" }
  // Per-company sections keyed dynamically, e.g. "company.apex-systems.overview"
};

export function AIContentProvider({ children }) {
  const [aiContent, setAIContent] = useState(INITIAL_STATE);
  const stateRef = useRef(aiContent);
  stateRef.current = aiContent;

  const setSection = useCallback((key, updates) => {
    setAIContent((prev) => {
      const current = prev[key] || { ...DEFAULT_SECTION };
      const patch = typeof updates === "function" ? updates(current) : updates;
      return { ...prev, [key]: { ...current, ...patch } };
    });
  }, []);

  // Stable identity — safe to use inside useEffect dep arrays.
  // Reads latest state via ref; callers needing reactivity should read aiContent directly.
  const getSection = useCallback(
    (key) => stateRef.current[key] || { ...DEFAULT_SECTION },
    []
  );

  const resetSection = useCallback((key) => {
    setAIContent((prev) => ({ ...prev, [key]: { ...DEFAULT_SECTION } }));
  }, []);

  const resetAll = useCallback(() => setAIContent(INITIAL_STATE), []);

  const value = { aiContent, setSection, getSection, resetSection, resetAll };

  return <AIContentContext.Provider value={value}>{children}</AIContentContext.Provider>;
}

export function useAIContent() {
  const ctx = useContext(AIContentContext);
  if (!ctx) throw new Error("useAIContent must be used within AIContentProvider");
  return ctx;
}
