"use client";

import { create } from "zustand";
import {
  INVOICES,
  POST_PRODUCTS,
  REFRESH_STATUSES,
  REFRESH_SUPPLIERS,
} from "./seed";
import { gstIncl } from "./format";
import { xeroCandidatesFor } from "./derive";
import type {
  ColumnKey,
  HeaderView,
  MatchMode,
  ReconFilter,
  Resolution,
  SortColumn,
  SortDir,
  StatementLine,
  TypeFilter,
  VerifyRow,
  XeroContact,
} from "./types";

const REFRESH_MS = 1500;
const TOAST_MS = 3500;

type DemoState = {
  initialized: boolean;
  invoices: StatementLine[];
  searchQuery: string;
  statementMonth: string;
  reconFilter: ReconFilter;
  typeFilter: TypeFilter;
  selected: Record<string, boolean>;
  sortColumn: SortColumn | null;
  sortDir: SortDir;
  headerView: HeaderView;
  showColumns: boolean;
  showReconInfo: boolean;
  fetching: boolean;
  /** null until the client mounts, so SSR and hydration agree. */
  lastUpdated: number | null;
  toast: string | null;
  cols: Record<ColumnKey, boolean>;

  matchFlow: { inv: StatementLine } | null;
  mMode: MatchMode;
  mSelId: string | null;
  mSearch: string;
  mResolution: Resolution;
  mProduct: string;
  mTax: number;
  mTotal: number;
  mPreview: { id: string; ref: string; date: string; total: number } | null;

  verifyFlow: { invoices: StatementLine[] } | null;
  vRows: VerifyRow[];
  vTaxFocus: string | null;

  supplierFlow: { inv: StatementLine } | null;
  sfStep: 1 | 2;
  sfContact: XeroContact | null;
  sfCreating: boolean;
  sfNewName: string;
  sfNewAbn: string;
  sfSearch: string;
  sfProduct: string;

  init: () => void;
  showToast: (msg: string) => void;
  closeToast: () => void;
  setSearch: (v: string) => void;
  setMonth: (v: string) => void;
  setReconFilter: (v: ReconFilter) => void;
  setTypeFilter: (v: TypeFilter) => void;
  toggleColumnsPopover: () => void;
  toggleColumn: (id: ColumnKey) => void;
  setHeaderView: (v: HeaderView) => void;
  setShowReconInfo: (v: boolean) => void;
  handleSort: (col: SortColumn) => void;
  toggleInvoice: (id: string) => void;
  toggleAll: (list: StatementLine[]) => void;
  handleRefresh: () => void;

  handleAction: (inv: StatementLine) => void;
  openMatch: (inv: StatementLine, mode: MatchMode) => void;
  closeMatch: () => void;
  setMatchMode: (m: MatchMode) => void;
  setMatchSel: (id: string) => void;
  setMatchSearch: (v: string) => void;
  setResolution: (r: Resolution) => void;
  setMProduct: (v: string) => void;
  setMTax: (v: number) => void;
  setMTotal: (v: number) => void;
  setPreview: (c: DemoState["mPreview"]) => void;
  confirmMatch: () => void;
  confirmPostNew: () => void;

  openVerify: (list: StatementLine[]) => void;
  closeVerify: () => void;
  updateVerifyRow: (id: string, field: "product" | "tax", value: string | number) => void;
  setVTaxFocus: (id: string | null) => void;
  confirmVerify: () => void;

  openSupplier: (inv: StatementLine, step: 1 | 2) => void;
  closeSupplier: () => void;
  setSfStep: (s: 1 | 2) => void;
  setSfContact: (c: XeroContact | null) => void;
  setSfCreating: (v: boolean) => void;
  startCreateSupplier: () => void;
  setSfNewName: (v: string) => void;
  setSfNewAbn: (v: string) => void;
  setSfSearch: (v: string) => void;
  setSfProduct: (v: string) => void;
  supplierNext: () => void;
};

let toastTimer: ReturnType<typeof setTimeout> | null = null;

