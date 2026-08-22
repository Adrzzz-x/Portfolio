import { ACTION_ORDER, CREDIT_LIMIT, LAST_MONTH_SPEND } from "./seed";
import { fmt, fmtAU, gstIncl, hashStr, parseAU, relTime } from "./format";
import type {
  MatchCandidate,
  ReconFilter,
  SortColumn,
  SortDir,
  StatementLine,
  TypeFilter,
} from "./types";

/** Effective amount for sorting — Payments and credit notes sort as negatives. */
function eff(inv: StatementLine) {
  return inv.originalAmount < 0 || inv.type === "Payment"
    ? -Math.abs(inv.originalAmount)
    : inv.originalAmount;
}

export function getFiltered(
  invoices: StatementLine[],
  opts: {
    searchQuery: string;
    statementMonth: string;
    reconFilter: ReconFilter;
    typeFilter: TypeFilter;
    sortColumn: SortColumn | null;
    sortDir: SortDir;
  },
) {
  const q = opts.searchQuery.trim().toLowerCase();
  const list = invoices.filter((inv) => {
    // Payments are never listed (payments feature disabled), but still count toward credit health.
    if (inv.type === "Payment") return false;
    if (q && !(inv.supplierName.toLowerCase().includes(q) || inv.invoiceRef.toLowerCase().includes(q)))
      return false;
    if (opts.statementMonth !== "all" && inv.statementMonth !== opts.statementMonth) return false;
    if (opts.reconFilter === "reconciled" && inv.reconciliationStatus !== "reconciled") return false;
    if (opts.reconFilter === "unreconciled" && inv.reconciliationStatus === "reconciled") return false;
    if (opts.typeFilter === "credits" && inv.originalAmount >= 0) return false;
    if (opts.typeFilter === "debits" && inv.originalAmount < 0) return false;
    return true;
  });

  const sorted = [...list];
  if (opts.sortColumn) {
    const dir = opts.sortDir === "desc" ? -1 : 1;
    sorted.sort((a, b) => {
      let r = 0;
      if (opts.sortColumn === "supplier") r = a.supplierName.localeCompare(b.supplierName);
      else if (opts.sortColumn === "date")
        r = parseAU(a.invoiceDate).getTime() - parseAU(b.invoiceDate).getTime();
      else if (opts.sortColumn === "amount") r = eff(a) - eff(b);
      else if (opts.sortColumn === "action")
        r =
          (ACTION_ORDER[a.reconciliationStatus] ?? 5) - (ACTION_ORDER[b.reconciliationStatus] ?? 5);
      return r * dir;
    });
  } else {
    // Default: actionable rows float to the top.
    sorted.sort(
      (a, b) =>
        (ACTION_ORDER[a.reconciliationStatus] ?? 5) - (ACTION_ORDER[b.reconciliationStatus] ?? 5) ||
        a.supplierName.localeCompare(b.supplierName),
    );
  }
  return sorted;
}

export function getSelectable(list: StatementLine[]) {
  return list.filter((i) => !(i.paid && i.reconciliationStatus === "reconciled"));
}

export function isPostable(i: StatementLine) {
  return (
    !i.syncedToXero &&
    (i.reconciliationStatus === "no_invoice" || i.reconciliationStatus === "pending_match")
  );
}

export function getCreditHealth(invoices: StatementLine[]) {
  const totalLiability = invoices.reduce((a, i) => a + i.balance, 0);
  const available = CREDIT_LIMIT - totalLiability;
  const rawPct = (totalLiability / CREDIT_LIMIT) * 100;
  const barColor =
    rawPct >= 95 ? "var(--destructive)" : rawPct >= 80 ? "var(--chart-4)" : "var(--primary)";
  const usedPct = Math.min(rawPct, 100);
  return {
    totalLiability,
    available,
    rawPct,
    barColor,
    usedPct,
    availablePct: Math.max(100 - usedPct, 0),
  };
}

