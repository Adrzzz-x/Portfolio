export const intro = {
  chip: "Trade account reconciliation",
  heading: "Month end, without the line-by-line",
  body: "Every month your trade account sends a statement with hundreds of transactions. Someone has to open it, find the matching bill in your accounting system, check the amount, and tick it off. SwiftStatement does that matching for you, and shows you only the lines that need a decision.",
  threeUp: [
    {
      label: "The problem",
      body: "Statement lines and accounting bills live in two systems that never speak. Matching them is manual, slow, and easy to get wrong.",
    },
    {
      label: "What we do",
      body: "We pull both sides in automatically and match them line by line, so reconciled transactions clear themselves.",
    },
    {
      label: "What you do",
      body: "Review the exceptions — a new supplier, a missing bill, an amount that differs — and approve them in a few selects.",
    },
  ],
  flowHeading: "How it fits together",
  flowSubheading: "We sit between your trade account and your accounting system, and keep the two in step.",
  // Capricorn / Bapcor / IRT in the original design were real Australian trade-account buying
  // groups — replaced with fictional names that keep the "buying group / franchise" framing so
  // the concept still reads correctly without naming a real company.
  tradeAccountHq: {
    title: "Trade account HQ",
    subtitle: "Tradeline Group, Forge Buying Co, Allied Trade Network",
    description: "Your monthly statement feed — every invoice, credit note and payment charged to the account.",
  },
  accounting: {
    title: "Xero or MYOB",
    subtitle: "Your accounting system",
    description: "Accounts payable bills, suppliers and chart of accounts — the other half of the match.",
  },
  core: {
    title: "SwiftStatement",
    description: "Matches each statement line to a bill, posts what's missing, and surfaces only the exceptions.",
  },
  totals: { lines: 428, bills: 402, matched: 391, review: 37 },
  matchRowsTitle: "Matching line by line",
  matchRowsSubtitle: "A sample of the 428 lines",
  matchRows: [
    { ref: "INV-88412", supplier: "Carpet Wholesalers Australia", amt: "$4,820.55" },
    { ref: "INV-88530", supplier: "Underlay Plus", amt: "$1,196.00" },
    { ref: "INV-88604", supplier: "Metro Tile Warehouse", amt: "$2,340.00", exc: "New supplier" },
    { ref: "CN-2214", supplier: "Quality Timber Flooring", amt: "-$318.40" },
    { ref: "INV-88712", supplier: "Vinyl & Flooring Direct", amt: "$890.25", exc: "No bill found" },
  ],
  stages: [
    {
      n: "1",
      label: "Statement in",
      ms: 2400,
      caption:
        "Your trade account HQ pushes the month's statement lines to us over the API — invoices, credit notes and payments.",
    },
    {
      n: "2",
      label: "Bills read",
      ms: 2400,
      caption: "We read the other side: accounts payable bills, suppliers and chart of accounts from Xero or MYOB.",
    },
    {
      n: "3",
      label: "Matched",
      ms: 3400,
      caption:
        "Each line is matched to a bill on supplier, reference and amount. Most clear themselves — the ones that can't are flagged with a reason.",
    },
  ],
  tryDemoLabel: "Try the demo →",
  backToPortfolioLabel: "← Back to portfolio",
};