/**
 * Fabricates statement lines on refresh — mirrors the design's makeNewLines(),
 * including its Fisher–Yates supplier shuffle and reference-format quirks.
 */
function makeNewLines(n: number): StatementLine[] {
  const pool = [...REFRESH_SUPPLIERS];
  for (let i = pool.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [pool[i], pool[j]] = [pool[j], pool[i]];
  }
  const seq = Date.now().toString().slice(-4);
  const out: StatementLine[] = [];
  for (let k = 0; k < n; k++) {
    const sup = pool[k % pool.length];
    const status = REFRESH_STATUSES[Math.floor(Math.random() * REFRESH_STATUSES.length)];
    const isCredit = Math.random() < 0.18;
    const type: StatementLine["type"] = isCredit
      ? "Credit Note"
      : Math.random() < 0.15
        ? "Payment"
        : "Invoice";
    const mag = Math.round((800 + Math.random() * 18000) * 100) / 100;
    const amount = type === "Invoice" ? mag : -mag;
    const day = String(1 + Math.floor(Math.random() * 28)).padStart(2, "0");
    const refNo = String(100 + Math.floor(Math.random() * 900));
    const prefix =
      type === "Credit Note" ? `CN-${sup.code}` : type === "Payment" ? `PMT-${sup.code}` : sup.code;
    out.push({
      id: `inv-new-${seq}-${k}`,
      type,
      poReference: type === "Payment" ? "—" : `PO-2026-0${refNo}`,
      statementPeriod: "May 2026",
      supplierName: sup.name,
      invoiceRef: `${prefix}-2026-0${refNo}`,
      invoiceDate: `${day} May 2026`,
      dueDate: `${day} Jun 2026`,
      originalAmount: amount,
      balance: amount,
      statementMonth: "2026-05",
      syncedToXero: status === "reconciled",
      paid: false,
      reconciliationStatus: status,
      xeroStatus: status === "reconciled" ? "posted" : "not_posted",
      isNew: true,
    });
  }
  return out;
}

