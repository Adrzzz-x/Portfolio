"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useDemoStore } from "@/lib/demo/store";
import { ReconciliationTable } from "./ReconciliationTable";
import { CreditPanel } from "./CreditPanel";
import { LinkSupplierModal } from "./LinkSupplierModal";
import { MatchModal } from "./MatchModal";
import { VerifyPostModal } from "./VerifyPostModal";
import { Toast } from "./Toast";
import type { StatementLine } from "@/lib/demo/types";

export function ReconciliationWorkspace() {
  const init = useDemoStore((s) => s.init);
  const invoices = useDemoStore((s) => s.invoices);
  const selectedIds = useDemoStore((s) => s.selectedIds);
  const filters = useDemoStore((s) => s.filters);
  const setFilters = useDemoStore((s) => s.setFilters);
  const toggleSelect = useDemoStore((s) => s.toggleSelect);
  const clearSelection = useDemoStore((s) => s.clearSelection);

  const [linkTarget, setLinkTarget] = useState<StatementLine | null>(null);
  const [matchTarget, setMatchTarget] = useState<StatementLine | null>(null);
  const [verifyOpen, setVerifyOpen] = useState(false);

  useEffect(() => {
    init();
  }, [init]);

  const filtered = useMemo(() => {
    return invoices.filter((inv) => {
      if (filters.status !== "all" && inv.reconciliationStatus !== filters.status) return false;
      if (filters.search) {
        const q = filters.search.toLowerCase();
        if (!inv.supplierName.toLowerCase().includes(q) && !inv.invoiceRef.toLowerCase().includes(q)) {
          return false;
        }
      }
      return true;
    });
  }, [invoices, filters]);

  const selectedInvoices = invoices.filter((inv) => selectedIds.includes(inv.id));

  function handleRowAction(invoice: StatementLine) {
    if (invoice.reconciliationStatus === "unlinked" || invoice.reconciliationStatus === "no_posting_behaviour") {
      setLinkTarget(invoice);
    } else if (invoice.reconciliationStatus === "pending_match" || invoice.reconciliationStatus === "no_invoice") {
      setMatchTarget(invoice);
    }
  }

  function toggleSelectAll() {
    const selectableIds = filtered
      .filter((inv) => inv.reconciliationStatus === "pending_match" || inv.reconciliationStatus === "no_invoice")
      .map((inv) => inv.id);
    const allSelected = selectableIds.length > 0 && selectableIds.every((id) => selectedIds.includes(id));
    if (allSelected) {
      clearSelection();
    } else {
      selectableIds.forEach((id) => {
        if (!selectedIds.includes(id)) toggleSelect(id);
      });
    }
  }

  return (
    <div className="ss-hd-wrap">
      <header className="ss-hd">
        <Link href="/swiftstatement" className="ss-back">
          ← Back to case study
        </Link>
        <div style={{ fontSize: 13.5, fontWeight: 600 }}>SwiftStatement</div>
      </header>

      <div className="ss-page">
        <div style={{ marginBottom: 20 }}>
          <div style={{ fontSize: 22, fontWeight: 700, letterSpacing: "-0.01em" }}>Trade account statement</div>
          <p style={{ fontSize: 13, color: "var(--muted-foreground)", marginTop: 4 }}>
            Every line from your trade account, matched against Xero automatically. Only the
            exceptions below need a decision.
          </p>
        </div>

        <div style={{ marginBottom: 16 }}>
          <CreditPanel />
        </div>

        <div className="flex flex-wrap items-center gap-3" style={{ marginBottom: 14 }}>
          <input
            className="ss-input"
            style={{ maxWidth: 260 }}
            placeholder="Search supplier or reference…"
            value={filters.search}
            onChange={(e) => setFilters({ search: e.target.value })}
          />
          <select
            className="ss-select"
            style={{ maxWidth: 200 }}
            value={filters.status}
            onChange={(e) => setFilters({ status: e.target.value as typeof filters.status })}
          >
            <option value="all">All statuses</option>
            <option value="reconciled">Reconciled</option>
            <option value="pending_match">Needs review</option>
            <option value="unlinked">New supplier</option>
            <option value="no_posting_behaviour">No posting behaviour</option>
            <option value="no_invoice">No bill found</option>
          </select>
          <div style={{ flex: 1 }} />
          {selectedIds.length > 0 && (
            <button type="button" className="ss-btn ss-btn--primary" onClick={() => setVerifyOpen(true)}>
              Post {selectedIds.length} selected
            </button>
          )}
        </div>

        <ReconciliationTable
          invoices={filtered}
          selectedIds={selectedIds}
          onToggleSelect={toggleSelect}
          onToggleSelectAll={toggleSelectAll}
          onRowAction={handleRowAction}
        />
      </div>

      <LinkSupplierModal invoice={linkTarget} onClose={() => setLinkTarget(null)} />
      <MatchModal invoice={matchTarget} onClose={() => setMatchTarget(null)} />
      <VerifyPostModal open={verifyOpen} invoices={selectedInvoices} onClose={() => setVerifyOpen(false)} />
      <Toast />
    </div>
  );
}
