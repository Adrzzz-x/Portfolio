"use client";

import { Info } from "lucide-react";
import { useDemoStore } from "@/lib/demo/store";
import { getCreditHealth, getMonthlySpend } from "@/lib/demo/derive";
import { fmt, fmtFull } from "@/lib/demo/format";
import { CREDIT_LIMIT, LAST_MONTH_SPEND } from "@/lib/demo/seed";
import { workspace as copy } from "@/content/demo";

const overline: React.CSSProperties = {
  font: "var(--text-overline)",
  textTransform: "uppercase",
  letterSpacing: "0.06em",
  color: "var(--muted-foreground)",
};

const bigStat: React.CSSProperties = {
  font: "var(--text-display)",
  fontWeight: 700, // token is 600 but every usage in the design overrides to 700
  margin: 0,
};

export function CreditHealthPanel() {
  const invoices = useDemoStore((s) => s.invoices);
  const headerView = useDemoStore((s) => s.headerView);
  const setHeaderView = useDemoStore((s) => s.setHeaderView);

  const isCredit = headerView === "credit";
  const ch = getCreditHealth(invoices);
  const sp = getMonthlySpend(invoices, new Date());

  return (
    <div className="ss-card" id="tour-credit" style={{ padding: "22px 24px 20px" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          gap: 16,
          marginBottom: 18,
        }}
      >
        <div>
          <h2
            style={{
              font: "var(--text-h3)",
              color: "var(--foreground)",
              margin: "0 0 2px",
              letterSpacing: "-0.01em",
            }}
          >
            {isCredit ? copy.credit.title : copy.spend.title}
          </h2>
          <p style={{ font: "var(--text-caption)", color: "var(--muted-foreground)", margin: 0 }}>
            {isCredit ? copy.credit.subtitle : copy.spend.subtitle}
          </p>
        </div>
        <div className="view-pill" role="tablist">
          <button
            type="button"
            role="tab"
            aria-selected={!isCredit}
            className={!isCredit ? "is-active" : ""}
            onClick={() => setHeaderView("spend")}
          >
            {copy.spend.pillSpend}
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={isCredit}
            className={isCredit ? "is-active" : ""}
            onClick={() => setHeaderView("credit")}
          >
            {copy.spend.pillCredit}
          </button>
        </div>
      </div>

      {isCredit ? (
        <>
          <div style={{ marginBottom: 18 }}>
            <div className="credit-bar-track">
              <div
                className="credit-bar-fill"
                style={{ width: `${ch.usedPct}%`, background: ch.barColor }}
              />
              <div
                className="credit-bar-available"
                style={{ left: `${ch.usedPct}%`, width: `${ch.availablePct}%` }}
              />
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "baseline",
                marginTop: 8,
                gap: 12,
              }}
            >
              <span style={overline}>{copy.credit.usedLabel}</span>
              <span
                className="tnum"
                style={{
                  font: "var(--text-small)",
                  color: "var(--muted-foreground)",
                  fontWeight: 500,
                }}
              >
                ${fmtFull(ch.totalLiability)}
                <span style={{ color: "var(--border)", margin: "0 2px" }}>/</span>$
                {fmtFull(CREDIT_LIMIT)}
              </span>
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1px 1fr", alignItems: "stretch" }}>
            <div style={{ paddingRight: 32 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 5, marginBottom: 6 }}>
                <span style={{ font: "var(--text-small)", fontWeight: 600, color: "var(--foreground)" }}>
                  {copy.credit.liabilityLabel}
                </span>
                <Info size={13} strokeWidth={1.75} style={{ color: "var(--muted-foreground)" }} />
              </div>
              <p className="tnum" style={{ ...bigStat, color: ch.barColor }}>${fmt(ch.totalLiability)}</p>
              <p style={{ font: "var(--text-caption)", color: "var(--muted-foreground)", margin: "5px 0 0" }}>
                {copy.credit.liabilityCaption}
              </p>
            </div>
            <div style={{ background: "var(--border)", width: 1 }} />
            <div style={{ paddingLeft: 32 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 5, marginBottom: 6 }}>
                <span style={{ font: "var(--text-small)", fontWeight: 600, color: "var(--foreground)" }}>
                  {copy.credit.availableLabel}
                </span>
              </div>
              <p className="tnum" style={{ ...bigStat, color: "var(--chart-1)" }}>${fmt(ch.available)}</p>
              <p style={{ font: "var(--text-caption)", color: "var(--muted-foreground)", margin: "5px 0 0" }}>
                {copy.credit.availableCaption}
              </p>
            </div>
          </div>
        </>
      ) : (
        <>
          <div style={{ marginBottom: 18 }}>
            <div className="credit-bar-track">
              <div
                className="credit-bar-fill"
                style={{ width: `${sp.spendPct}%`, background: "var(--primary)" }}
              />
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "baseline",
                marginTop: 8,
                gap: 12,
              }}
            >
              <span style={overline}>Spent so far · {sp.spendShare}% of last month</span>
              <span
                style={{ font: "var(--text-small)", color: "var(--muted-foreground)", fontWeight: 500 }}
              >
                {sp.daysLeftLabel}
              </span>
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 5, marginBottom: 6 }}>
            <span style={{ font: "var(--text-small)", fontWeight: 600, color: "var(--foreground)" }}>
              {copy.spend.statLabel}
            </span>
            <Info size={13} strokeWidth={1.75} style={{ color: "var(--muted-foreground)" }} />
          </div>
          <div style={{ display: "flex", alignItems: "baseline", gap: 14, flexWrap: "wrap" }}>
            <p className="tnum" style={{ ...bigStat, color: "var(--primary)" }}>${fmt(sp.monthlySpend)}</p>
            <p
              style={{
                font: "var(--text-small)",
                color: "var(--muted-foreground)",
                margin: 0,
              }}
            >
              vs{" "}
              <span style={{ fontWeight: 600, color: "var(--foreground)" }}>
                ${fmtFull(LAST_MONTH_SPEND)}
              </span>{" "}
              last month
              <span style={{ color: "var(--border)", margin: "0 8px" }}>·</span>$
              {fmtFull(Math.abs(sp.spendDiff))} {sp.overUnder}
            </p>
          </div>
        </>
      )}
    </div>
  );
}