export function getMonthlySpend(invoices: StatementLine[], now: Date) {
  const monthlySpend = invoices
    .filter((i) => i.type !== "Payment" && i.statementMonth === "2026-05")
    .reduce((a, i) => a + i.originalAmount, 0);
  const spendPct = Math.min((monthlySpend / LAST_MONTH_SPEND) * 100, 100);
  const spendShare = Math.round((monthlySpend / LAST_MONTH_SPEND) * 100);
  const spendDiff = LAST_MONTH_SPEND - monthlySpend;
  const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
  const daysLeft = Math.max(lastDay - now.getDate(), 0);
  const monthLabel = now.toLocaleString("en-AU", { month: "long" });
  return {
    monthlySpend,
    spendPct,
    spendShare,
    spendDiff,
    overUnder: spendDiff >= 0 ? "under" : "over",
    daysLeftLabel: `${daysLeft} ${daysLeft === 1 ? "day" : "days"} left in ${monthLabel}`,
  };
}

export function getFreshness(lastUpdated: number | null, fetching: boolean, now: number) {
  // `now` is 0 until the client clock subscribes; render the neutral resting state until then.
  if (lastUpdated === null || !now) {
    return {
      dotCls: "is-neutral",
      titleColor: "var(--foreground)",
      title: "Statement feed",
      sub: "",
      refreshLabel: "Refresh",
    };
  }
  const age = now - lastUpdated;
  const fresh = !fetching && age < 10 * 60 * 1000;
  const outdated = !fetching && age >= 12 * 60 * 60 * 1000;
  const rel = relTime(lastUpdated, now);
  return {
    dotCls: outdated ? "is-stale" : fresh ? "is-fresh" : "is-neutral",
    titleColor: outdated ? "var(--chart-4)" : "var(--foreground)",
    title: fetching
      ? "Fetching statement lines…"
      : fresh
        ? "Statement up to date"
        : "Statement feed",
    sub: fetching
      ? `Last updated ${rel}`
      : outdated
        ? `May be out of date — updated ${rel}`
        : fresh
          ? `Updated ${rel}`
          : `Last updated ${rel}`,
    refreshLabel: fetching ? "Fetching…" : "Refresh",
  };
}

/** Row view-model: amount presentation and reconciliation badge. */
export function getRowView(inv: StatementLine) {
  const isCredit = inv.originalAmount < 0 || inv.type === "Payment";
  return {
    isCredit,
    amountText: `${isCredit ? "(" : ""}${inv.originalAmount < 0 ? "-" : ""}$${fmt(
      inv.originalAmount,
    )}${isCredit ? ")" : ""}`,
    amountColor: isCredit ? "var(--destructive)" : "var(--foreground)",
    badgeSuccess: inv.xeroStatus === "matched" || inv.xeroStatus === "posted",
    badgeLabel: inv.xeroStatus === "posted" ? "Posted" : "Reconciled",
    tourAction: inv.reconciliationStatus === "unlinked" ? "link" : undefined,
  };
}

/**
 * Deterministic Xero match candidates. Only pending_match rows have any — a
 * no_invoice row gets an empty list and the modal forces the post-new path.
 */
export function xeroCandidatesFor(inv: StatementLine | undefined | null): MatchCandidate[] {
  if (!inv || inv.reconciliationStatus !== "pending_match") return [];
  const total = Math.abs(inv.balance);
  const h = hashStr(inv.id);
  const base = 40 + (h % 340);
  const baseDate = parseAU(inv.invoiceDate);
  const fractions = [1, 0.58, 0.43, 0.27, 0.14, 0.052];
  return fractions.map((f, i) => {
    const amt = Math.round(total * f * 100) / 100;
    const d = new Date(baseDate);
    d.setDate(d.getDate() - (i * 11 + (h % 6)));
    return { id: `x-${inv.id}-${i}`, ref: `PI-${base + i * ((h % 8) + 2)}`, date: fmtAU(d), total: amt };
  });
}

export function getEmptyState(searchQuery: string, reconFilter: ReconFilter) {
  const q = searchQuery.trim();
  if (q.length > 0)
    return { icon: "search", title: "No results found", body: `No statement lines match "${q}"` };
  if (reconFilter === "reconciled")
    return {
      icon: "check-circle",
      title: "Nothing reconciled yet",
      body: "Reconciled invoices will appear here once matched to your Xero account",
    };
  if (reconFilter === "unreconciled")
    return {
      icon: "circle-check-big",
      title: "All caught up",
      body: "Every statement line has been reconciled — nothing left to action",
    };
  return {
    icon: "inbox",
    title: "No statement lines",
    body: "No statement lines match your current filters",
  };
}

export { gstIncl };
