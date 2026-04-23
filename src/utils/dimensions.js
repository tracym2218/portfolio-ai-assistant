// Centralized dimension catalog for every AI section that supports re-run dimensions.
// Each entry: { value, label, prompt (lens guidance appended to the user message) }

export const INSIGHTS_DIMENSIONS = {
  executive_summary: [
    { value: "performance", label: "Performance", prompt: "Focus on revenue and EBITDA performance vs plan. Lead with the portfolio-level headline, then call out the 2-3 most material variances." },
    { value: "risk", label: "Risk", prompt: "Focus on downside risks. Identify companies with covenant proximity, margin compression, or revenue trajectory that threatens returns. Write for a risk committee." },
    { value: "lp-ready", label: "LP-ready", prompt: "Write for an LP audience — pension or endowment. Avoid internal jargon. Emphasize fund-level performance vs benchmark, distribution trajectory, and portfolio health." },
    { value: "board-memo", label: "Board memo", prompt: "Write for a board package. Formal register, precise numbers, no hedging. Lead with performance, follow with risks, close with decisions required." }
  ],
  top_performers: [
    { value: "revenue-growth", label: "Revenue growth", prompt: "Rank by YoY revenue growth. Lead with the top 2-3; call out sustainability of growth." },
    { value: "ebitda-margin", label: "EBITDA margin", prompt: "Rank by EBITDA margin and margin expansion. Contextualize by sector." },
    { value: "vs-plan", label: "vs Plan", prompt: "Rank by revenue and EBITDA variance vs plan. Quantify beat, name why." },
    { value: "value-creation", label: "Value creation", prompt: "Identify companies with clear value-creation traction — multiple expansion potential, strategic moves, operational wins." }
  ],
  watch_list: [
    { value: "financial-risk", label: "Financial risk", prompt: "Focus on revenue/EBITDA miss, working capital stress, liquidity. Suggest short-term operator actions." },
    { value: "operational-risk", label: "Operational risk", prompt: "Focus on operational red flags — management gaps, customer concentration, execution issues. Recommend interventions." },
    { value: "leverage", label: "Leverage & covenants", prompt: "Focus exclusively on debt and covenant risk. Reference net debt figures, estimate leverage ratios, flag any companies within 1.5x of likely maintenance covenants." },
    { value: "exit-readiness", label: "Exit readiness", prompt: "Assess each at-risk company's exit readiness. What would a buyer need to see? What's the realistic exit timeline and multiple range given current performance?" }
  ],
  sector_themes: [
    { value: "by-sector", label: "By sector", prompt: "Group findings by sector. 1-2 bullets per sector present in the portfolio." },
    { value: "by-geography", label: "By geography", prompt: "Group findings by HQ country/region. Highlight macro or regulatory drivers." },
    { value: "by-stage", label: "By investment stage", prompt: "Group by vintage (investment date). Contrast older Fund II holdings vs newer Fund III." },
    { value: "macro-linkage", label: "Macro linkage", prompt: "Tie portfolio performance to prevailing macro drivers (rates, energy, labor, consumer demand)." }
  ],
  recommended_actions: [
    { value: "deal-team", label: "Deal team", prompt: "Deal team actions: monitoring, thesis checks, capital allocation. Numbered list." },
    { value: "portfolio-ops", label: "Portfolio ops", prompt: "Portfolio operations actions: value-creation levers, operator interventions, cross-portfolio initiatives. Numbered list." },
    { value: "bd-exit", label: "BD / Exit", prompt: "Business development and exit-preparation actions: buyer mapping, positioning, timing. Numbered list." },
    { value: "financing", label: "Financing", prompt: "Financing and capital-structure actions: refis, dividend recaps, amendments, hedging. Numbered list." }
  ],
  lp_talking_points: [
    { value: "pension-endowment", label: "Pension / endowment", prompt: "Register: institutional, measured, benchmark-aware. Emphasize fund-level performance and portfolio health." },
    { value: "family-office", label: "Family office", prompt: "Register: direct and personal. Emphasize specific wins, tangible milestones, thematic angles." },
    { value: "sovereign-wealth", label: "Sovereign wealth", prompt: "Register: formal and macro-aware. Emphasize resilience, geographic diversification, and alignment with SWF mandates." },
    { value: "fund-of-funds", label: "Fund of funds", prompt: "Register: peer-group comparable. Emphasize quartile positioning and differentiated strategy." }
  ]
};

export const COMPANY_DIMENSIONS = {
  overview: [
    { value: "performance-summary", label: "Performance summary", prompt: "Snapshot of this quarter: revenue vs plan, EBITDA vs plan, growth, margin, leverage. Lead with the headline." },
    { value: "thesis-check", label: "Investment thesis check", prompt: "Is the original investment thesis on track? State the thesis implicitly from the data and call out what's working vs off-track." },
    { value: "exit-readiness", label: "Exit readiness", prompt: "Assess exit readiness. What would a strategic or sponsor buyer need to see? Realistic timeline and EV/EBITDA range." },
    { value: "risk-profile", label: "Risk profile", prompt: "Top 2-3 risks for this company, each with a one-line mitigation ask." }
  ],
  financial_commentary: [
    { value: "vs-plan", label: "vs Plan", prompt: "Variance vs plan — revenue, EBITDA, margin — with a cause-and-action sentence for each." },
    { value: "vs-sector", label: "vs Sector peers", prompt: "Position vs sector peer norms (assume typical benchmarks). Where is this company ahead or behind?" },
    { value: "vs-prior-quarter", label: "vs Prior quarter", prompt: "QoQ trend narrative. State direction of travel and inflection signals." },
    { value: "trend-analysis", label: "Trend analysis", prompt: "Multi-quarter trend for revenue, EBITDA, margin. Name the trajectory and the drivers." }
  ],
  value_creation: [
    { value: "revenue-levers", label: "Revenue levers", prompt: "Top revenue-growth levers for this company: pricing, segment, geo, product. Specific." },
    { value: "margin-improvement", label: "Margin improvement", prompt: "Top margin-expansion opportunities: cost, mix, procurement, automation. Specific." },
    { value: "multiple-expansion", label: "Multiple expansion", prompt: "What would justify a higher exit multiple? Strategic positioning, scale, category leadership." },
    { value: "strategic-options", label: "Strategic options", prompt: "Inorganic options: bolt-ons, partnerships, carve-outs, geographic expansion." }
  ],
  next_steps: [
    { value: "deal-team", label: "Deal team actions", prompt: "Deal team checklist for the next 90 days. Numbered." },
    { value: "portfolio-ops", label: "Portfolio ops", prompt: "Operator interventions and portfolio-ops priorities. Numbered." },
    { value: "exit-prep", label: "Exit preparation", prompt: "Exit preparation steps: advisor mapping, narrative, cleanup. Numbered." },
    { value: "financing", label: "Financing / refinancing", prompt: "Financing actions: refinance windows, covenant management, dividend recap potential. Numbered." }
  ]
};
