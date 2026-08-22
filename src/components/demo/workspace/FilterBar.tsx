"use client";

import { Search, SlidersHorizontal } from "lucide-react";
import { useDemoStore } from "@/lib/demo/store";
import { COLUMN_OPTIONS, MONTH_OPTIONS } from "@/lib/demo/seed";
import { workspace as copy } from "@/content/demo";
import type { ColumnKey, ReconFilter, TypeFilter } from "@/lib/demo/types";

export function FilterBar() {
  const searchQuery = useDemoStore((s) => s.searchQuery);
  const setSearch = useDemoStore((s) => s.setSearch);
  const statementMonth = useDemoStore((s) => s.statementMonth);
  const setMonth = useDemoStore((s) => s.setMonth);
  const reconFilter = useDemoStore((s) => s.reconFilter);
  const setReconFilter = useDemoStore((s) => s.setReconFilter);
  const typeFilter = useDemoStore((s) => s.typeFilter);
  const setTypeFilter = useDemoStore((s) => s.setTypeFilter);
  const showColumns = useDemoStore((s) => s.showColumns);
  const toggleColumnsPopover = useDemoStore((s) => s.toggleColumnsPopover);
  const cols = useDemoStore((s) => s.cols);
  const toggleColumn = useDemoStore((s) => s.toggleColumn);

  return (
    <div className="ss-card" style={{ padding: "14px 18px" }}>
      <div
        style={{
          display: "flex",
          gap: 10,
          marginBottom: 12,
          alignItems: "center",
          flexWrap: "wrap",
        }}
      >
        <div className="ss-searchwrap" style={{ position: "relative", width: 500, flexShrink: 0 }}>
          <span
            style={{
              position: "absolute",
              left: 12,
              top: "50%",
              transform: "translateY(-50%)",
              color: "var(--muted-foreground)",
              pointerEvents: "none",
              display: "flex",
            }}
          >
            <Search size={15} strokeWidth={1.75} />
          </span>
          <input
            className="ss-search"
            value={searchQuery}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={copy.filters.searchPlaceholder}
            aria-label={copy.filters.searchPlaceholder}
          />
        </div>
        <select
          className="ss-select"
          style={{ width: 160, flexShrink: 0 }}
          value={statementMonth}
          onChange={(e) => setMonth(e.target.value)}
          aria-label="Statement month"
        >
          {MONTH_OPTIONS.map((m) => (
            <option key={m.value} value={m.value}>
              {m.label}
            </option>
          ))}
        </select>
      </div>

      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 2 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
          {copy.filters.recon.map((c) => (
            <button
              key={c.id}
              type="button"
              className={`ss-chip ${reconFilter === c.id ? "is-active" : ""}`}
              onClick={() => setReconFilter(c.id as ReconFilter)}
            >
              {c.label}
            </button>
          ))}
          <span className="ss-filter-sep" />
          {copy.filters.type.map((c) => (
            <button
              key={c.id}
              type="button"
              className={`ss-chip ${typeFilter === c.id ? "is-active" : ""}`}
              onClick={() => setTypeFilter(c.id as TypeFilter)}
            >
              {c.label}
            </button>
          ))}
        </div>
        <div style={{ position: "relative" }}>
          <button
            type="button"
            onClick={toggleColumnsPopover}
            className="btn btn-ghost btn-sm"
            style={{ gap: 6 }}
            aria-expanded={showColumns}
          >
            <SlidersHorizontal size={14} strokeWidth={1.75} /> {copy.filters.columnsLabel}
          </button>
          {showColumns && (
            <div className="ss-popover" style={{ right: 0, minWidth: 200 }}>
              <p
                style={{
                  font: "var(--text-overline)",
                  textTransform: "uppercase",
                  letterSpacing: "0.06em",
                  color: "var(--muted-foreground)",
                  marginBottom: 8,
                }}
              >
                {copy.filters.columnsHeading}
              </p>
              {COLUMN_OPTIONS.map((col) => (
                <label key={col.id} className="ss-popover-row">
                  <input
                    type="checkbox"
                    checked={cols[col.id as ColumnKey]}
                    onChange={() => toggleColumn(col.id as ColumnKey)}
                    style={{ accentColor: "var(--primary)", cursor: "pointer" }}
                  />
                  <span style={{ font: "var(--text-small)", color: "var(--foreground)" }}>
                    {col.label}
                  </span>
                </label>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
