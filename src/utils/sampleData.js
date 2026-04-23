export const FUND_III = "Alpha PE Fund III";
export const FUND_II = "Alpha PE Fund II";

export const SAMPLE_PORTFOLIO = {
  fund: FUND_III,
  quarter: "Q1 2025",
  companies: [
    {
      company: "Apex Systems",
      sector: "Technology",
      fund: FUND_III,
      revenue: 142, revenuePlan: 150,
      ebitda: 38, ebitdaPlan: 42,
      revenueGrowth: 18, ebitdaMargin: 26.8, netDebt: 210,
      employees: 1240, country: "USA", hqCity: "Austin, TX",
      investmentDate: "2021-03-15",
      website: "apexsystems.io",
      description: "B2B enterprise software platform for mid-market financial services and insurance clients. Workflow automation suite with embedded analytics.",
      leadership: [
        { name: "David Mercer", title: "CEO", background: "Former VP at Oracle; 12 years enterprise software. MBA Wharton.", tenure: "3 years" },
        { name: "Sarah Lin", title: "CFO", background: "Ex-Deloitte transaction services; 8 years PE-backed CFO experience.", tenure: "2 years" },
        { name: "James Okafor", title: "CTO", background: "Built core platform from ground up; previously at Palantir.", tenure: "5 years" }
      ],
      boardMembers: [
        { name: "Richard Cole", role: "Alpha PE — Sponsor Rep", background: "Senior Partner, Alpha PE. Former McKinsey TMT practice." },
        { name: "Patricia Burns", role: "Independent Director", background: "Former CRO at ServiceNow. Audit committee chair." },
        { name: "Tom Yates", role: "Independent Director", background: "CFO emeritus, Verint Systems. Compensation committee chair." }
      ],
      esg: {
        environmentScore: 62, environmentRating: "BBB",
        socialScore: 74, socialRating: "A",
        governanceScore: 81, governanceRating: "AA",
        overallRating: "A",
        carbonIntensity: "Low — cloud-native, minimal physical footprint.",
        boardIndependence: "67%",
        diversityNote: "2 of 3 independent directors are women or underrepresented minorities.",
        flags: []
      },
      news: [
        { date: "Mar 2025", headline: "Apex Systems wins $12M enterprise contract with Lockheed Martin", source: "Business Wire", sentiment: "positive" },
        { date: "Feb 2025", headline: "CTO James Okafor named to Forbes 50 enterprise tech innovators", source: "Forbes", sentiment: "positive" },
        { date: "Jan 2025", headline: "Q4 revenue misses estimates amid enterprise deal slippage", source: "PE Hub", sentiment: "negative" }
      ],
      notes: "Q1 revenue soft; enterprise deals slipping to Q2. Pipeline remains strong."
    },
    {
      company: "Meridian Health",
      sector: "Healthcare",
      fund: FUND_III,
      revenue: 89, revenuePlan: 85,
      ebitda: 22, ebitdaPlan: 20,
      revenueGrowth: 31, ebitdaMargin: 24.7, netDebt: 95,
      employees: 340, country: "USA", hqCity: "Boston, MA",
      investmentDate: "2022-03-02",
      website: "meridianhealth.com",
      description: "Specialty healthcare services — outpatient surgical and diagnostic centers across 14 states. Growth via de novo and bolt-on acquisitions.",
      leadership: [
        { name: "Dr. Elena Ruiz", title: "CEO", background: "Former SVP Operations at HCA Healthcare; physician executive with 15 years of multi-site P&L experience.", tenure: "2 years" },
        { name: "Mark Stenson", title: "CFO", background: "Ex-Brookdale Senior Living; 10 years healthcare finance, specialty in reimbursement modeling.", tenure: "2 years" },
        { name: "Dr. Raj Patel", title: "COO", background: "Board-certified anesthesiologist; led ops integration at USPI.", tenure: "1 year" }
      ],
      boardMembers: [
        { name: "Chen Wu", role: "Alpha PE — Sponsor Rep", background: "Partner, Alpha PE Healthcare vertical. Former Blackstone." },
        { name: "Dr. Linda Chen", role: "Independent Director", background: "Former Chief of Surgery, Mayo Clinic. Clinical quality committee chair." },
        { name: "John Reilly", role: "Independent Director", background: "20-year healthcare PE operator; former CEO USPI. Audit chair." }
      ],
      esg: {
        environmentScore: 58, environmentRating: "BB",
        socialScore: 82, socialRating: "AA",
        governanceScore: 76, governanceRating: "A",
        overallRating: "A",
        carbonIntensity: "Moderate — medical waste and energy-intensive clinical settings.",
        boardIndependence: "67%",
        diversityNote: "CEO and 1 of 3 independent directors are women; clinical advisory board 50% women.",
        flags: ["Pending CMS audit at 2 centers — expected no material finding."]
      },
      news: [
        { date: "Mar 2025", headline: "Meridian opens 3 new outpatient surgery centers in Florida and Texas", source: "Modern Healthcare", sentiment: "positive" },
        { date: "Feb 2025", headline: "CMS announces favorable reimbursement update for ambulatory surgery", source: "Becker's ASC Review", sentiment: "positive" },
        { date: "Dec 2024", headline: "Meridian hits 31% YoY revenue growth, ahead of plan", source: "PE Insights", sentiment: "positive" }
      ],
      notes: "Star performer. De novo ramp on track. Consider accelerating bolt-on pipeline."
    },
    {
      company: "Crestview Logistics",
      sector: "Industrials",
      fund: FUND_II,
      revenue: 203, revenuePlan: 200,
      ebitda: 41, ebitdaPlan: 44,
      revenueGrowth: 8, ebitdaMargin: 20.2, netDebt: 380,
      employees: 1450, country: "UK", hqCity: "Memphis, TN",
      investmentDate: "2020-09-10",
      website: "crestviewlogistics.com",
      description: "Regional freight and last-mile logistics across 18 states; specialized cold-chain capability for food and pharma clients.",
      leadership: [
        { name: "Pete Harland", title: "CEO", background: "25-year UPS veteran, last role SVP Operations East. Operational turnaround specialist.", tenure: "4 years" },
        { name: "Karen Ishi", title: "CFO", background: "Ex-C.H. Robinson controller; Big Four audit background.", tenure: "3 years" },
        { name: "Mike Torres", title: "COO", background: "Former Amazon Logistics regional director; scaled last-mile from 200 to 1,200 routes.", tenure: "2 years" }
      ],
      boardMembers: [
        { name: "William Drake", role: "Alpha PE — Sponsor Rep", background: "Managing Director, Alpha PE Industrials. Former Bain Capital." },
        { name: "Linda Morrison", role: "Independent Director", background: "Former President, FedEx Ground. Operating committee chair." },
        { name: "Robert Singh", role: "Independent Director", background: "Supply chain advisor, ex-McKinsey partner. Risk committee chair." }
      ],
      esg: {
        environmentScore: 45, environmentRating: "B",
        socialScore: 68, socialRating: "BBB",
        governanceScore: 72, governanceRating: "A",
        overallRating: "BBB",
        carbonIntensity: "High — diesel-heavy fleet. Electrification pilot underway.",
        boardIndependence: "67%",
        diversityNote: "1 of 3 independent directors is a woman. Driver workforce 88% male.",
        flags: ["Scope 1 emissions up 6% YoY — offset by efficiency gains but absolute rising."]
      },
      news: [
        { date: "Mar 2025", headline: "Crestview signs 5-year cold-chain contract with Albertsons", source: "Transport Topics", sentiment: "positive" },
        { date: "Feb 2025", headline: "Diesel costs moderate, supporting margin recovery in Q2 outlook", source: "FreightWaves", sentiment: "neutral" },
        { date: "Jan 2025", headline: "EBITDA margin slips 100bps on higher labor costs", source: "PE Hub", sentiment: "negative" }
      ],
      notes: "Revenue on plan, margin pressure from labor and fuel. Fund II — approaching exit window."
    },
    {
      company: "Blueridge Capital",
      sector: "Financial Services",
      fund: FUND_III,
      revenue: 67, revenuePlan: 70,
      ebitda: 28, ebitdaPlan: 30,
      revenueGrowth: 12, ebitdaMargin: 41.8, netDebt: 45,
      employees: 180, country: "USA", hqCity: "Charlotte, NC",
      investmentDate: "2021-11-20",
      website: "blueridgecap.com",
      description: "Specialty finance — equipment leasing and asset-backed lending to small and mid-market businesses across the Southeast.",
      leadership: [
        { name: "Angela Patterson", title: "CEO", background: "Former SVP at GE Capital equipment finance. 18 years in commercial lending.", tenure: "3 years" },
        { name: "Doug Nesmith", title: "CFO", background: "Ex-Ally Financial; specialty in ABS securitization and funding strategy.", tenure: "3 years" },
        { name: "Priya Kulkarni", title: "CRO", background: "20 years in credit risk; previously Chief Credit Officer at CIT Group.", tenure: "2 years" }
      ],
      boardMembers: [
        { name: "James Wade", role: "Alpha PE — Sponsor Rep", background: "Partner, Alpha PE FIG. Former Goldman Sachs specialty finance." },
        { name: "Leonard Bishop", role: "Independent Director", background: "Former Head of US Commercial Banking, Citigroup. Risk committee chair." },
        { name: "Maria Fernandes", role: "Independent Director", background: "Retired PwC risk partner; sits on two other PE-backed lender boards." }
      ],
      esg: {
        environmentScore: 70, environmentRating: "A",
        socialScore: 65, socialRating: "BBB",
        governanceScore: 85, governanceRating: "AA",
        overallRating: "A",
        carbonIntensity: "Low — financial services, offices only.",
        boardIndependence: "67%",
        diversityNote: "CEO, CRO, and 1 of 3 independent directors are women or underrepresented minorities.",
        flags: []
      },
      news: [
        { date: "Mar 2025", headline: "Blueridge closes $200M warehouse facility with Wells Fargo", source: "Asset-Backed Alert", sentiment: "positive" },
        { date: "Feb 2025", headline: "SEC finalizes Reg ABS II update — limited impact on Blueridge", source: "ABA Banking Journal", sentiment: "neutral" },
        { date: "Dec 2024", headline: "Net interest margin expands 40bps on repricing", source: "S&P Global", sentiment: "positive" }
      ],
      notes: "Small relative revenue but strong margins. Watch origination volume vs plan."
    },
    {
      company: "Onyx Consumer Brands",
      sector: "Consumer",
      fund: FUND_III,
      revenue: 118, revenuePlan: 110,
      ebitda: 19, ebitdaPlan: 18,
      revenueGrowth: 22, ebitdaMargin: 16.1, netDebt: 175,
      employees: 720, country: "Germany", hqCity: "Munich, Germany",
      investmentDate: "2022-07-01",
      website: "onyxbrands.com",
      description: "Premium European personal care and household brands. Direct-to-consumer plus retail distribution across EU and expanding North American presence.",
      leadership: [
        { name: "Sophia Becker", title: "CEO", background: "Former GM Personal Care, Henkel. 20 years brand-building in premium CPG.", tenure: "3 years" },
        { name: "Klaus Meyer", title: "CFO", background: "Ex-Beiersdorf; specialist in European multi-channel finance transformation.", tenure: "2 years" },
        { name: "Isabella Russo", title: "CMO", background: "Former VP Digital at L'Oréal. Pioneered DTC strategy for legacy brand portfolio.", tenure: "1.5 years" }
      ],
      boardMembers: [
        { name: "Heinrich Schmidt", role: "Alpha PE — Sponsor Rep", background: "Partner, Alpha PE Europe. Based Frankfurt. Former BCG consumer practice." },
        { name: "Carla Vidal", role: "Independent Director", background: "Former President Beauty, Unilever Europe. Brand strategy committee chair." },
        { name: "Phil Thornton", role: "Independent Director", background: "CPG M&A advisor; led 14 personal-care acquisitions at Procter & Gamble." }
      ],
      esg: {
        environmentScore: 72, environmentRating: "A",
        socialScore: 78, socialRating: "A",
        governanceScore: 74, governanceRating: "A",
        overallRating: "A",
        carbonIntensity: "Moderate-Low — packaging is primary focus; 60% recycled content target by 2026.",
        boardIndependence: "67%",
        diversityNote: "CEO, CMO, and 1 of 3 independent directors are women.",
        flags: []
      },
      news: [
        { date: "Mar 2025", headline: "Onyx North American DTC revenue up 45% YoY in Q1", source: "Glossy", sentiment: "positive" },
        { date: "Feb 2025", headline: "Private label pressure in DACH region drags category margins", source: "Beauty Insider", sentiment: "negative" },
        { date: "Jan 2025", headline: "Onyx completes Sephora US launch for premium skincare line", source: "WWD", sentiment: "positive" }
      ],
      notes: "Revenue 7% ahead of plan. NA expansion on track; monitor European private-label."
    },
    {
      company: "Summit Energy",
      sector: "Energy",
      fund: FUND_II,
      revenue: 311, revenuePlan: 295,
      ebitda: 87, ebitdaPlan: 80,
      revenueGrowth: 6, ebitdaMargin: 28.0, netDebt: 620,
      employees: 2100, country: "USA", hqCity: "Houston, TX",
      investmentDate: "2019-05-18",
      website: "summitenergy.com",
      description: "Mid-stream natural gas infrastructure and gathering systems serving producers across the Permian Basin.",
      leadership: [
        { name: "Tom Ramirez", title: "CEO", background: "20-year Kinder Morgan veteran, most recently VP Operations Permian. Deep mid-stream expertise.", tenure: "5 years" },
        { name: "Janet Wells", title: "CFO", background: "Former Treasurer at EnLink Midstream. Capital markets and project finance specialist.", tenure: "4 years" },
        { name: "Bill Forsythe", title: "COO", background: "Engineering-first operator; previously SVP at Targa Resources.", tenure: "4 years" }
      ],
      boardMembers: [
        { name: "Charles Whitaker", role: "Alpha PE — Sponsor Rep (Fund II)", background: "Managing Director, Alpha PE Energy. 25 years in oil & gas investing." },
        { name: "Dr. Susan McKee", role: "Independent Director", background: "Energy transition advisor; former Chief Sustainability Officer at a major IOC." },
        { name: "Robert Dunn", role: "Independent Director", background: "Retired EVP Operations, EOG Resources. Audit committee chair." }
      ],
      esg: {
        environmentScore: 41, environmentRating: "B",
        socialScore: 62, socialRating: "BBB",
        governanceScore: 69, governanceRating: "BBB",
        overallRating: "BB",
        carbonIntensity: "High — Scope 1 methane exposure; comprehensive LDAR program in place.",
        boardIndependence: "67%",
        diversityNote: "1 of 3 independent directors is a woman with energy-transition focus.",
        flags: ["Ongoing TCEQ consent decree — compliance on track, $4M remaining spend."]
      },
      news: [
        { date: "Mar 2025", headline: "Summit receives FERC approval for 30-mile gathering line expansion", source: "S&P Global Platts", sentiment: "positive" },
        { date: "Feb 2025", headline: "Permian basin production forecasts revised higher for 2025", source: "EIA", sentiment: "positive" },
        { date: "Jan 2025", headline: "Summit launches $20M methane emissions reduction program", source: "Reuters", sentiment: "positive" }
      ],
      notes: "Fund II — exit window 18-24 months. EBITDA well ahead of plan. Preparing exit materials."
    },
    {
      company: "Harlow Software",
      sector: "Technology",
      fund: FUND_III,
      revenue: 54, revenuePlan: 65,
      ebitda: 8, ebitdaPlan: 14,
      revenueGrowth: -4, ebitdaMargin: 14.8, netDebt: 88,
      employees: 210, country: "Canada", hqCity: "Toronto, Canada",
      investmentDate: "2022-12-05",
      website: "harlow.app",
      description: "SMB marketing automation SaaS. Originally product-led; mid-transition to mid-market enterprise motion with mixed early traction.",
      leadership: [
        { name: "Mark Chen", title: "CEO", background: "Founder; 6 years in role. Deep product and engineering roots.", tenure: "6 years" },
        { name: "Jennifer Walsh", title: "CFO", background: "Joined 6 months ago from HubSpot finance leadership. Hired to drive discipline and board reporting.", tenure: "0.5 years" },
        { name: "Alex Vance", title: "CTO", background: "Original engineering hire. Now leading platform re-architecture.", tenure: "5 years" }
      ],
      boardMembers: [
        { name: "Rebecca Koo", role: "Alpha PE — Sponsor Rep", background: "Principal, Alpha PE Technology. Former Vista Equity." },
        { name: "Dan Mulligan", role: "Independent Director", background: "Former SVP Sales at HubSpot. Go-to-market committee chair." },
        { name: "Paul Richter", role: "Independent Director", background: "4x SaaS operator and CEO; scaled two companies from $50M to $500M ARR." }
      ],
      esg: {
        environmentScore: 64, environmentRating: "BBB",
        socialScore: 69, socialRating: "BBB",
        governanceScore: 71, governanceRating: "A",
        overallRating: "BBB",
        carbonIntensity: "Low — cloud-native operations.",
        boardIndependence: "67%",
        diversityNote: "CFO and 0 of 3 independent directors are women or underrepresented minorities.",
        flags: ["Founder-CEO concentration risk — board evaluating succession planning."]
      },
      news: [
        { date: "Mar 2025", headline: "Harlow announces enterprise product pivot; new CFO signals turnaround focus", source: "SaaStr", sentiment: "neutral" },
        { date: "Feb 2025", headline: "Q4 net retention drops to 94%, highest churn quarter since 2022", source: "Tech Crunch", sentiment: "negative" },
        { date: "Jan 2025", headline: "Harlow cuts 12% of workforce, primarily in marketing and support", source: "The Information", sentiment: "negative" }
      ],
      notes: "AT RISK. Revenue 17% below plan, EBITDA 43% below. New CFO onboarding. Watch Q2 bookings."
    }
  ]
};
