"use client";

import { create } from "zustand";
import type { StatementLine, ToastMessage } from "./types";
import { buildSeedInvoices, SUPPLIERS } from "./seed";

function delay(min = 300, max = 600) {
  const ms = min + Math.random() * (max - min);
  return new Promise((resolve) => setTimeout(resolve, ms));
}

let toastSeq = 0;

const NEW_LINE_SUPPLIERS = SUPPLIERS.filter((s) => s.preferred);

type Filters = {
  search: string;
  status: "all" | StatementLine["reconciliationStatus"];
};

type DemoState = {
  initialized: boolean;
  invoices: StatementLine[];
  selectedIds: string[];
  filters: Filters;
  toast: ToastMessage | null;
  fetching: boolean;
  lastUpdated: number | null;

  init: () => void;
  reset: () => void;
  refresh: () => Promise<void>;
  setFilters: (patch: Partial<Filters>) => void;
  toggleSelect: (id: string) => void;
  clearSelection: () => void;
  linkSupplier: (invoiceId: string, contactId: string) => Promise<void>;
  setPostingBehaviour: (invoiceId: string, productCode: string) => Promise<void>;
  matchInvoice: (invoiceId: string, opts: { candidateId?: string; writeOff?: boolean }) => Promise<void>;
  reconcileSelected: (ids: string[]) => Promise<void>;
  dismissToast: () => void;
  notify: (message: string) => void;
};

function showToast(set: (fn: (s: DemoState) => Partial<DemoState>) => void, message: string) {
  const toast = { id: ++toastSeq, message };
  set(() => ({ toast }));
  setTimeout(() => {
    set((s) => (s.toast?.id === toast.id ? { toast: null } : {}));
  }, 3500);
}

export const useDemoStore = create<DemoState>((set, get) => ({
  initialized: false,
  invoices: [],
  selectedIds: [],
  filters: { search: "", status: "all" },
  toast: null,
  fetching: false,
  lastUpdated: null,

  init: () => {
    if (get().initialized) return;
    set({ invoices: buildSeedInvoices(), initialized: true, lastUpdated: Date.now() });
  },

  reset: () => {
    set({ invoices: buildSeedInvoices(), selectedIds: [], toast: null, lastUpdated: Date.now() });
  },

  refresh: async () => {
    set({ fetching: true });
    await delay(1200, 1600);
    const count = 1 + Math.floor(Math.random() * 3);
    const newLines: StatementLine[] = Array.from({ length: count }).map((_, i) => {
      const supplier = NEW_LINE_SUPPLIERS[Math.floor(Math.random() * NEW_LINE_SUPPLIERS.length)];
      const amount = Math.round((150 + Math.random() * 3000) * 100) / 100;
      return {
        id: `inv-live-${Date.now()}-${i}`,
        type: "Invoice",
        poReference: `PO-2026-${Math.floor(1000 + Math.random() * 8999)}`,
        invoiceRef: `INV-${Math.floor(90500 + Math.random() * 500)}`,
        supplierName: supplier.name,
        invoiceDate: "2026-05-27",
        dueDate: "2026-06-26",
        originalAmount: amount,
        balance: amount,
        statementMonth: "2026-05",
        reconciliationStatus: "pending_match",
        xeroStatus: "matched",
        syncedToXero: false,
        productCode: supplier.defaultProductCode,
      };
    });
    set((s) => ({ invoices: [...newLines, ...s.invoices], fetching: false, lastUpdated: Date.now() }));
    showToast(set, `${count} new statement line${count > 1 ? "s" : ""} fetched`);
  },

  setFilters: (patch) => set((s) => ({ filters: { ...s.filters, ...patch } })),

  toggleSelect: (id) =>
    set((s) => ({
      selectedIds: s.selectedIds.includes(id)
        ? s.selectedIds.filter((x) => x !== id)
        : [...s.selectedIds, id],
    })),

  clearSelection: () => set({ selectedIds: [] }),

  linkSupplier: async (invoiceId, contactId) => {
    await delay();
    set((s) => ({
      invoices: s.invoices.map((inv) =>
        inv.id === invoiceId
          ? {
              ...inv,
              linkedContactId: contactId,
              reconciliationStatus: inv.productCode ? "pending_match" : "no_posting_behaviour",
              xeroStatus: inv.productCode ? "matched" : inv.xeroStatus,
            }
          : inv,
      ),
    }));
    showToast(set, "Supplier linked");
  },

  setPostingBehaviour: async (invoiceId, productCode) => {
    await delay();
    set((s) => ({
      invoices: s.invoices.map((inv) =>
        inv.id === invoiceId
          ? { ...inv, productCode, reconciliationStatus: "pending_match", xeroStatus: "matched" }
          : inv,
      ),
    }));
    showToast(set, "Posting behaviour set");
  },

  matchInvoice: async (invoiceId, { writeOff }) => {
    await delay();
    set((s) => ({
      invoices: s.invoices.map((inv) =>
        inv.id === invoiceId
          ? { ...inv, reconciliationStatus: "reconciled", xeroStatus: "posted", syncedToXero: true }
          : inv,
      ),
    }));
    showToast(set, writeOff ? "Difference written off — invoice posted" : "Invoice matched and posted");
  },

  reconcileSelected: async (ids) => {
    await delay(400, 700);
    set((s) => ({
      invoices: s.invoices.map((inv) =>
        ids.includes(inv.id)
          ? { ...inv, reconciliationStatus: "reconciled", xeroStatus: "posted", syncedToXero: true }
          : inv,
      ),
      selectedIds: s.selectedIds.filter((id) => !ids.includes(id)),
    }));
    showToast(set, `Posted ${ids.length} invoice${ids.length > 1 ? "s" : ""} to Xero`);
  },

  dismissToast: () => set({ toast: null }),

  notify: (message) => showToast(set, message),
}));
