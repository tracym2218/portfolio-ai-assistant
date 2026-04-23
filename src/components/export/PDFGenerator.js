import jsPDF from "jspdf";
import { computeStatus, STATUS_COLOR, portfolioMetrics, revenueVariancePct } from "../../utils/metrics.js";
import { fmtMoney, fmtMoneyPlain, fmtPct, fmtPctAbs } from "../../utils/formatters.js";

const COLORS = {
  bg: [10, 15, 30],
  card: [24, 30, 42],
  border: [30, 41, 59],
  text: [226, 232, 240],
  muted: [148, 163, 184],
  gold: [245, 158, 11],
  red: [239, 68, 68],
  green: [34, 197, 94]
};

const PAGE_W = 210;
const PAGE_H = 297;
const MARGIN = 14;
const FOOTER_TEXT = "Confidential — Prepared for internal use only. Not for distribution.";

function paintBg(doc) {
  doc.setFillColor(...COLORS.bg);
  doc.rect(0, 0, PAGE_W, PAGE_H, "F");
}

function addFooter(doc, pageNum, totalPages) {
  doc.setFontSize(8);
  doc.setTextColor(...COLORS.muted);
  doc.text(FOOTER_TEXT, PAGE_W / 2, PAGE_H - 7, { align: "center" });
  doc.text(`${pageNum} / ${totalPages}`, PAGE_W - MARGIN, PAGE_H - 7, { align: "right" });
}

function newPage(doc) {
  doc.addPage();
  paintBg(doc);
}

function sectionTitle(doc, title, y) {
  doc.setFontSize(14);
  doc.setTextColor(...COLORS.gold);
  doc.setFont("helvetica", "bold");
  doc.text(title, MARGIN, y);
  doc.setDrawColor(...COLORS.border);
  doc.line(MARGIN, y + 2, PAGE_W - MARGIN, y + 2);
  return y + 10;
}

