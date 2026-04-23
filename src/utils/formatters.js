export const fmtMoney = (v) => {
  if (v == null || isNaN(v)) return "—";
  const n = Number(v);
  if (Math.abs(n) >= 1000) return `$${(n / 1000).toFixed(1)}B`;
  return `$${n.toFixed(1)}M`;
};

export const fmtMoneyPlain = (v) => {
  if (v == null || isNaN(v)) return "—";
  return `$${Number(v).toFixed(1)}M`;
};

export const fmtPct = (v, digits = 1) => {
  if (v == null || isNaN(v)) return "—";
  const n = Number(v);
  const sign = n > 0 ? "+" : "";
  return `${sign}${n.toFixed(digits)}%`;
};

export const fmtPctAbs = (v, digits = 1) => {
  if (v == null || isNaN(v)) return "—";
  return `${Number(v).toFixed(digits)}%`;
};

export const fmtNum = (v) => {
  if (v == null || isNaN(v)) return "—";
  return Number(v).toLocaleString();
};
