"use client";

import { useDemoStore } from "@/lib/demo/store";
import { CREDIT_LIMIT, LAST_MONTH_SPEND } from "@/lib/demo/seed";
import { formatCurrency } from "@/lib/demo/format";
import { useFreshnessLabel } from "@/lib/demo/useFreshnessLabel";

export function CreditPanel() {
  const invoices = useDemoStore((s) => s.invoices);
  const fetching = useDemoStore((s) => s.fetching);
  const lastUpdated = useDemoStore((s) => s.lastUpdated);
  const refresh = useDemoStore((s) => s.refresh);

  const outstanding = invoices
    .filter((inv) => inv.reconciliationStatus !== "reconciled")
    .reduce((sum, inv) => sum + inv.balance, 0);
  const needsReview = invoices.filter((inv) => inv.reconciliationStatus !== "reconciled").length;

  const freshLabel = useFreshnessLabel(lastUpdated);

  return (
    <div className="ss-card" style={{ padding: "20px 22px" }}>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap gap-8">
          <div>
            <div style={{ fontSize: 10.5, fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase", color: "var(--muted-foreground)" }}>
              Trade account credit limit
            </div>
            <div style={{ fontFamily: "var(--font-demo-mono)", fontSize: 20, fontWeight: 600, marginTop: 4 }}>
              {formatCurrency(CREDIT_LIMIT)}
            </div>
          </div>
          <div>
            <div style={{ fontSize: 10.5, fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase", color: "var(--muted-foreground)" }}>
              Last month spend
            </div>
            <div style={{ fontFamily: "var(--font-demo-mono)", fontSize: 20, fontWeight: 600, marginTop: 4 }}>
              {formatCurrency(LAST_MONTH_SPEND)}
            </div>
          </div>
          <div>
            <div style={{ fontSize: 10.5, fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase", color: "var(--muted-foreground)" }}>
              Outstanding this statement
            </div>
            <div style={{ fontFamily: "var(--font-demo-mono)", fontSize: 20, fontWeight: 600, marginTop: 4 }}>
              {formatCurrency(outstanding)}
              <span style={{ fontSize: 12, fontWeight: 400, color: "var(--muted-foreground)", marginLeft: 8 }}>
                · {needsReview} need review
              </span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className="ss-badge ss-badge--muted">{freshLabel}</span>
          <button type="button" className="ss-btn ss-btn--outline ss-btn--sm" onClick={() => refresh()} disabled={fetching}>
            {fetching ? "Fetching…" : "Refresh"}
          </button>
        </div>
      </div>
    </div>
  );
}
