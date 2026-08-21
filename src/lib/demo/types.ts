export type LineType = "Invoice" | "Credit Note" | "Payment";

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
  invoiceRef: string;
  supplierName: string;
  invoiceDate: string; // ISO date
  dueDate: string; // ISO date
  originalAmount: number;
  balance: number;
  statementMonth: string; // e.g. "2026-05"
  reconciliationStatus: ReconciliationStatus;
  xeroStatus: XeroStatus;
  syncedToXero: boolean;
  /** set once a line has been linked/matched to a Xero contact */
  linkedContactId?: string;
  /** set once a default product has been chosen for this line */
  productCode?: string;
  /** true only for the hand-authored duplicate-charge exception row */
  isDuplicateOf?: string;
};

export type Supplier = {
  id: string;
  name: string;
  preferred: boolean;
  defaultProductCode?: string;
};

export type XeroContact = {
  id: string;
  name: string;
  refId: string;
  abn: string;
};

export type Product = {
  code: string;
  name: string;
  expenseCode: string;
  expenseName: string;
};

export type AccountMapping = {
  code: string;
  name: string;
};

export type MatchCandidate = {
  id: string;
  ref: string;
  date: string;
  total: number;
};

export type ToastMessage = { id: number; message: string };
