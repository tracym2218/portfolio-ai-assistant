import React, { useMemo, useState } from "react";
import { X, CheckCircle2, AlertTriangle } from "lucide-react";
import { SCHEMA_FIELDS, autoMatch, applyMapping, validateMapping } from "../../hooks/useExcelParser.js";
import { usePortfolio } from "../../context/PortfolioContext.jsx";

export default function ColumnMapper({ rows, headers, onCancel, onConfirm }) {
  const { replaceCompanies } = usePortfolio();
  const [mapping, setMapping] = useState(() => autoMatch(headers));
  const validation = validateMapping(mapping);
  const preview = useMemo(() => rows.slice(0, 3), [rows]);

  const setField = (key, value) => setMapping((m) => ({ ...m, [key]: value || null }));

  const confirm = () => {
    if (!validation.ok) return;
    const parsed = applyMapping(rows, mapping);
    if (!parsed.length) return;
    replaceCompanies(parsed);
    onConfirm();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
      <div className="bg-bg-card border border-border-strong rounded-lg w-full max-w-4xl max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between px-5 py-3 border-b border-border-default">
          <div>
            <h3 className="font-semibold">Map your columns</h3>
            <div className="text-xs text-text-secondary mt-0.5">
              {rows.length} rows · {headers.length} columns detected
            </div>
          </div>
          <button onClick={onCancel} className="text-text-muted hover:text-text-primary">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-auto px-5 py-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-2.5">
            {SCHEMA_FIELDS.map((f) => (
              <div key={f.key} className="flex items-center gap-3">
                <div className="w-40 shrink-0">
                  <div className="text-sm text-text-primary">{f.label}</div>
                  <div className="text-[10px] text-text-muted uppercase tracking-wider">
                    {f.required ? "Required" : "Optional"} · {f.type}
                  </div>
                </div>
                <select
                  value={mapping[f.key] || ""}
                  onChange={(e) => setField(f.key, e.target.value)}
                  className="flex-1 bg-bg-surface border border-border-default rounded px-2 py-1.5 text-sm focus:border-accent-gold outline-none"
                >
                  <option value="">— none —</option>
                  {headers.map((h) => (
                    <option key={h} value={h}>
                      {h}
                    </option>
                  ))}
                </select>
              </div>
            ))}
          </div>

          <div className="mt-5">
            <div className="text-[11px] uppercase tracking-wider text-text-muted mb-2">
              Preview (first 3 rows)
            </div>
            <div className="overflow-x-auto border border-border-default rounded">
              <table className="w-full text-xs mono">
                <thead className="bg-bg-elevated text-text-secondary">
                  <tr>
                    {headers.map((h) => (
                      <th key={h} className="px-2 py-1.5 text-left font-medium whitespace-nowrap">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {preview.map((r, i) => (
                    <tr key={i} className={i % 2 ? "bg-bg-surface" : "bg-bg-base"}>
                      {headers.map((h) => (
                        <td key={h} className="px-2 py-1 whitespace-nowrap text-text-primary">
                          {r[h] == null ? "—" : String(r[h])}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="px-5 py-3 border-t border-border-default flex items-center justify-between">
          {validation.ok ? (
            <div className="flex items-center gap-2 text-sm text-status-out">
              <CheckCircle2 className="w-4 h-4" /> All required fields mapped
            </div>
          ) : (
            <div className="flex items-center gap-2 text-sm text-status-below">
              <AlertTriangle className="w-4 h-4" /> Missing: {validation.missing.join(", ")}
            </div>
          )}
          <div className="flex items-center gap-2">
            <button
              onClick={onCancel}
              className="px-3 py-1.5 text-sm text-text-secondary border border-border-default rounded hover:border-border-strong"
            >
              Cancel
            </button>
            <button
              disabled={!validation.ok}
              onClick={confirm}
              className="px-4 py-1.5 text-sm font-bold bg-accent-gold text-bg-base rounded disabled:opacity-40 disabled:cursor-not-allowed hover:bg-accent-gold-dim"
            >
              Import & Continue
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
