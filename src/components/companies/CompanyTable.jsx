import React, { useMemo, useState } from "react";
import { ArrowUpDown, Search } from "lucide-react";
import { useFilters } from "../../context/FilterContext.jsx";
import { computeStatus, STATUS } from "../../utils/metrics.js";
import CompanyRow from "./CompanyRow.jsx";

const COLUMNS = [
  { key: "company", label: "Company", sortable: true, align: "left" },
  { key: "sector", label: "Sector", sortable: true, align: "left" },
  { key: "revenue", label: "Revenue", sortable: true, align: "right" },
  { key: "revenuePlan", label: "Plan", sortable: true, align: "right" },
  { key: "_variance", label: "vs Plan", sortable: true, align: "right" },
  { key: "ebitda", label: "EBITDA", sortable: true, align: "right" },
  { key: "ebitdaMargin", label: "Margin", sortable: true, align: "right" },
  { key: "revenueGrowth", label: "YoY", sortable: true, align: "right" },
  { key: "netDebt", label: "Net Debt", sortable: true, align: "right" },
  { key: "_status", label: "Status", sortable: false, align: "left" }
];

const STATUS_OPTIONS = [STATUS.OUT, STATUS.TRACK, STATUS.BELOW, STATUS.RISK];

export default function CompanyTable({ onRowClick }) {
  const { filteredCompanies: companies } = useFilters();
  const [sortKey, setSortKey] = useState("revenue");
  const [sortDir, setSortDir] = useState("desc");
  const [search, setSearch] = useState("");
  const [sectorFilter, setSectorFilter] = useState([]);
  const [statusFilter, setStatusFilter] = useState([]);

  const sectors = useMemo(
    () => Array.from(new Set(companies.map((c) => c.sector).filter(Boolean))).sort(),
    [companies]
  );

  const filtered = useMemo(() => {
    let list = companies;
    if (search) {
      const s = search.toLowerCase();
      list = list.filter((c) => c.company.toLowerCase().includes(s));
    }
    if (sectorFilter.length) list = list.filter((c) => sectorFilter.includes(c.sector));
    if (statusFilter.length) list = list.filter((c) => statusFilter.includes(computeStatus(c)));
    return list;
  }, [companies, search, sectorFilter, statusFilter]);

  const sorted = useMemo(() => {
    const arr = [...filtered];
    arr.sort((a, b) => {
      let va, vb;
      if (sortKey === "_variance") {
        va = a.revenuePlan ? (a.revenue - a.revenuePlan) / a.revenuePlan : 0;
        vb = b.revenuePlan ? (b.revenue - b.revenuePlan) / b.revenuePlan : 0;
      } else {
        va = a[sortKey];
        vb = b[sortKey];
      }
      if (typeof va === "string") return sortDir === "asc" ? va.localeCompare(vb) : vb.localeCompare(va);
      return sortDir === "asc" ? (va ?? 0) - (vb ?? 0) : (vb ?? 0) - (va ?? 0);
    });
    return arr;
  }, [filtered, sortKey, sortDir]);

  const toggleSort = (key) => {
    if (sortKey === key) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else {
      setSortKey(key);
      setSortDir("desc");
    }
  };

  const toggleInList = (list, setList, v) => {
    setList(list.includes(v) ? list.filter((x) => x !== v) : [...list, v]);
  };

  return (
    <div>
      <div className="flex flex-wrap items-center gap-2 mb-3">
        <div className="relative">
          <Search className="w-4 h-4 text-text-muted absolute left-2.5 top-1/2 -translate-y-1/2" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search company"
            className="pl-8 pr-3 py-1.5 text-sm bg-bg-surface border border-border-default rounded focus:border-accent-gold outline-none w-52"
          />
        </div>
        <FilterPills label="Sector" values={sectors} selected={sectorFilter} onToggle={(v) => toggleInList(sectorFilter, setSectorFilter, v)} />
        <FilterPills label="Status" values={STATUS_OPTIONS} selected={statusFilter} onToggle={(v) => toggleInList(statusFilter, setStatusFilter, v)} />
        <div className="ml-auto text-xs text-text-muted mono">{sorted.length} companies</div>
      </div>

      <div className="bg-bg-surface border border-border-default rounded-[10px] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-[13px]">
            <thead className="bg-bg-elevated text-text-secondary sticky top-0 z-10">
              <tr>
                {COLUMNS.map((c) => (
                  <th
                    key={c.key}
                    onClick={() => c.sortable && toggleSort(c.key)}
                    className={`px-3 py-2 text-[11px] uppercase tracking-wider font-semibold ${c.align === "right" ? "text-right" : "text-left"} ${c.sortable ? "cursor-pointer hover:text-text-primary" : ""}`}
                  >
                    <span className="inline-flex items-center gap-1">
                      {c.label}
                      {c.sortable && <ArrowUpDown className={`w-3 h-3 ${sortKey === c.key ? "text-accent-gold" : "opacity-40"}`} />}
                    </span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {sorted.map((c, i) => (
                <CompanyRow key={c.company} company={c} zebra={i % 2 === 1} onClick={() => onRowClick?.(c)} />
              ))}
              {sorted.length === 0 && (
                <tr>
                  <td colSpan={COLUMNS.length} className="px-4 py-10 text-center text-text-muted">
                    No companies match the current filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function FilterPills({ label, values, selected, onToggle }) {
  return (
    <div className="flex items-center gap-1.5 flex-wrap">
      <span className="text-[10px] uppercase tracking-wider text-text-muted">{label}</span>
      {values.map((v) => {
        const active = selected.includes(v);
        return (
          <button
            key={v}
            onClick={() => onToggle(v)}
            className={`text-[11px] px-2 py-0.5 rounded border transition ${
              active
                ? "bg-accent-gold text-bg-base border-accent-gold font-semibold"
                : "text-text-secondary border-border-default hover:border-border-strong"
            }`}
          >
            {v}
          </button>
        );
      })}
    </div>
  );
}
