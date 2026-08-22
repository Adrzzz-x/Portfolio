import type {
  ExpenseAccount,
  Product,
  ReconStatusDoc,
  ReconciliationStatus,
  StatementLine,
  SupplierMeta,
  XeroContact,
} from "./types";

// Seed data is reproduced verbatim from the SwiftStatement design source. Supplier names are
// fictional in the original; only the account-holder branding was genericised (see workspace header).

export const INVOICES: StatementLine[] = [
  { id: "inv-001", type: "Invoice", poReference: "PO-2026-0341", statementPeriod: "May 2026", supplierName: "Carpet Wholesalers Australia", invoiceRef: "CWA-2024-0847", invoiceDate: "05 May 2026", dueDate: "05 Jun 2026", originalAmount: 15420.5, balance: 15420.5, statementMonth: "2026-05", syncedToXero: false, paid: false, reconciliationStatus: "unlinked", xeroStatus: "not_posted" },
  { id: "inv-002", type: "Invoice", poReference: "PO-2026-0355", statementPeriod: "May 2026", supplierName: "Flooring Direct Pty Ltd", invoiceRef: "FD-2024-1203", invoiceDate: "12 May 2026", dueDate: "12 Jun 2026", originalAmount: 8750.0, balance: 8750.0, statementMonth: "2026-05", syncedToXero: false, paid: false, reconciliationStatus: "no_posting_behaviour", xeroStatus: "not_posted" },
  { id: "inv-003", type: "Invoice", poReference: "PO-2026-0362", statementPeriod: "May 2026", supplierName: "Premium Underlay Solutions", invoiceRef: "PUS-2025-0089", invoiceDate: "15 May 2026", dueDate: "15 Jun 2026", originalAmount: 22100.75, balance: 22100.75, statementMonth: "2026-05", syncedToXero: true, paid: false, reconciliationStatus: "reconciled", xeroStatus: "matched", xeroInvoiceUrl: "https://go.xero.com" },
  { id: "inv-004", type: "Invoice", poReference: "PO-2026-0374", statementPeriod: "May 2026", supplierName: "Residential Carpet Supply Co", invoiceRef: "RCS-2025-0156", invoiceDate: "18 May 2026", dueDate: "18 Jun 2026", originalAmount: 3240.0, balance: 3240.0, statementMonth: "2026-05", syncedToXero: true, paid: true, reconciliationStatus: "reconciled", xeroStatus: "matched", xeroInvoiceUrl: "https://go.xero.com" },
  { id: "inv-005", type: "Payment", poReference: "—", statementPeriod: "May 2026", supplierName: "Commercial Flooring Distributors", invoiceRef: "CFD-2024-1875", invoiceDate: "20 May 2026", dueDate: "20 Jun 2026", originalAmount: 45680.25, balance: 45680.25, statementMonth: "2026-05", syncedToXero: true, paid: true, reconciliationStatus: "reconciled", xeroStatus: "matched", xeroInvoiceUrl: "https://go.xero.com" },
  { id: "inv-006", type: "Credit Note", poReference: "PO-2026-0362", statementPeriod: "May 2026", supplierName: "Premium Underlay Solutions", invoiceRef: "CN-PUS-2025-045", invoiceDate: "22 May 2026", dueDate: "22 Jun 2026", originalAmount: -2350.0, balance: -2350.0, statementMonth: "2026-05", syncedToXero: true, paid: true, reconciliationStatus: "reconciled", xeroStatus: "matched", xeroInvoiceUrl: "https://go.xero.com" },
  { id: "inv-007", type: "Payment", poReference: "—", statementPeriod: "May 2026", supplierName: "Vinyl Flooring Imports", invoiceRef: "VFI-2025-0134", invoiceDate: "24 May 2026", dueDate: "24 Jun 2026", originalAmount: 6780.5, balance: 6780.5, statementMonth: "2026-05", syncedToXero: true, paid: true, reconciliationStatus: "reconciled", xeroStatus: "posted", xeroInvoiceUrl: "https://go.xero.com" },
  { id: "inv-008", type: "Invoice", poReference: "PO-2026-0389", statementPeriod: "May 2026", supplierName: "Installation Supplies Australia", invoiceRef: "ISA-2024-2104", invoiceDate: "25 May 2026", dueDate: "25 Jun 2026", originalAmount: 12250.0, balance: 12250.0, statementMonth: "2026-05", syncedToXero: true, paid: true, reconciliationStatus: "reconciled", xeroStatus: "matched", xeroInvoiceUrl: "https://go.xero.com" },
  { id: "inv-009", type: "Payment", poReference: "—", statementPeriod: "May 2026", supplierName: "Carpet Accessories Direct", invoiceRef: "CAD-2026-0087", invoiceDate: "26 May 2026", dueDate: "26 Jun 2026", originalAmount: 4890.0, balance: 4890.0, statementMonth: "2026-05", syncedToXero: true, paid: true, reconciliationStatus: "reconciled", xeroStatus: "posted", xeroInvoiceUrl: "https://go.xero.com" },
  { id: "inv-010", type: "Invoice", poReference: "PO-2026-0401", statementPeriod: "May 2026", supplierName: "Quality Timber Flooring", invoiceRef: "QTF-2026-0234", invoiceDate: "27 May 2026", dueDate: "27 Jun 2026", originalAmount: 18750.0, balance: 18750.0, statementMonth: "2026-05", syncedToXero: true, paid: false, reconciliationStatus: "reconciled", xeroStatus: "matched", xeroInvoiceUrl: "https://go.xero.com" },
  { id: "inv-011", type: "Invoice", poReference: "PO-2026-0412", statementPeriod: "May 2026", supplierName: "Hardwood Flooring Co", invoiceRef: "HFC-2026-0091", invoiceDate: "28 May 2026", dueDate: "28 Jun 2026", originalAmount: 9320.0, balance: 9320.0, statementMonth: "2026-05", syncedToXero: true, paid: false, reconciliationStatus: "reconciled", xeroStatus: "matched", xeroInvoiceUrl: "https://go.xero.com" },
  { id: "inv-012", type: "Invoice", poReference: "PO-2026-0418", statementPeriod: "May 2026", supplierName: "Decorative Tile Imports", invoiceRef: "DTI-2026-0042", invoiceDate: "29 May 2026", dueDate: "29 Jun 2026", originalAmount: 13680.0, balance: 13680.0, statementMonth: "2026-05", syncedToXero: false, paid: false, reconciliationStatus: "pending_match", xeroStatus: "not_posted" },
  { id: "inv-013", type: "Invoice", poReference: "PO-2026-0421", statementPeriod: "May 2026", supplierName: "Adhesives & Sealants Australia", invoiceRef: "ASA-2026-0318", invoiceDate: "30 May 2026", dueDate: "30 Jun 2026", originalAmount: 2940.5, balance: 2940.5, statementMonth: "2026-05", syncedToXero: true, paid: false, reconciliationStatus: "reconciled", xeroStatus: "matched", xeroInvoiceUrl: "https://go.xero.com" },
  { id: "inv-014", type: "Invoice", poReference: "PO-2026-0399", statementPeriod: "May 2026", supplierName: "Skirting & Trims Supply Co", invoiceRef: "STS-2026-0177", invoiceDate: "21 May 2026", dueDate: "21 Jun 2026", originalAmount: 5410.0, balance: 5410.0, statementMonth: "2026-05", syncedToXero: true, paid: false, reconciliationStatus: "reconciled", xeroStatus: "matched", xeroInvoiceUrl: "https://go.xero.com" },
  { id: "inv-015", type: "Invoice", poReference: "PO-2026-0386", statementPeriod: "May 2026", supplierName: "Eco Flooring Group", invoiceRef: "EFG-2026-0205", invoiceDate: "19 May 2026", dueDate: "19 Jun 2026", originalAmount: 17250.75, balance: 17250.75, statementMonth: "2026-05", syncedToXero: true, paid: false, reconciliationStatus: "reconciled", xeroStatus: "matched", xeroInvoiceUrl: "https://go.xero.com" },
  { id: "inv-016", type: "Credit Note", poReference: "PO-2026-0399", statementPeriod: "May 2026", supplierName: "Skirting & Trims Supply Co", invoiceRef: "CN-STS-2026-009", invoiceDate: "23 May 2026", dueDate: "23 Jun 2026", originalAmount: -880.0, balance: -880.0, statementMonth: "2026-05", syncedToXero: true, paid: false, reconciliationStatus: "reconciled", xeroStatus: "matched", xeroInvoiceUrl: "https://go.xero.com" },
  { id: "inv-017", type: "Invoice", poReference: "PO-2026-0433", statementPeriod: "May 2026", supplierName: "Metro Tile Warehouse", invoiceRef: "MTW-2026-0461", invoiceDate: "31 May 2026", dueDate: "30 Jun 2026", originalAmount: 8120.0, balance: 8120.0, statementMonth: "2026-05", syncedToXero: true, paid: false, reconciliationStatus: "reconciled", xeroStatus: "matched", xeroInvoiceUrl: "https://go.xero.com" },
  { id: "inv-018", type: "Invoice", poReference: "PO-2026-0290", statementPeriod: "Apr 2026", supplierName: "Coastal Carpet Mills", invoiceRef: "CCM-2026-0033", invoiceDate: "14 Apr 2026", dueDate: "14 May 2026", originalAmount: 26540.0, balance: 26540.0, statementMonth: "2026-04", syncedToXero: true, paid: false, reconciliationStatus: "reconciled", xeroStatus: "matched", xeroInvoiceUrl: "https://go.xero.com" },
  { id: "inv-019", type: "Payment", poReference: "—", statementPeriod: "May 2026", supplierName: "Eco Flooring Group", invoiceRef: "PMT-EFG-0072", invoiceDate: "27 May 2026", dueDate: "27 May 2026", originalAmount: 11000.0, balance: 11000.0, statementMonth: "2026-05", syncedToXero: true, paid: true, reconciliationStatus: "reconciled", xeroStatus: "posted", xeroInvoiceUrl: "https://go.xero.com" },
  { id: "inv-020", type: "Invoice", poReference: "PO-2026-0445", statementPeriod: "May 2026", supplierName: "Subfloor Prep Services", invoiceRef: "SPS-2026-0118", invoiceDate: "31 May 2026", dueDate: "30 Jun 2026", originalAmount: 4375.0, balance: 4375.0, statementMonth: "2026-05", syncedToXero: true, paid: false, reconciliationStatus: "reconciled", xeroStatus: "matched", xeroInvoiceUrl: "https://go.xero.com" },
];

