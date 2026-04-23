import pptxgen from "pptxgenjs";
import { computeStatus, portfolioMetrics, revenueVariancePct } from "../../utils/metrics.js";
import { fmtMoney, fmtMoneyPlain, fmtPct, fmtPctAbs } from "../../utils/formatters.js";

const BG = "0a0f1e";
const CARD = "181e2a";
const TEXT = "e2e8f0";
const MUTED = "94a3b8";
const GOLD = "f59e0b";
const GREEN = "22c55e";
const RED = "ef4444";
const FOOTER_TEXT = "Confidential — Prepared for internal use only. Not for distribution.";

function baseSlide(pptx, title) {
  const slide = pptx.addSlide();
  slide.background = { color: BG };
  if (title) {
    slide.addText(title, {
      x: 0.4,
      y: 0.25,
      w: 9.2,
      h: 0.5,
      fontSize: 20,
      bold: true,
      color: GOLD,
      fontFace: "Calibri"
    });
    slide.addShape(pptx.ShapeType.line, {
      x: 0.4,
      y: 0.78,
      w: 9.2,
      h: 0,
      line: { color: "1e293b", width: 1 }
    });
  }
  slide.addText(FOOTER_TEXT, {
    x: 0.4,
    y: 7.0,
    w: 9.2,
    h: 0.3,
    fontSize: 8,
    color: MUTED,
    align: "center",
    italic: true
  });
  return slide;
}

