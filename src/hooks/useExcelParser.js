import * as XLSX from "xlsx";

export const SCHEMA_FIELDS = [
  { key: "company", label: "Company Name", required: true, type: "string" },
  { key: "sector", label: "Sector", required: true, type: "string" },
  { key: "revenue", label: "Revenue ($M)", required: true, type: "number" },
  { key: "revenuePlan", label: "Revenue Plan ($M)", required: true, type: "number" },
  { key: "ebitda", label: "EBITDA ($M)", required: true, type: "number" },
  { key: "ebitdaPlan", label: "EBITDA Plan ($M)", required: true, type: "number" },
  { key: "revenueGrowth", label: "Revenue Growth YoY (%)", required: true, type: "number" },
  { key: "ebitdaMargin", label: "EBITDA Margin (%)", required: true, type: "number" },
  { key: "netDebt", label: "Net Debt ($M)", required: true, type: "number" },
  { key: "employees", label: "Employees", required: false, type: "number" },
  { key: "country", label: "Country", required: false, type: "string" },
  { key: "investmentDate", label: "Investment Date", required: false, type: "string" },
  { key: "notes", label: "Notes", required: false, type: "string" }
];

export function parseWorkbook(arrayBuffer) {
  const wb = XLSX.read(arrayBuffer, { type: "array" });
  const firstSheet = wb.SheetNames[0];
  const sheet = wb.Sheets[firstSheet];
  const rows = XLSX.utils.sheet_to_json(sheet, { defval: null });
  const headers = rows.length ? Object.keys(rows[0]) : [];
  return { rows, headers };
}

const NORMALIZE = (s) => String(s || "").toLowerCase().replace(/[^a-z0-9]/g, "");

const AUTO_MATCH = {
  company: ["company", "companyname", "portfoliocompany", "name"],
  sector: ["sector", "industry"],
  revenue: ["revenue", "actualrevenue", "revenueactual", "rev"],
  revenuePlan: ["revenueplan", "planrevenue", "revenuebudget", "budgetrevenue", "revforecast"],
  ebitda: ["ebitda", "actualebitda", "ebitdaactual"],
  ebitdaPlan: ["ebitdaplan", "planebitda", "ebitdabudget", "budgetebitda"],
  revenueGrowth: ["revenuegrowth", "growth", "yoygrowth", "revgrowth"],
  ebitdaMargin: ["ebitdamargin", "margin", "ebitdapct"],
  netDebt: ["netdebt", "debt", "totaldebt"],
  employees: ["employees", "headcount", "fte"],
  country: ["country", "hq", "headquarters"],
  investmentDate: ["investmentdate", "dateinvested", "acquired"],
  notes: ["notes", "comment", "comments"]
};

export function autoMatch(headers) {
  const mapping = {};
  SCHEMA_FIELDS.forEach((f) => (mapping[f.key] = null));
  headers.forEach((h) => {
    const norm = NORMALIZE(h);
    for (const key of Object.keys(AUTO_MATCH)) {
      if (mapping[key]) continue;
      if (AUTO_MATCH[key].some((pat) => norm === pat || norm.includes(pat))) {
        mapping[key] = h;
        break;
      }
    }
  });
  return mapping;
}

export function applyMapping(rows, mapping) {
  return rows
    .map((row) => {
      const out = {};
      SCHEMA_FIELDS.forEach((f) => {
        const src = mapping[f.key];
        const raw = src ? row[src] : null;
        if (f.type === "number") {
          const n = raw == null || raw === "" ? null : Number(String(raw).replace(/[,$%\s]/g, ""));
          out[f.key] = Number.isFinite(n) ? n : null;
        } else {
          out[f.key] = raw == null ? null : String(raw).trim();
        }
      });
      return out;
    })
    .filter((r) => r.company);
}

export function validateMapping(mapping) {
  const missing = SCHEMA_FIELDS.filter((f) => f.required && !mapping[f.key]).map((f) => f.label);
  return { ok: missing.length === 0, missing };
}
