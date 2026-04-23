// Illustrative mock comp sets, fund benchmarks, and transaction data for the
// Market Intelligence page. In production these come from PitchBook, Preqin,
// and Capital IQ data feeds.

export const PITCHBOOK_COMPS = {
  Technology: [
    { name: "Ariba Workflow Cloud", stage: "Late", revenue: 210, margin: 28, evEbitda: 18.5, growth: 22, sponsor: "Thoma Bravo" },
    { name: "Cohesion Analytics", stage: "Growth", revenue: 98, margin: 18, evEbitda: 24.1, growth: 38, sponsor: "Insight" },
    { name: "Vertex Platform Co.", stage: "Late", revenue: 330, margin: 31, evEbitda: 16.8, growth: 14, sponsor: "Vista" },
    { name: "NovaStack", stage: "Growth", revenue: 76, margin: 14, evEbitda: 22.5, growth: 45, sponsor: "General Atlantic" },
    { name: "RelayEdge", stage: "Late", revenue: 182, margin: 26, evEbitda: 17.2, growth: 18, sponsor: "Silver Lake" }
  ],
  Healthcare: [
    { name: "CareNode Networks", stage: "Late", revenue: 210, margin: 22, evEbitda: 15.1, growth: 16, sponsor: "Welsh Carson" },
    { name: "Specialty MedCare", stage: "Late", revenue: 140, margin: 25, evEbitda: 16.4, growth: 19, sponsor: "KKR" },
    { name: "Ridgeline Surgical", stage: "Growth", revenue: 95, margin: 24, evEbitda: 17.0, growth: 28, sponsor: "TPG" },
    { name: "PrimaHealth Partners", stage: "Late", revenue: 220, margin: 21, evEbitda: 14.8, growth: 12, sponsor: "Bain Capital" }
  ],
  Industrials: [
    { name: "Unison Freight Group", stage: "Late", revenue: 320, margin: 18, evEbitda: 9.5, growth: 7, sponsor: "Apollo" },
    { name: "Coldline Logistics", stage: "Late", revenue: 185, margin: 21, evEbitda: 10.8, growth: 11, sponsor: "Carlyle" },
    { name: "Keystone Terminals", stage: "Late", revenue: 410, margin: 17, evEbitda: 8.9, growth: 4, sponsor: "Brookfield" },
    { name: "TransitCo Last Mile", stage: "Growth", revenue: 120, margin: 14, evEbitda: 11.2, growth: 15, sponsor: "BlackRock" }
  ],
  "Financial Services": [
    { name: "Meridian SpecFin", stage: "Late", revenue: 95, margin: 38, evEbitda: 11.5, growth: 9, sponsor: "Warburg Pincus" },
    { name: "Harbor Lending Co.", stage: "Late", revenue: 130, margin: 42, evEbitda: 10.9, growth: 8, sponsor: "Centerbridge" },
    { name: "BridgeCredit", stage: "Growth", revenue: 52, margin: 35, evEbitda: 12.2, growth: 18, sponsor: "L Catterton" }
  ],
  Consumer: [
    { name: "Radiance Beauty", stage: "Late", revenue: 215, margin: 18, evEbitda: 13.5, growth: 14, sponsor: "L Catterton" },
    { name: "Hearth Home Brands", stage: "Late", revenue: 160, margin: 15, evEbitda: 12.1, growth: 9, sponsor: "Advent" },
    { name: "Verdant Essentials", stage: "Growth", revenue: 88, margin: 19, evEbitda: 15.4, growth: 24, sponsor: "TSG" }
  ],
  Energy: [
    { name: "Permian Gathering Partners", stage: "Late", revenue: 425, margin: 30, evEbitda: 7.8, growth: 5, sponsor: "EnCap" },
    { name: "Plains Midstream Assets", stage: "Late", revenue: 580, margin: 28, evEbitda: 7.2, growth: 3, sponsor: "ArcLight" },
    { name: "Mesa Gas Infrastructure", stage: "Late", revenue: 340, margin: 31, evEbitda: 8.1, growth: 6, sponsor: "Quantum" }
  ]
};

export const PITCHBOOK_SECTOR_MULTIPLES = {
  Technology: { p25: 14.5, median: 18.0, p75: 23.0 },
  Healthcare: { p25: 13.0, median: 15.8, p75: 18.5 },
  Industrials: { p25: 8.5, median: 10.2, p75: 12.0 },
  "Financial Services": { p25: 9.5, median: 11.5, p75: 13.5 },
  Consumer: { p25: 11.0, median: 13.5, p75: 16.0 },
  Energy: { p25: 6.8, median: 7.9, p75: 9.2 }
};