export const useDemoStore = create<DemoState>((set, get) => ({
  initialized: false,
  invoices: INVOICES,
  searchQuery: "",
  statementMonth: "2026-05",
  reconFilter: "all",
  typeFilter: "all",
  selected: {},
  sortColumn: null,
  sortDir: "asc",
  headerView: "credit",
  showColumns: false,
  showReconInfo: false,
  fetching: false,
  lastUpdated: null,
  toast: null,
  cols: { ref: true, po: true, date: true, period: false, due: false, amount: true, recon: true },

  matchFlow: null,
  mMode: "match",
  mSelId: null,
  mSearch: "",
  mResolution: "writeoff",
  mProduct: "",
  mTax: 0,
  mTotal: 0,
  mPreview: null,

  verifyFlow: null,
  vRows: [],
  vTaxFocus: null,

  supplierFlow: null,
  sfStep: 1,
  sfContact: null,
  sfCreating: false,
  sfNewName: "",
  sfNewAbn: "",
  sfSearch: "",
  sfProduct: "",

  // Seeded 14 minutes ago on the client so the feed reads "Last updated 14 minutes ago".
  init: () => {
    if (get().initialized) return;
    set({ initialized: true, lastUpdated: Date.now() - 14 * 60 * 1000 });
  },

  showToast: (msg) => {
    if (toastTimer) clearTimeout(toastTimer);
    set({ toast: msg });
    toastTimer = setTimeout(() => set({ toast: null }), TOAST_MS);
  },
  closeToast: () => set({ toast: null }),

  setSearch: (v) => set({ searchQuery: v }),
  setMonth: (v) => set({ statementMonth: v }),
  setReconFilter: (v) => set({ reconFilter: v }),
  setTypeFilter: (v) => set({ typeFilter: v }),
  toggleColumnsPopover: () => set((s) => ({ showColumns: !s.showColumns })),
  toggleColumn: (id) => set((s) => ({ cols: { ...s.cols, [id]: !s.cols[id] } })),
  setHeaderView: (v) => set({ headerView: v }),
  setShowReconInfo: (v) => set({ showReconInfo: v }),

  handleSort: (col) =>
    set((s) =>
      s.sortColumn === col
        ? { sortDir: s.sortDir === "asc" ? "desc" : "asc" }
        : { sortColumn: col, sortDir: "asc" },
    ),

  toggleInvoice: (id) =>
    set((s) => {
      const next = { ...s.selected };
      if (next[id]) delete next[id];
      else next[id] = true;
      return { selected: next };
    }),

  // Replaces the whole selection map, matching the design (clears rows hidden by filters).
  toggleAll: (list) =>
    set((s) => {
      const selectable = list.filter((i) => !(i.paid && i.reconciliationStatus === "reconciled"));
      const allSelected = selectable.length > 0 && selectable.every((i) => s.selected[i.id]);
      if (allSelected) return { selected: {} };
      const next: Record<string, boolean> = {};
      selectable.forEach((i) => {
        next[i.id] = true;
      });
      return { selected: next };
    }),

  handleRefresh: () => {
    if (get().fetching) return;
    set({ fetching: true });
    setTimeout(() => {
      const added = makeNewLines(3);
      set((s) => ({
        fetching: false,
        lastUpdated: Date.now(),
        invoices: [...added, ...s.invoices],
        statementMonth:
          s.statementMonth === "all" || s.statementMonth === "2026-05" ? s.statementMonth : "2026-05",
      }));
      get().showToast(
        added.length === 1
          ? "1 new statement line fetched"
          : `${added.length} new statement lines fetched`,
      );
    }, REFRESH_MS);
  },

  handleAction: (inv) => {
    const s = get();
    switch (inv.reconciliationStatus) {
      case "unlinked":
        s.openSupplier(inv, 1);
        break;
      case "no_posting_behaviour":
        s.openSupplier(inv, 2);
        break;
      case "pending_match":
        s.openMatch(inv, "match");
        break;
      case "no_invoice":
        s.openMatch(inv, "postnew");
        break;
    }
  },

  openMatch: (inv, mode) => {
    const cands = xeroCandidatesFor(inv);
    const canMatch = cands.length > 0;
    const t0 = Math.abs(inv.balance);
    const pre = cands.find((c) => c.ref === inv.invoiceRef || Math.abs(c.total - t0) < 0.01);
    set({
      matchFlow: { inv },
      mMode: canMatch ? mode : "postnew",
      mSelId: pre ? pre.id : null,
      mSearch: "",
      mResolution: "writeoff",
      mProduct: "",
      mTax: gstIncl(t0),
      mTotal: t0,
      mPreview: null,
    });
  },
  closeMatch: () => set({ matchFlow: null }),
  setMatchMode: (m) => set({ mMode: m }),
  setMatchSel: (id) => set({ mSelId: id }),
  setMatchSearch: (v) => set({ mSearch: v }),
  setResolution: (r) => set({ mResolution: r }),
  setMProduct: (v) => set({ mProduct: v }),
  setMTax: (v) => set({ mTax: v }),
  setMTotal: (v) => set({ mTotal: v }),
  setPreview: (c) => set({ mPreview: c }),

  confirmMatch: () => {
    const s = get();
    const inv = s.matchFlow?.inv;
    if (!inv) return;
    const sel = xeroCandidatesFor(inv).find((c) => c.id === s.mSelId);
    if (!sel) return;
    const diff = Math.round((Math.abs(inv.balance) - sel.total) * 100) / 100;
    const note =
      Math.abs(diff) >= 0.01
        ? s.mResolution === "writeoff"
          ? " — difference written off"
          : " — difference left unaccounted for"
        : "";
    set((st) => ({
      invoices: st.invoices.map((i) =>
        i.id === inv.id
          ? {
              ...i,
              syncedToXero: true,
              reconciliationStatus: "reconciled" as const,
              xeroStatus: "matched" as const,
              xeroInvoiceUrl: "https://go.xero.com",
            }
          : i,
      ),
      matchFlow: null,
    }));
    s.showToast(`Matched ${inv.invoiceRef} to ${sel.ref}${note}`);
  },

  confirmPostNew: () => {
    const s = get();
    const inv = s.matchFlow?.inv;
    if (!inv) return;
    set((st) => ({
      invoices: st.invoices.map((i) =>
        i.id === inv.id
          ? {
              ...i,
              syncedToXero: true,
              reconciliationStatus: "reconciled" as const,
              xeroStatus: "posted" as const,
              xeroInvoiceUrl: "https://go.xero.com",
            }
          : i,
      ),
      matchFlow: null,
    }));
    s.showToast(
      `Posted ${inv.invoiceRef} to Xero as a new invoice — $${s.mTotal.toLocaleString("en-AU", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })}`,
    );
  },

  openVerify: (list) => {
    const rows: VerifyRow[] = list.map((inv) => {
      const t = Math.abs(inv.balance);
      const tx = gstIncl(t);
      return {
        id: inv.id,
        ref: inv.invoiceRef,
        supplier: inv.supplierName,
        net: Math.round((t - tx) * 100) / 100,
        product: POST_PRODUCTS[0],
        tax: tx,
      };
    });
    set({ verifyFlow: { invoices: list }, vRows: rows, vTaxFocus: null });
  },
  closeVerify: () => set({ verifyFlow: null }),
  updateVerifyRow: (id, field, value) =>
    set((s) => ({ vRows: s.vRows.map((r) => (r.id === id ? { ...r, [field]: value } : r)) })),
  setVTaxFocus: (id) => set({ vTaxFocus: id }),

  confirmVerify: () => {
    const s = get();
    const ids = s.vRows.map((r) => r.id);
    const selected = { ...s.selected };
    ids.forEach((id) => delete selected[id]);
    set((st) => ({
      invoices: st.invoices.map((i) =>
        ids.includes(i.id)
          ? {
              ...i,
              syncedToXero: true,
              reconciliationStatus: "reconciled" as const,
              xeroStatus: "posted" as const,
              xeroInvoiceUrl: "https://go.xero.com",
            }
          : i,
      ),
      verifyFlow: null,
      selected,
    }));
    s.showToast(
      `Successfully posted ${s.vRows.length} invoice${s.vRows.length !== 1 ? "s" : ""} to Xero`,
    );
  },

  openSupplier: (inv, step) =>
    set({
      supplierFlow: { inv },
      sfStep: step,
      sfContact: null,
      sfCreating: false,
      sfNewName: inv.supplierName,
      sfNewAbn: "",
      sfSearch: "",
      sfProduct: "",
    }),
  closeSupplier: () => set({ supplierFlow: null }),
  setSfStep: (s) => set({ sfStep: s }),
  setSfContact: (c) => set({ sfContact: c, sfCreating: false }),
  setSfCreating: (v) => set({ sfCreating: v }),
  // Atomic: setSfContact also clears sfCreating, so switching into the
  // create-new panel has to happen in one update.
  startCreateSupplier: () =>
    set((s) => ({
      sfCreating: true,
      sfContact: null,
      sfNewName: s.supplierFlow?.inv.supplierName ?? s.sfNewName,
    })),
  setSfNewName: (v) => set({ sfNewName: v }),
  setSfNewAbn: (v) => set({ sfNewAbn: v }),
  setSfSearch: (v) => set({ sfSearch: v }),
  setSfProduct: (v) => set({ sfProduct: v }),

  // Faithful to the design: completing this flow only toasts — it never mutates the row.
  supplierNext: () => {
    const s = get();
    if (s.sfStep === 1) {
      set({ sfStep: 2 });
      return;
    }
    const inv = s.supplierFlow?.inv;
    set({ supplierFlow: null });
    if (inv) s.showToast(`Supplier linked and posting behaviour saved for ${inv.supplierName}`);
  },
}));
