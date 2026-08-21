import type {
  StatementLine,
  Supplier,
  XeroContact,
  Product,
  AccountMapping,
} from "./types";

// Deterministic PRNG (mulberry32) so the seed set is stable across reloads —
// "seeded on mount" means the store resets to this same data, not that it's random each time.
function mulberry32(seed: number) {
  let a = seed;
  return function random() {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export const ACCOUNTS: AccountMapping[] = [
  { code: "5000", name: "Cost of goods sold" },
  { code: "5100", name: "Materials & supplies" },
  { code: "6000", name: "Purchases" },
  { code: "6200", name: "Freight & courier" },
  { code: "6300", name: "Subcontractor costs" },
  { code: "6400", name: "Operating expenses" },
];

export const PRODUCTS: Product[] = [
  { code: "carpet-broadloom", name: "Carpet — broadloom", expenseCode: "5000", expenseName: "Cost of goods sold" },
  { code: "underlay-padding", name: "Underlay & padding", expenseCode: "5000", expenseName: "Cost of goods sold" },
  { code: "timber-flooring", name: "Timber flooring", expenseCode: "5000", expenseName: "Cost of goods sold" },
  { code: "vinyl-laminate", name: "Vinyl & laminate", expenseCode: "5000", expenseName: "Cost of goods sold" },
  { code: "installation-accessories", name: "Installation accessories", expenseCode: "5100", expenseName: "Materials & supplies" },
  { code: "freight-delivery", name: "Freight & delivery", expenseCode: "6200", expenseName: "Freight & courier" },
  { code: "adhesives-sealants", name: "Adhesives & sealants", expenseCode: "5100", expenseName: "Materials & supplies" },
  { code: "trims-edging", name: "Trims & edging", expenseCode: "5100", expenseName: "Materials & supplies" },
];

export const SUPPLIERS: Supplier[] = [
  { id: "cwa", name: "Carpet Wholesalers Australia", preferred: true, defaultProductCode: "carpet-broadloom" },
  { id: "fd", name: "Flooring Direct Pty Ltd", preferred: true, defaultProductCode: "vinyl-laminate" },
  { id: "pus", name: "Premium Underlay Solutions", preferred: true, defaultProductCode: "underlay-padding" },
  { id: "rcs", name: "Residential Carpet Supply Co", preferred: true, defaultProductCode: "carpet-broadloom" },
  { id: "cfd", name: "Commercial Flooring Distributors", preferred: true, defaultProductCode: "vinyl-laminate" },
  { id: "isa", name: "Installation Supplies Australia", preferred: true, defaultProductCode: "installation-accessories" },
  { id: "qtf", name: "Quality Timber Flooring", preferred: true, defaultProductCode: "timber-flooring" },
  { id: "hfc", name: "Hardwood Flooring Co", preferred: true, defaultProductCode: "timber-flooring" },
  { id: "dti", name: "Decorative Tile Imports", preferred: false },
  { id: "asa", name: "Adhesives & Sealants Australia", preferred: true, defaultProductCode: "adhesives-sealants" },
  { id: "sst", name: "Skirting & Trims Supply Co", preferred: false },
  { id: "ecf", name: "Eco Flooring Group", preferred: false },
];

export const XERO_CONTACTS: XeroContact[] = [
  { id: "xc-cwa", name: "Carpet Wholesalers Pty Ltd", refId: "CWA-001", abn: "51 824 753 556" },
  { id: "xc-fd", name: "Flooring Direct Pty Ltd", refId: "FD-002", abn: "43 002 034 123" },
  { id: "xc-pus", name: "Premium Underlay Solutions", refId: "PUS-003", abn: "67 003 077 934" },
  { id: "xc-rcs", name: "Residential Carpet Supply Co", refId: "RCS-004", abn: "89 004 085 616" },
  { id: "xc-cfd", name: "Commercial Flooring Distributors", refId: "CFD-005", abn: "57 608 108 774" },
  { id: "xc-isa", name: "Installation Supplies Australia", refId: "ISA-006", abn: "72 005 158 929" },
  { id: "xc-qtf", name: "Quality Timber Flooring Co", refId: "QTF-007", abn: "31 006 190 351" },
  { id: "xc-hfc", name: "Hardwood Flooring Co", refId: "HFC-008", abn: "58 007 217 733" },
  { id: "xc-asa", name: "Adhesives & Sealants Australia", refId: "ASA-009", abn: "12 008 244 555" },
];

const STATEMENT_MONTH = "2026-05";

function pad(n: number) {
  return String(n).padStart(2, "0");
}

function generateInvoiceLines(): StatementLine[] {
  const rand = mulberry32(20260501);
  const lines: StatementLine[] = [];
  const preferredSuppliers = SUPPLIERS.filter((s) => s.preferred);
  const nonPreferredSuppliers = SUPPLIERS.filter((s) => !s.preferred);

  let seq = 88400;
  for (let i = 0; i < 70; i++) {
    seq += 1 + Math.floor(rand() * 6);
    const day = 1 + Math.floor(rand() * 28);
    const usePreferred = rand() > 0.18;
    const supplier = usePreferred
      ? preferredSuppliers[Math.floor(rand() * preferredSuppliers.length)]
      : nonPreferredSuppliers[Math.floor(rand() * nonPreferredSuppliers.length)];
    const amount = Math.round((120 + rand() * 4200) * 100) / 100;
    const isCredit = rand() < 0.08;
    const invoiceDate = `2026-05-${pad(day)}`;
    const due = Math.min(day + 30, 28);

    const roll = rand();
    let reconciliationStatus: StatementLine["reconciliationStatus"];
    let xeroStatus: StatementLine["xeroStatus"];
    if (roll < 0.55) {
      reconciliationStatus = "reconciled";
      xeroStatus = "posted";
    } else if (roll < 0.72) {
      reconciliationStatus = "pending_match";
      xeroStatus = "matched";
    } else if (!supplier.preferred && roll < 0.85) {
      reconciliationStatus = "unlinked";
      xeroStatus = "not_posted";
    } else if (roll < 0.9) {
      reconciliationStatus = "no_posting_behaviour";
      xeroStatus = "not_posted";
    } else {
      reconciliationStatus = "no_invoice";
      xeroStatus = "not_posted";
    }

    lines.push({
      id: `inv-${seq}`,
      type: isCredit ? "Credit Note" : "Invoice",
      poReference: `PO-2026-${String(1000 + i).slice(-4)}`,
      invoiceRef: isCredit ? `CN-${seq}` : `INV-${seq}`,
      supplierName: supplier.name,
      invoiceDate,
      dueDate: `2026-06-${pad(due)}`,
      originalAmount: isCredit ? -amount : amount,
      balance: isCredit ? -amount : amount,
      statementMonth: STATEMENT_MONTH,
      reconciliationStatus,
      xeroStatus,
      syncedToXero: xeroStatus === "posted",
      linkedContactId: reconciliationStatus === "reconciled" || reconciliationStatus === "pending_match"
        ? XERO_CONTACTS.find((c) => c.name.startsWith(supplier.name.split(" ")[0]))?.id
        : undefined,
      productCode: supplier.defaultProductCode,
    });
  }
  return lines;
}

// Three hand-authored, fixed exceptions — deliberately reproducible rather than the
// algorithmic/random mismatches a live matching engine would surface, so the demo tells
// the same story every time: a clean unmatched line, a duplicate charge, a price discrepancy.
const FIXED_EXCEPTIONS: StatementLine[] = [
  {
    id: "inv-exc-unmatched",
    type: "Invoice",
    poReference: "PO-2026-0341",
    invoiceRef: "INV-90210",
    supplierName: "Metro Tile Warehouse",
    invoiceDate: "2026-05-14",
    dueDate: "2026-06-13",
    originalAmount: 2340.0,
    balance: 2340.0,
    statementMonth: STATEMENT_MONTH,
    reconciliationStatus: "no_invoice",
    xeroStatus: "not_posted",
    syncedToXero: false,
  },
  {
    id: "inv-exc-duplicate",
    type: "Invoice",
    poReference: "PO-2026-0512",
    invoiceRef: "INV-90344",
    supplierName: "Carpet Wholesalers Australia",
    invoiceDate: "2026-05-19",
    dueDate: "2026-06-18",
    originalAmount: 4820.55,
    balance: 4820.55,
    statementMonth: STATEMENT_MONTH,
    reconciliationStatus: "pending_match",
    xeroStatus: "matched",
    syncedToXero: false,
    linkedContactId: "xc-cwa",
    isDuplicateOf: "inv-90343",
  },
  {
    id: "inv-90343",
    type: "Invoice",
    poReference: "PO-2026-0510",
    invoiceRef: "INV-90343",
    supplierName: "Carpet Wholesalers Australia",
    invoiceDate: "2026-05-18",
    dueDate: "2026-06-17",
    originalAmount: 4820.55,
    balance: 4820.55,
    statementMonth: STATEMENT_MONTH,
    reconciliationStatus: "reconciled",
    xeroStatus: "posted",
    linkedContactId: "xc-cwa",
    syncedToXero: true,
  },
  {
    id: "inv-exc-discrepancy",
    type: "Invoice",
    poReference: "PO-2026-0398",
    invoiceRef: "INV-90277",
    supplierName: "Quality Timber Flooring",
    invoiceDate: "2026-05-11",
    dueDate: "2026-06-10",
    originalAmount: 3180.0,
    balance: 3180.0,
    statementMonth: STATEMENT_MONTH,
    reconciliationStatus: "pending_match",
    xeroStatus: "matched",
    syncedToXero: false,
    linkedContactId: "xc-qtf",
  },
];

// The Xero-side candidate this statement line should fuzzy-match against, at a different
// amount — this is what drives the "write off the difference" flow in the match modal.
export const DISCREPANCY_CANDIDATE = { id: "xero-po-90277", ref: "PI-4471", date: "2026-05-11", total: 2980.0 };

export function buildSeedInvoices(): StatementLine[] {
  return [...FIXED_EXCEPTIONS, ...generateInvoiceLines()];
}

export const CREDIT_LIMIT = 300000;
export const LAST_MONTH_SPEND = 172400;