export const RECON_STATUSES: ReconStatusDoc[] = [
  { label: "Link supplier", icon: "link", description: "This is the first statement line we've seen from this supplier. Link them to a supplier in your Xero so we can start reconciling your account." },
  { label: "Set posting behaviour", icon: "settings", description: "To create invoices in Xero, we need a default product and expense account for this supplier. Set one up and we can take it from there." },
  { label: "Match invoice", icon: "git-merge", description: "We found invoices in Xero from this supplier, but none match exactly. Review them and manually link the right one - or create a new invoice if none apply." },
  { label: "Approve and post", icon: "send", description: "There are no invoices in Xero for this supplier. That could mean you haven't uploaded one, or you'd like us to create it. We'll mark it as paid using your creditline account." },
];

export const ACTION_CFG: Record<
  ReconciliationStatus,
  { label: string | null; variant?: "btn-primary" | "btn-outline" }
> = {
  reconciled: { label: null },
  unlinked: { label: "Link supplier", variant: "btn-primary" },
  no_posting_behaviour: { label: "Set posting", variant: "btn-primary" },
  no_invoice: { label: "Approve and post", variant: "btn-outline" },
  pending_match: { label: "Match invoice", variant: "btn-outline" },
};

export const ACTION_ORDER: Record<ReconciliationStatus, number> = {
  unlinked: 0,
  no_posting_behaviour: 1,
  pending_match: 2,
  no_invoice: 3,
  reconciled: 4,
};

