"use client";

import { useState } from "react";
import Link from "next/link";
import { useDemoStore } from "@/lib/demo/store";
import { ACCOUNTS, CREDIT_LIMIT } from "@/lib/demo/seed";
import { Toast } from "./Toast";

function Toggle({ on, onClick, label, description }: { on: boolean; onClick: () => void; label: string; description: string }) {
  return (
    <div
      className="flex items-start justify-between gap-5"
      style={{ padding: "15px 0", borderBottom: "1px solid color-mix(in oklch, var(--border) 60%, transparent)" }}
    >
      <div>
        <div style={{ fontSize: 13.5, fontWeight: 600, marginBottom: 3 }}>{label}</div>
        <div style={{ fontSize: 12, color: "var(--muted-foreground)" }}>{description}</div>
      </div>
      <button
        type="button"
        onClick={onClick}
        aria-pressed={on}
        style={{
          width: 42,
          height: 24,
          borderRadius: 999,
          border: "none",
          background: on ? "var(--primary)" : "var(--input)",
          position: "relative",
          flexShrink: 0,
        }}
      >
        <span
          style={{
            position: "absolute",
            top: 3,
            left: on ? 21 : 3,
            width: 18,
            height: 18,
            borderRadius: 999,
            background: "#fff",
            transition: "left .18s",
          }}
        />
      </button>
    </div>
  );
}

export function SettingsPanel() {
  const notify = useDemoStore((s) => s.notify);
  const [xeroEnabled, setXeroEnabled] = useState(true);
  const [enablePayments, setEnablePayments] = useState(true);
  const [repayOnPayment, setRepayOnPayment] = useState(false);
  const [creditLimit, setCreditLimit] = useState(String(CREDIT_LIMIT));
  const [liabilityAccount, setLiabilityAccount] = useState(ACCOUNTS[0].code);

  return (
    <>
      <header className="ss-hd">
        <Link href="/demo" className="ss-back">
          ← Trade account
        </Link>
      </header>
      <div className="ss-page" style={{ maxWidth: 720 }}>
        <div style={{ marginBottom: 24 }}>
          <div style={{ fontSize: 22, fontWeight: 700, letterSpacing: "-0.01em" }}>SwiftStatement settings</div>
          <p style={{ fontSize: 13, color: "var(--muted-foreground)", marginTop: 4 }}>
            Control how trade account statements reconcile and post to Xero.
          </p>
        </div>

        <div className="ss-card" style={{ padding: "20px 22px" }}>
          <div style={{ fontSize: 10.5, fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase", color: "var(--muted-foreground)", marginBottom: 4 }}>
            Features
          </div>
          <Toggle
            on={xeroEnabled}
            onClick={() => setXeroEnabled((v) => !v)}
            label="Xero connection enabled"
            description="Show the Xero import panel, reconciliation column, and reconciliation filters"
          />
          <Toggle
            on={enablePayments}
            onClick={() => setEnablePayments((v) => !v)}
            label="Payments enabled"
            description="Show payment functionality and the sticky payment footer"
          />
          <Toggle
            on={repayOnPayment}
            onClick={() => setRepayOnPayment((v) => !v)}
            label="Repay on payment"
            description="Automatically clear the trade account liability when a bill is paid"
          />

          <div style={{ fontSize: 10.5, fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase", color: "var(--muted-foreground)", margin: "20px 0 14px" }}>
            Credit line
          </div>
          <div style={{ marginBottom: 16 }}>
            <label style={{ fontSize: 13, fontWeight: 500, display: "block", marginBottom: 6 }}>
              Trade account credit limit
            </label>
            <input
              className="ss-input"
              style={{ maxWidth: 260 }}
              inputMode="numeric"
              value={creditLimit}
              onChange={(e) => setCreditLimit(e.target.value.replace(/[^\d]/g, ""))}
            />
          </div>
          <div style={{ marginBottom: 20 }}>
            <label style={{ fontSize: 13, fontWeight: 500, display: "block", marginBottom: 6 }}>
              Xero liability account
            </label>
            <select
              className="ss-select"
              style={{ maxWidth: 320 }}
              value={liabilityAccount}
              onChange={(e) => setLiabilityAccount(e.target.value)}
            >
              {ACCOUNTS.map((a) => (
                <option key={a.code} value={a.code}>
                  {a.name}
                </option>
              ))}
            </select>
          </div>

          <div style={{ fontSize: 10.5, fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase", color: "var(--muted-foreground)", marginBottom: 12 }}>
            Mappings
          </div>
          <Link
            href="/demo/settings/mappings"
            className="flex items-center gap-3.5"
            style={{ padding: 16, border: "1px solid var(--border)", borderRadius: "var(--radius)" }}
          >
            <span style={{ flex: 1 }}>
              <span style={{ display: "block", fontSize: 13.5, fontWeight: 600 }}>Supplier & product mappings</span>
              <span style={{ display: "block", fontSize: 12, color: "var(--muted-foreground)", marginTop: 2 }}>
                Map suppliers to default products, and products to Xero accounts.
              </span>
            </span>
            <span className="ss-btn ss-btn--outline ss-btn--sm">Manage →</span>
          </Link>
        </div>

        <div className="flex items-center justify-between" style={{ marginTop: 16 }}>
          <span style={{ fontSize: 12, color: "var(--muted-foreground)" }}>Changes apply to your trade account statement</span>
          <button type="button" className="ss-btn ss-btn--primary" onClick={() => notify("SwiftStatement settings saved")}>
            Save changes
          </button>
        </div>
      </div>
      <Toast />
    </>
  );
}
