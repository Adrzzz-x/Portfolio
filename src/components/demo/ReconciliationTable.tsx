"use client";

import { formatCurrency, formatDate, STATUS_COPY } from "@/lib/demo/format";
import type { StatementLine } from "@/lib/demo/types";

export function ReconciliationTable({
  invoices,
  selectedIds,
  onToggleSelect,
  onToggleSelectAll,
  onRowAction,
}: {
  invoices: StatementLine[];
  selectedIds: string[];
  onToggleSelect: (id: string) => void;
  onToggleSelectAll: () => void;
  onRowAction: (invoice: StatementLine) => void;
}) {
  const selectableIds = invoices
    .filter((inv) => inv.reconciliationStatus === "pending_match" || inv.reconciliationStatus === "no_invoice")
    .map((inv) => inv.id);
  const allSelected = selectableIds.length > 0 && selectableIds.every((id) => selectedIds.includes(id));

  return (
    <div className="ss-card" style={{ overflow: "hidden" }}>
      <div style={{ overflowX: "auto" }}>
        <table className="ss-table">
          <thead>
            <tr>
              <th style={{ width: 36 }}>
                <input
                  type="checkbox"
                  checked={allSelected}
                  onChange={onToggleSelectAll}
                  aria-label="Select all reviewable rows"
                />
              </th>
              <th>Supplier</th>
              <th>Ref</th>
              <th>Date</th>
              <th style={{ textAlign: "right" }}>Amount</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {invoices.map((inv) => {
              const status = STATUS_COPY[inv.reconciliationStatus];
              const selectable =
                inv.reconciliationStatus === "pending_match" || inv.reconciliationStatus === "no_invoice";
              return (
                <tr key={inv.id}>
                  <td>
                    {selectable && (
                      <input
                        type="checkbox"
                        checked={selectedIds.includes(inv.id)}
                        onChange={() => onToggleSelect(inv.id)}
                        aria-label={`Select ${inv.invoiceRef}`}
                      />
                    )}
                  </td>
                  <td>
                    {inv.supplierName}
                    {inv.isDuplicateOf && (
                      <span className="ss-badge ss-badge--exc" style={{ marginLeft: 8 }}>
                        Possible duplicate
                      </span>
                    )}
                  </td>
                  <td style={{ fontFamily: "var(--font-demo-mono)", color: "var(--muted-foreground)" }}>
                    {inv.invoiceRef}
                  </td>
                  <td style={{ color: "var(--muted-foreground)" }}>{formatDate(inv.invoiceDate)}</td>
                  <td style={{ textAlign: "right", fontFamily: "var(--font-demo-mono)", fontWeight: 600 }}>
                    {formatCurrency(inv.balance)}
                  </td>
                  <td>
                    <span className={`ss-badge ss-badge--${status.tone}`}>{status.label}</span>
                  </td>
                  <td>
                    {status.action ? (
                      <button type="button" className="ss-btn ss-btn--outline ss-btn--sm" onClick={() => onRowAction(inv)}>
                        {status.action}
                      </button>
                    ) : (
                      <span style={{ color: "var(--muted-foreground)", fontSize: 12.5 }}>—</span>
                    )}
                  </td>
                </tr>
              );
            })}
            {invoices.length === 0 && (
              <tr>
                <td colSpan={7} style={{ textAlign: "center", padding: 28, color: "var(--muted-foreground)" }}>
                  No statement lines match your filters
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