export async function buildPPTX({ fund, quarter, companies, sections, aiText = {} }) {
  const pptx = new pptxgen();
  pptx.layout = "LAYOUT_WIDE";
  pptx.defineLayout({ name: "LAYOUT_WIDE", width: 10, height: 7.5 });
  pptx.layout = "LAYOUT_WIDE";

  // Slide 1: Cover
  {
    const slide = pptx.addSlide();
    slide.background = { color: BG };
    slide.addText("PORTFOLIO AI ASSISTANT", {
      x: 0.5,
      y: 2.4,
      w: 9,
      h: 0.4,
      fontSize: 12,
      bold: true,
      color: GOLD
    });
    slide.addText("Quarterly Portfolio Review", {
      x: 0.5,
      y: 2.9,
      w: 9,
      h: 0.9,
      fontSize: 36,
      bold: true,
      color: TEXT
    });
    slide.addText(fund, { x: 0.5, y: 3.9, w: 9, h: 0.5, fontSize: 22, color: MUTED });
    slide.addText(quarter, { x: 0.5, y: 4.4, w: 9, h: 0.4, fontSize: 16, color: MUTED });
    slide.addText(`Generated ${new Date().toLocaleDateString()}`, {
      x: 0.5,
      y: 6.6,
      w: 9,
      h: 0.3,
      fontSize: 10,
      color: MUTED
    });
  }

  // Slide 2: KPI Snapshot
  if (sections.kpi) {
    const slide = baseSlide(pptx, "Portfolio Snapshot");
    const m = portfolioMetrics(companies);
    const cards = [
      { label: "PORTFOLIO REVENUE", value: fmtMoney(m.totalRevenue), sub: `Plan ${fmtMoney(m.totalRevenuePlan)}` },
      { label: "TOTAL EBITDA", value: fmtMoney(m.totalEbitda), sub: `Avg margin ${m.avgMargin.toFixed(1)}%` },
      { label: "COMPANIES", value: String(m.companyCount), sub: `${m.outperformingCount} outperforming` },
      { label: "AT RISK", value: String(m.atRiskCount), sub: m.atRiskCount > 0 ? "Requires attention" : "None flagged", tone: m.atRiskCount > 0 ? RED : TEXT },
      { label: "REVENUE vs PLAN", value: fmtPct(m.revenueVsPlanPct), sub: m.revenueVsPlanPct >= 0 ? "Above plan" : "Below plan", tone: m.revenueVsPlanPct >= 0 ? GREEN : RED }
    ];
    const cardW = 1.75;
    const cardH = 1.4;
    const startX = 0.4;
    const startY = 1.1;
    cards.forEach((c, i) => {
      const x = startX + i * (cardW + 0.1);
      slide.addShape(pptx.ShapeType.roundRect, {
        x,
        y: startY,
        w: cardW,
        h: cardH,
        fill: { color: CARD },
        line: { color: "1e293b", width: 1 },
        rectRadius: 0.05
      });
      slide.addText(c.label, { x: x + 0.08, y: startY + 0.08, w: cardW - 0.1, h: 0.25, fontSize: 8, color: MUTED, bold: true });
      slide.addText(c.value, {
        x: x + 0.08,
        y: startY + 0.4,
        w: cardW - 0.1,
        h: 0.5,
        fontSize: 22,
        bold: true,
        color: c.tone || TEXT,
        fontFace: "Consolas"
      });
      slide.addText(c.sub, { x: x + 0.08, y: startY + 1.0, w: cardW - 0.1, h: 0.3, fontSize: 9, color: MUTED });
    });

    if (aiText.executiveSummary) {
      slide.addText("Executive Summary", {
        x: 0.4,
        y: 2.7,
        w: 9.2,
        h: 0.3,
        fontSize: 12,
        bold: true,
        color: GOLD
      });
      slide.addText(aiText.executiveSummary, {
        x: 0.4,
        y: 3.0,
        w: 9.2,
        h: 2.0,
        fontSize: 12,
        color: TEXT,
        valign: "top"
      });
    }
  }

  // Slide 3: Revenue vs Plan (chart)
  if (sections.chart) {
    const slide = baseSlide(pptx, "Revenue vs Plan");
    const data = [
      {
        name: "Actual",
        labels: companies.map((c) => c.company),
        values: companies.map((c) => c.revenue)
      },
      {
        name: "Plan",
        labels: companies.map((c) => c.company),
        values: companies.map((c) => c.revenuePlan)
      }
    ];
    slide.addChart(pptx.ChartType.bar, data, {
      x: 0.4,
      y: 1.0,
      w: 9.2,
      h: 5.8,
      barDir: "col",
      chartColors: [GOLD, "475569"],
      showLegend: true,
      legendPos: "b",
      legendColor: TEXT,
      catAxisLabelColor: TEXT,
      valAxisLabelColor: TEXT,
      catAxisLabelFontSize: 9,
      valAxisLabelFontSize: 9,
      valGridLine: { color: "1e293b", style: "solid", size: 1 }
    });
  }

  // Slide 4: EBITDA & Margin
  if (sections.chart) {
    const slide = baseSlide(pptx, "EBITDA & Margin");
    const ebitdaData = [
      {
        name: "EBITDA",
        labels: companies.map((c) => c.company),
        values: companies.map((c) => c.ebitda)
      }
    ];
    slide.addChart(pptx.ChartType.bar, ebitdaData, {
      x: 0.4,
      y: 1.0,
      w: 4.5,
      h: 5.8,
      barDir: "col",
      chartColors: [GREEN],
      showLegend: false,
      catAxisLabelColor: TEXT,
      valAxisLabelColor: TEXT,
      catAxisLabelFontSize: 8,
      valAxisLabelFontSize: 9,
      title: "EBITDA ($M)",
      showTitle: true,
      titleColor: TEXT,
      titleFontSize: 11
    });
    const marginData = [
      {
        name: "Margin %",
        labels: companies.map((c) => c.company),
        values: companies.map((c) => c.ebitdaMargin)
      }
    ];
    slide.addChart(pptx.ChartType.line, marginData, {
      x: 5.1,
      y: 1.0,
      w: 4.5,
      h: 5.8,
      chartColors: ["60a5fa"],
      showLegend: false,
      catAxisLabelColor: TEXT,
      valAxisLabelColor: TEXT,
      catAxisLabelFontSize: 8,
      valAxisLabelFontSize: 9,
      title: "EBITDA Margin (%)",
      showTitle: true,
      titleColor: TEXT,
      titleFontSize: 11
    });
  }

  // Slide 5: Company Performance Table
  if (sections.table) {
    const slide = baseSlide(pptx, "Company Performance");
    const headers = [
      { text: "Company", options: { bold: true, color: MUTED, fill: { color: "1e293b" } } },
      { text: "Sector", options: { bold: true, color: MUTED, fill: { color: "1e293b" } } },
      { text: "Revenue", options: { bold: true, color: MUTED, fill: { color: "1e293b" }, align: "right" } },
      { text: "vs Plan", options: { bold: true, color: MUTED, fill: { color: "1e293b" }, align: "right" } },
      { text: "EBITDA", options: { bold: true, color: MUTED, fill: { color: "1e293b" }, align: "right" } },
      { text: "Margin", options: { bold: true, color: MUTED, fill: { color: "1e293b" }, align: "right" } },
      { text: "Status", options: { bold: true, color: MUTED, fill: { color: "1e293b" } } }
    ];
    const rows = [headers].concat(
      companies.map((c, i) => {
        const variance = revenueVariancePct(c);
        const rowFill = i % 2 === 0 ? CARD : BG;
        return [
          { text: c.company, options: { color: TEXT, fill: { color: rowFill } } },
          { text: c.sector, options: { color: MUTED, fill: { color: rowFill } } },
          { text: fmtMoneyPlain(c.revenue), options: { color: TEXT, fill: { color: rowFill }, align: "right" } },
          { text: fmtPct(variance), options: { color: variance >= 0 ? GREEN : RED, fill: { color: rowFill }, align: "right" } },
          { text: fmtMoneyPlain(c.ebitda), options: { color: TEXT, fill: { color: rowFill }, align: "right" } },
          { text: fmtPctAbs(c.ebitdaMargin), options: { color: TEXT, fill: { color: rowFill }, align: "right" } },
          { text: computeStatus(c), options: { color: TEXT, fill: { color: rowFill } } }
        ];
      })
    );
    slide.addTable(rows, {
      x: 0.4,
      y: 1.0,
      w: 9.2,
      fontSize: 10,
      border: { type: "solid", color: "1e293b", pt: 0.5 }
    });
  }

  // Slide 6: AI Insights
  if (sections.insights && aiText.executiveSummary) {
    const slide = baseSlide(pptx, "AI-Generated Commentary");
    const segments = [
      { title: "Executive Summary", body: aiText.executiveSummary },
      { title: "Top Performers", body: aiText.topPerformers },
      { title: "Sector Themes", body: aiText.sectorThemes }
    ].filter((s) => s.body);
    let y = 1.0;
    segments.forEach((s) => {
      slide.addText(s.title, { x: 0.4, y, w: 9.2, h: 0.3, fontSize: 12, bold: true, color: GOLD });
      y += 0.35;
      slide.addText(s.body, { x: 0.4, y, w: 9.2, h: 1.6, fontSize: 11, color: TEXT, valign: "top" });
      y += 1.7;
    });
  }

  // Slide 7: Watch List
  if (sections.watchList && aiText.watchList) {
    const slide = baseSlide(pptx, "Watch List");
    slide.addText(aiText.watchList, {
      x: 0.4,
      y: 1.0,
      w: 9.2,
      h: 5.8,
      fontSize: 13,
      color: TEXT,
      valign: "top"
    });
  }

  // Slide 8: Recommended Actions
  if (sections.insights && aiText.recommendedActions) {
    const slide = baseSlide(pptx, "Recommended Actions");
    slide.addText(aiText.recommendedActions, {
      x: 0.4,
      y: 1.0,
      w: 9.2,
      h: 5.8,
      fontSize: 13,
      color: TEXT,
      valign: "top"
    });
  }

  // Slide 9: Market Intelligence Synthesis
  if (sections.marketIntelligence && aiText.marketSynthesis) {
    const slide = baseSlide(pptx, "Market Intelligence Synthesis");
    slide.addText(aiText.marketSynthesis, {
      x: 0.4,
      y: 1.0,
      w: 9.2,
      h: 5.8,
      fontSize: 12,
      color: TEXT,
      valign: "top"
    });
  }

  const filename = `${fund.replace(/[^\w]+/g, "_")}_${quarter.replace(/\s+/g, "_")}.pptx`;
  await pptx.writeFile({ fileName: filename });
}