export const CREDIT_LIMIT = 300000;
export const LAST_MONTH_SPEND = 172400;

export const POST_PRODUCT_ACCOUNTS: Record<string, ExpenseAccount> = {
  "Carpet — broadloom": { expenseCode: "5000", expenseName: "Cost of goods sold" },
  "Underlay & padding": { expenseCode: "5000", expenseName: "Cost of goods sold" },
  "Timber flooring": { expenseCode: "5000", expenseName: "Cost of goods sold" },
  "Vinyl & laminate": { expenseCode: "5000", expenseName: "Cost of goods sold" },
  "Installation accessories": { expenseCode: "5100", expenseName: "Materials & supplies" },
  "Freight & delivery": { expenseCode: "6200", expenseName: "Freight & courier" },
};

export const POST_PRODUCTS = Object.keys(POST_PRODUCT_ACCOUNTS);

export const PRODUCTS: Product[] = [
  { id: "p-001", code: "CRP-BRD", name: "Carpet — broadloom", expenseCode: "5000", expenseName: "Cost of goods sold" },
  { id: "p-002", code: "UND-PAD", name: "Underlay & padding", expenseCode: "5000", expenseName: "Cost of goods sold" },
  { id: "p-003", code: "TMB-FLR", name: "Timber flooring", expenseCode: "5000", expenseName: "Cost of goods sold" },
  { id: "p-004", code: "VNL-LAM", name: "Vinyl & laminate", expenseCode: "5000", expenseName: "Cost of goods sold" },
  { id: "p-005", code: "INS-ACC", name: "Installation accessories", expenseCode: "5100", expenseName: "Materials & supplies" },
  { id: "p-006", code: "FRT-DEL", name: "Freight & delivery", expenseCode: "6200", expenseName: "Freight & courier" },
];