export async function buildPDF({ fund, quarter, companies, sections, aiText = {} }) {
  const doc = new jsPDF({ unit: "mm", format: "a4" });
  paintBg(doc);

  // Cover
  doc.setTextColor(...COLORS.gold);
  doc.setFontSize(10);
  doc.setFont("helvetica", "bold");
  doc.text("PORTFOLIO AI ASSISTANT", MARGIN, 40);
  doc.setTextColor(...COLORS.text);
  doc.setFontSize(26);
  doc.text("Quarterly Portfolio Review", MARGIN, 60);
  doc.setFontSize(18);
  doc.setTextColor(...COLORS.muted);
  doc.setFont("helvetica", "normal");
  doc.text(fund, MARGIN, 72);
  doc.setFontSize(14);
  doc.text(quarter, MARGIN, 80);
  doc.setFontSize(10);
  doc.text(`Generated ${new Date().toLocaleDateString()}`, MARGIN, 90);

  let y = 110;

  if (sections.kpi) {
    newPage(doc);
    y = sectionTitle(doc, "Portfolio Snapshot", 22);
    const m = portfolioMetrics(companies);
    const cards = [
      ["Revenue", fmtMoney(m.totalRevenue), `Plan ${fmtMoney(m.totalRevenuePlan)}`],
      ["EBITDA", fmtMoney(m.totalEbitda), `Avg margin ${m.avgMargin.toFixed(1)}%`],
      ["Companies", String(m.companyCount), `${m.outperformingCount} outperforming`],
      ["At Risk", String(m.atRiskCount), m.atRiskCount > 0 ? "Requires attention" : "None flagged"],
      ["Rev vs Plan", fmtPct(m.revenueVsPlanPct), m.revenueVsPlanPct >= 0 ? "Above plan" : "Below plan"]
    ];
    const cardW = (PAGE_W - MARGIN * 2 - 8) / 2;
    const cardH = 24;
    cards.forEach((c, i) => {
      const col = i % 2;
      const row = Math.floor(i / 2);
      const x = MARGIN + col * (cardW + 8);
      const yy = y + row * (cardH + 6);
      doc.setFillColor(...COLORS.card);
      doc.setDrawColor(...COLORS.border);
      doc.roundedRect(x, yy, cardW, cardH, 2, 2, "FD");
      doc.setFontSize(8);
      doc.setTextColor(...COLORS.muted);
      doc.text(c[0].toUpperCase(), x + 4, yy + 6);
      doc.setFontSize(16);
      doc.setTextColor(...COLORS.text);
      doc.setFont("helvetica", "bold");
      doc.text(c[1], x + 4, yy + 15);
      doc.setFontSize(8);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(...COLORS.muted);
      doc.text(c[2], x + 4, yy + 21);
    });
    y += Math.ceil(cards.length / 2) * (cardH + 6) + 4;
  }

  if (sections.chart) {
    const chartEl = document.querySelector("[data-pdf-chart='revenue']");
    if (chartEl) {
      try {
        const html2canvas = (await import("html2canvas")).default;
        const canvas = await html2canvas(chartEl, { backgroundColor: "#0f1420", scale: 2 });
        const img = canvas.toDataURL("image/png");
        newPage(doc);
        y = sectionTitle(doc, "Revenue vs Plan", 22);
        const imgH = ((PAGE_W - MARGIN * 2) * canvas.height) / canvas.width;
        doc.addImage(img, "PNG", MARGIN, y, PAGE_W - MARGIN * 2, imgH);
      } catch {
        /* ignore chart capture failures */
      }
    }
  }

  if (sections.table) {
    newPage(doc);
    y = sectionTitle(doc, "Company Performance", 22);
    const headers = ["Company", "Sector", "Revenue", "vs Plan", "EBITDA", "Margin", "Status"];
    const colX = [MARGIN, 60, 90, 115, 135, 158, 178];
    doc.setFontSize(8);
    doc.setTextColor(...COLORS.muted);
    doc.setFont("helvetica", "bold");
    headers.forEach((h, i) => doc.text(h.toUpperCase(), colX[i], y));
    y += 4;
    doc.setDrawColor(...COLORS.border);
    doc.line(MARGIN, y, PAGE_W - MARGIN, y);
    y += 3;
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    companies.forEach((c, i) => {
      if (y > PAGE_H - 20) {
        newPage(doc);
        y = 22;
      }
      if (i % 2 === 0) {
        doc.setFillColor(...COLORS.card);
        doc.rect(MARGIN - 1, y - 4, PAGE_W - MARGIN * 2 + 2, 6, "F");
      }
      const status = computeStatus(c);
      const variance = revenueVariancePct(c);
      doc.setTextColor(...COLORS.text);
      doc.text(String(c.company).slice(0, 26), colX[0], y);
      doc.setTextColor(...COLORS.muted);
      doc.text(String(c.sector).slice(0, 14), colX[1], y);
      doc.setTextColor(...COLORS.text);
      doc.text(fmtMoneyPlain(c.revenue), colX[2], y);
      doc.setTextColor(...(variance >= 0 ? COLORS.green : COLORS.red));
      doc.text(fmtPct(variance), colX[3], y);
      doc.setTextColor(...COLORS.text);
      doc.text(fmtMoneyPlain(c.ebitda), colX[4], y);
      doc.text(fmtPctAbs(c.ebitdaMargin), colX[5], y);
      const statusColor = hexToRGB(STATUS_COLOR[status]);
      doc.setTextColor(...statusColor);
      doc.text(status, colX[6], y);
      y += 6;
    });
  }

  if (sections.insights && aiText.executiveSummary) {
    newPage(doc);
    y = sectionTitle(doc, "AI Insights", 22);
    y = writeSection(doc, "Executive Summary", aiText.executiveSummary, y);
    y = writeSection(doc, "Top Performers", aiText.topPerformers, y);
    y = writeSection(doc, "Sector Themes", aiText.sectorThemes, y);
    y = writeSection(doc, "Recommended Actions", aiText.recommendedActions, y);
  }

  if (sections.watchList && aiText.watchList) {
    newPage(doc);
    y = sectionTitle(doc, "Watch List", 22);
    y = writeBody(doc, aiText.watchList, y);
  }

  if (sections.lpTalkingPoints && aiText.lpTalkingPoints) {
    newPage(doc);
    y = sectionTitle(doc, "LP Talking Points", 22);
    y = writeBody(doc, aiText.lpTalkingPoints, y);
  }

  if (sections.marketIntelligence && aiText.marketSynthesis) {
    newPage(doc);
    y = sectionTitle(doc, "Market Intelligence Synthesis", 22);
    y = writeBody(doc, aiText.marketSynthesis, y);
  }

  const total = doc.getNumberOfPages();
  for (let i = 1; i <= total; i++) {
    doc.setPage(i);
    addFooter(doc, i, total);
  }

  const filename = `${fund.replace(/[^\w]+/g, "_")}_${quarter.replace(/\s+/g, "_")}.pdf`;
  doc.save(filename);
}

function writeSection(doc, title, body, y) {
  if (!body) return y;
  if (y > PAGE_H - 40) {
    newPage(doc);
    y = 22;
  }
  doc.setFontSize(11);
  doc.setTextColor(...COLORS.gold);
  doc.setFont("helvetica", "bold");
  doc.text(title, MARGIN, y);
  y += 5;
  return writeBody(doc, body, y);
}

function writeBody(doc, body, y) {
  doc.setFontSize(9.5);
  doc.setTextColor(...COLORS.text);
  doc.setFont("helvetica", "normal");
  const lines = doc.splitTextToSize(body, PAGE_W - MARGIN * 2);
  lines.forEach((line) => {
    if (y > PAGE_H - 18) {
      newPage(doc);
      y = 22;
    }
    doc.text(line, MARGIN, y);
    y += 5;
  });
  return y + 3;
}

function hexToRGB(hex) {
  const h = hex.replace("#", "");
  return [parseInt(h.slice(0, 2), 16), parseInt(h.slice(2, 4), 16), parseInt(h.slice(4, 6), 16)];
}