export const PREQIN_FUND_BENCHMARKS = [
  {
    fund: "Alpha PE Fund II",
    vintage: 2019,
    tvpi: 1.82,
    dpi: 0.54,
    irr: 17.4,
    peerMedianTvpi: 1.68,
    peerP25Tvpi: 1.42,
    peerP75Tvpi: 1.95,
    quartile: 2
  },
  {
    fund: "Alpha PE Fund III",
    vintage: 2021,
    tvpi: 1.31,
    dpi: 0.08,
    irr: 14.2,
    peerMedianTvpi: 1.24,
    peerP25Tvpi: 1.08,
    peerP75Tvpi: 1.45,
    quartile: 2
  }
];

export const PREQIN_VINTAGES = [
  { vintage: 2018, fundTvpi: 2.05, peerMedianTvpi: 1.88 },
  { vintage: 2019, fundTvpi: 1.82, peerMedianTvpi: 1.68 },
  { vintage: 2020, fundTvpi: 1.71, peerMedianTvpi: 1.55 },
  { vintage: 2021, fundTvpi: 1.31, peerMedianTvpi: 1.24 },
  { vintage: 2022, fundTvpi: 1.12, peerMedianTvpi: 1.08 }
];

export const PREQIN_LP_INTELLIGENCE = [
  { lpType: "Pension", commitment: 480, reUpLikelihood: "High", notes: "2 of 3 have signaled re-up interest for Fund IV." },
  { lpType: "Endowment", commitment: 220, reUpLikelihood: "Medium", notes: "Waiting on DPI to accelerate before committing." },
  { lpType: "Family Office", commitment: 160, reUpLikelihood: "High", notes: "Relationship-led; 90%+ re-up rate historically." },
  { lpType: "Sovereign Wealth", commitment: 340, reUpLikelihood: "Medium", notes: "Evaluating against competing Asian mandates." },
  { lpType: "Fund of Funds", commitment: 200, reUpLikelihood: "Low", notes: "Reducing PE allocation; selective re-ups only." }
];

export const CIQ_TRANSACTION_COMPS = [
  { date: "Q1 2025", target: "Luminance Platform", buyer: "Thoma Bravo", sector: "Technology", ev: 2400, evEbitda: 19.5, evRevenue: 4.8, rationale: "Sponsor-to-sponsor" },
  { date: "Q4 2024", target: "Ridgeline Surgical", buyer: "UnitedHealth", sector: "Healthcare", ev: 1850, evEbitda: 17.8, evRevenue: 3.9, rationale: "Strategic" },
  { date: "Q4 2024", target: "Verdant Essentials", buyer: "P&G", sector: "Consumer", ev: 1200, evEbitda: 14.2, evRevenue: 2.8, rationale: "Strategic" },
  { date: "Q3 2024", target: "TransitCo Last Mile", buyer: "Bain Capital", sector: "Industrials", ev: 920, evEbitda: 10.9, evRevenue: 1.6, rationale: "Sponsor-to-sponsor" },
  { date: "Q3 2024", target: "NovaStack", buyer: "Cinven", sector: "Technology", ev: 1650, evEbitda: 22.0, evRevenue: 4.2, rationale: "Sponsor-to-sponsor" },
  { date: "Q2 2024", target: "Plains Midstream Assets", buyer: "Energy Transfer", sector: "Energy", ev: 3800, evEbitda: 7.9, evRevenue: 2.4, rationale: "Strategic" }
];

export const CIQ_PUBLIC_COMPS = [
  { ticker: "CRM", sector: "Technology", marketCap: 282000, evRevenue: 8.4, evEbitda: 34.5, revenueGrowth: 13, margin: 20 },
  { ticker: "ORCL", sector: "Technology", marketCap: 460000, evRevenue: 8.1, evEbitda: 17.2, revenueGrowth: 9, margin: 42 },
  { ticker: "HCA", sector: "Healthcare", marketCap: 96000, evRevenue: 1.7, evEbitda: 9.8, revenueGrowth: 6, margin: 19 },
  { ticker: "FDX", sector: "Industrials", marketCap: 68000, evRevenue: 0.9, evEbitda: 8.4, revenueGrowth: 4, margin: 12 },
  { ticker: "EL", sector: "Consumer", marketCap: 24000, evRevenue: 1.7, evEbitda: 14.6, revenueGrowth: -2, margin: 13 },
  { ticker: "KMI", sector: "Energy", marketCap: 52000, evRevenue: 3.4, evEbitda: 10.2, revenueGrowth: 3, margin: 35 }
];
