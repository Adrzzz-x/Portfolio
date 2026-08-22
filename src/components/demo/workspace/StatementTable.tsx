"use client";

import {
  ArrowDown,
  ArrowUp,
  ArrowUpDown,
  Check,
  CheckCircle,
  CircleCheckBig,
  ExternalLink,
  Inbox,
  Info,
  Search,
} from "lucide-react";
import { useDemoStore } from "@/lib/demo/store";
import { getEmptyState, getRowView, getSelectable } from "@/lib/demo/derive";
import { ACTION_CFG } from "@/lib/demo/seed";
import { workspace as copy } from "@/content/demo";
import type { SortColumn, StatementLine } from "@/lib/demo/types";

const EMPTY_ICONS = {
  search: Search,
  "check-circle": CheckCircle,
  "circle-check-big": CircleCheckBig,
  inbox: Inbox,
} as const;

function SortIcon({ active, dir }: { active: boolean; dir: "asc" | "desc" }) {
  const Icon = !active ? ArrowUpDown : dir === "asc" ? ArrowUp : ArrowDown;
  return <Icon size={12} strokeWidth={1.75} style={{ opacity: active ? 1 : 0.4 }} />;
}

export function StatementTable({ list }: { list: StatementLine[] }) {
  const cols = useDemoStore((s) => s.cols);
  const selected = useDemoStore((s) => s.selected);
  const toggleInvoice = useDemoStore((s) => s.toggleInvoice);
  const toggleAll = useDemoStore((s) => s.toggleAll);
  const sortColumn = useDemoStore((s) => s.sortColumn);
  const sortDir = useDemoStore((s) => s.sortDir);
  const handleSort = useDemoStore((s) => s.handleSort);
  const handleAction = useDemoStore((s) => s.handleAction);
  const setShowReconInfo = useDemoStore((s) => s.setShowReconInfo);
  const searchQuery = useDemoStore((s) => s.searchQuery);
  const reconFilter = useDemoStore((s) => s.reconFilter);

  const selectable = getSelectable(list);
  const allSelected = selectable.length > 0 && selectable.every((i) => selected[i.id]);

  const visibleCount =
    2 +
    [cols.ref, cols.po, cols.date, cols.period, cols.due, cols.amount, cols.recon].filter(Boolean)
      .length;

  const empty = getEmptyState(searchQuery, reconFilter);
  const EmptyIcon = EMPTY_ICONS[empty.icon as keyof typeof EMPTY_ICONS] ?? Inbox;

  const sortBtn = (col: SortColumn, label: string, center = false) => (
    <button
      type="button"
      className="ss-th-sort"
      style={center ? { justifyContent: "center" } : undefined}
      onClick={() => handleSort(col)}
    >
      {label}
      <SortIcon active={sortColumn === col} dir={sortDir} />
    </button>
  );

  return (
    <div className="ss-card" id="tour-table" style={{ overflow: "visible" }}>
      <table className="ss-table">
        <thead>
          <tr>
            <th style={{ width: 44, padding: "10px 12px 10px 16px" }}>
              <input
                type="checkbox"
                checked={allSelected}
                onChange={() => toggleAll(list)}
                aria-label="Select all rows"
                style={{ accentColor: "var(--primary)", width: 15, height: 15, cursor: "pointer" }}
              />
            </th>
            <th style={{ minWidth: 210 }}>{sortBtn("supplier", copy.table.supplier)}</th>
            {cols.ref && (
              <th>
                <span style={{ display: "inline-flex", alignItems: "center", gap: 5 }}>
                  {copy.table.reference}
                  <ArrowUpDown size={12} strokeWidth={1.75} style={{ opacity: 0.4 }} />
                </span>
              </th>
            )}
            {cols.po && (
              <th>
                <span style={{ display: "inline-flex", alignItems: "center", gap: 5 }}>
                  {copy.table.poReference}
                  <ArrowUpDown size={12} strokeWidth={1.75} style={{ opacity: 0.4 }} />
                </span>
              </th>
            )}
            {cols.date && (
              <th style={{ textAlign: "center" }}>
                {sortBtn("date", copy.table.transactionDate, true)}
              </th>
            )}
            {cols.period && <th style={{ textAlign: "center" }}>{copy.table.statementPeriod}</th>}
            {cols.due && <th style={{ textAlign: "center" }}>{copy.table.dueDate}</th>}
            {cols.amount && <th style={{ textAlign: "left" }}>{sortBtn("amount", copy.table.amount)}</th>}
            {cols.recon && <th style={{ textAlign: "center" }}>{copy.table.reconciliation}</th>}
            <th style={{ textAlign: "center" }}>
              <div style={{ display: "inline-flex", alignItems: "center", gap: 5 }}>
                {sortBtn("action", copy.table.action, true)}
                <button
                  type="button"
                  onClick={() => setShowReconInfo(true)}
                  style={{
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    color: "var(--muted-foreground)",
                    display: "inline-flex",
                    alignItems: "center",
                    padding: 0,
                  }}
                  title={copy.table.reconInfoTitle}
                >
                  <Info size={13} strokeWidth={1.75} />
                </button>
              </div>
            </th>
          </tr>
        </thead>
        <tbody>
          {list.map((inv) => {
            const v = getRowView(inv);
            const cfg = ACTION_CFG[inv.reconciliationStatus];
            const isSel = !!selected[inv.id];
            return (
              <tr
                key={inv.id}
                className={`ss-tr ${isSel ? "is-selected" : ""}`}
                style={{ cursor: "pointer" }}
                onClick={() => toggleInvoice(inv.id)}
              >
                <td style={{ padding: "14px 12px 14px 16px" }}>
                  <input
                    type="checkbox"
                    checked={isSel}
                    onChange={() => toggleInvoice(inv.id)}
                    onClick={(e) => e.stopPropagation()}
                    aria-label={`Select ${inv.invoiceRef}`}
                    style={{ accentColor: "var(--primary)", width: 15, height: 15, cursor: "pointer" }}
                  />
                </td>
                <td style={{ minWidth: 210 }}>
                  <p
                    style={{
                      font: "var(--text-body)",
                      fontWeight: 600,
                      color: "var(--foreground)",
                      margin: "0 0 2px",
                    }}
                  >
                    {inv.supplierName}
                  </p>
                  <span style={{ font: "var(--text-caption)", color: "var(--muted-foreground)" }}>
                    {inv.type}
                  </span>
                </td>
                {cols.ref && (
                  <td style={{ color: "var(--muted-foreground)", fontFamily: "var(--font-demo-mono)" }}>
                    {inv.invoiceRef}
                  </td>
                )}
                {cols.po && (
                  <td style={{ color: "var(--muted-foreground)", fontFamily: "var(--font-demo-mono)" }}>
                    {inv.poReference}
                  </td>
                )}
                {cols.date && (
                  <td
                    className="ss-date"
                    style={{
                      textAlign: "center",
                      color: "var(--muted-foreground)",
                      fontFamily: "var(--font-demo-sans)",
                    }}
                  >
                    {inv.invoiceDate}
                  </td>
                )}
                {cols.period && (
                  <td
                    style={{
                      textAlign: "center",
                      color: "var(--muted-foreground)",
                      fontFamily: "var(--font-demo-sans)",
                    }}
                  >
                    {inv.statementPeriod}
                  </td>
                )}
                {cols.due && (
                  <td
                    style={{
                      textAlign: "center",
                      color: "var(--muted-foreground)",
                      fontFamily: "var(--font-demo-sans)",
                    }}
                  >
                    {inv.dueDate}
                  </td>
                )}
                {cols.amount && (
                  <td style={{ textAlign: "left" }}>
                    <span
                      className="ss-amount"
                      style={{
                        font: "var(--text-body)",
                        fontWeight: 600,
                        fontFamily: "var(--font-demo-mono)",
                        color: v.amountColor,
                      }}
                    >
                      {v.amountText}
                    </span>
                  </td>
                )}
                {cols.recon && (
                  <td style={{ padding: "14px 0", textAlign: "center" }}>
                    {v.badgeSuccess ? (
                      <span
                        style={{
                          position: "relative",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <span className="ss-badge ss-badge--success">
                          <Check size={10} strokeWidth={2.5} />
                          <span>{v.badgeLabel}</span>
                        </span>
                        <span
                          style={{
                            position: "absolute",
                            right: 0,
                            top: "50%",
                            transform: "translateY(-50%)",
                            display: "inline-flex",
                          }}
                        >
                          <button
                            type="button"
                            className="ss-recon-link"
                            title={copy.table.viewInXero}
                            onClick={(e) => {
                              e.stopPropagation();
                              window.open(inv.xeroInvoiceUrl || "https://go.xero.com", "_blank");
                            }}
                          >
                            <ExternalLink size={13} strokeWidth={1.75} />
                          </button>
                        </span>
                      </span>
                    ) : (
                      <span className="ss-unrec">{copy.table.unreconciled}</span>
                    )}
                  </td>
                )}
                <td
                  style={{ padding: "12px 16px", textAlign: "center", verticalAlign: "middle" }}
                  onClick={(e) => e.stopPropagation()}
                >
                  {cfg.label ? (
                    <button
                      type="button"
                      className={`btn ${cfg.variant} btn-sm`}
                      data-tour-action={v.tourAction}
                      style={{ minWidth: 160 }}
                      onClick={() => handleAction(inv)}
                    >
                      {cfg.label}
                    </button>
                  ) : (
                    <span
                      style={{
                        display: "block",
                        textAlign: "center",
                        color: "var(--border)",
                        fontSize: 18,
                        fontWeight: 300,
                        lineHeight: 1,
                      }}
                    >
                      —
                    </span>
                  )}
                </td>
              </tr>
            );
          })}
          {list.length === 0 && (
            <tr>
              <td colSpan={visibleCount} style={{ padding: "52px 24px", textAlign: "center" }}>
                <div
                  style={{
                    display: "inline-flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: 10,
                    maxWidth: 320,
                  }}
                >
                  <span
                    style={{
                      width: 40,
                      height: 40,
                      borderRadius: "50%",
                      background: "var(--muted)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <EmptyIcon size={18} strokeWidth={1.75} style={{ color: "var(--muted-foreground)" }} />
                  </span>
                  <p
                    style={{
                      font: "var(--text-label)",
                      fontWeight: 600,
                      color: "var(--foreground)",
                      margin: 0,
                    }}
                  >
                    {empty.title}
                  </p>
                  <p
                    style={{
                      font: "var(--text-small)",
                      color: "var(--muted-foreground)",
                      margin: 0,
                      lineHeight: 1.5,
                    }}
                  >
                    {empty.body}
                  </p>
                </div>
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