export const XERO_CONTACTS: XeroContact[] = [
  { id: "xc-001", name: "Carpet Wholesalers Australia Pty Ltd", refId: "CWA-001", abn: "51 234 567 891" },
  { id: "xc-002", name: "Flooring Direct Pty Ltd", refId: "FD-002", abn: "43 567 890 123" },
  { id: "xc-003", name: "Premium Underlay Solutions", refId: "PUS-003", abn: "67 890 123 456" },
  { id: "xc-004", name: "Residential Carpet Supply Co", refId: "RCS-004", abn: "89 012 345 678" },
  { id: "xc-005", name: "Commercial Flooring Distributors", refId: "CFD-005", abn: "57 608 108 774" },
  { id: "xc-006", name: "Installation Supplies Australia", refId: "ISA-006", abn: "72 345 678 901" },
  { id: "xc-007", name: "Quality Timber Flooring Pty Ltd", refId: "QTF-007", abn: "31 456 789 012" },
  { id: "xc-008", name: "Hardwood Flooring Co", refId: "HFC-008", abn: "58 234 890 123" },
  { id: "xc-009", name: "Vinyl Imports Australia", refId: "VIA-009", abn: "12 678 901 234" },
];

export const MATCH_SUPPLIERS: Record<string, SupplierMeta> = {
  "Carpet Wholesalers Australia": { refId: "CWA-001", abn: "51 234 567 891", phone: "03 9412 7788" },
  "Flooring Direct Pty Ltd": { refId: "FD-002", abn: "24 651 389 002", phone: "02 8311 4500" },
  "Premium Underlay Solutions": { refId: "PUS-003", abn: "67 902 145 663", phone: "07 3219 8842" },
  "Decorative Tile Imports": { refId: "DTI-011", abn: "63 884 207 119", phone: "02 9211 6700" },
  "Adhesives & Sealants Australia": { refId: "ASA-012", abn: "40 119 772 350", phone: "03 9670 1188" },
};

export const MONTH_OPTIONS = [
  { value: "all", label: "Statement month" },
  { value: "2026-05", label: "May 2026" },
  { value: "2026-04", label: "April 2026" },
  { value: "2026-03", label: "March 2026" },
  { value: "2026-02", label: "February 2026" },
];

export const COLUMN_OPTIONS = [
  { id: "ref", label: "Reference" },
  { id: "po", label: "PO reference" },
  { id: "date", label: "Transaction date" },
  { id: "period", label: "Statement period" },
  { id: "due", label: "Due date" },
  { id: "amount", label: "Amount" },
  { id: "recon", label: "Reconciliation" },
] as const;

// Suppliers used only when fabricating new lines on refresh.
export const REFRESH_SUPPLIERS = [
  { name: "Coastal Carpet Mills", code: "CCM" },
  { name: "Northline Timber Supply", code: "NTS" },
  { name: "Apex Underlay Co", code: "AUC" },
  { name: "Riverina Tile Distributors", code: "RTD" },
  { name: "Vinyl Flooring Imports", code: "VFI" },
  { name: "Metro Tile Warehouse", code: "MTW" },
  { name: "Gulf Adhesives Group", code: "GAG" },
  { name: "Southbank Floor Trims", code: "SFT" },
];

export const REFRESH_STATUSES: ReconciliationStatus[] = [
  "unlinked",
  "no_posting_behaviour",
  "no_invoice",
  "pending_match",
  "reconciled",
];
