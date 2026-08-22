export type LineType = "Invoice" | "Payment" | "Credit Note";

export type ReconciliationStatus =
  | "unlinked"
  | "no_posting_behaviour"
  | "pending_match"
  | "no_invoice"
  | "reconciled";

export type XeroStatus = "not_posted" | "matched" | "posted";

export type StatementLine = {
  id: string;
  type: LineType;
  poReference: string;
  statementPeriod: string;
  supplierName: string;
  invoiceRef: string;
  invoiceDate: string; // "05 May 2026"
  dueDate: string;
  originalAmount: number;
  balance: number;
  statementMonth: string; // "2026-05"
  syncedToXero: boolean;
  paid: boolean;
  reconciliationStatus: ReconciliationStatus;
  xeroStatus: XeroStatus;
  xeroInvoiceUrl?: string;
  isNew?: boolean;
};

export type XeroContact = {
  id: string;
  name: string;
  refId: string;
  abn: string;
};

export type SupplierMeta = {
  refId: string;
  abn: string;
  phone: string;
};

export type Product = {
  id: string;
  code: string;
  name: string;
  expenseCode: string;
  expenseName: string;
};

export type ExpenseAccount = {
  expenseCode: string;
  expenseName: string;
};

export type MatchCandidate = {
  id: string;
  ref: string;
  date: string;
  total: number;
};

export type ReconStatusDoc = {
  label: string;
  icon: string;
  description: string;
};

export type SortColumn = "supplier" | "date" | "amount" | "action";
export type SortDir = "asc" | "desc";
export type ReconFilter = "all" | "reconciled" | "unreconciled";
export type TypeFilter = "all" | "debits" | "credits";
export type HeaderView = "credit" | "spend";
export type MatchMode = "match" | "postnew";
export type Resolution = "writeoff" | "nothing";

export type ColumnKey = "ref" | "po" | "date" | "period" | "due" | "amount" | "recon";

export type VerifyRow = {
  id: string;
  ref: string;
  supplier: string;
  net: number;
  product: string;
  tax: number | string;
};
