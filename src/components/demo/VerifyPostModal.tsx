"use client";

import { useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { useDemoStore } from "@/lib/demo/store";
import { formatCurrency } from "@/lib/demo/format";
import type { StatementLine } from "@/lib/demo/types";

export function VerifyPostModal({
  open,
  invoices,
  onClose,
}: {
  open: boolean;
  invoices: StatementLine[];
  onClose: () => void;
}) {
  const reconcileSelected = useDemoStore((s) => s.reconcileSelected);
  const [saving, setSaving] = useState(false);

  const total = invoices.reduce((sum, inv) => sum + inv.balance, 0);

  async function handleConfirm() {
    setSaving(true);
    await reconcileSelected(invoices.map((inv) => inv.id));
    setSaving(false);
    onClose();
  }

  return (
    <Dialog.Root open={open} onOpenChange={(o) => !o && onClose()}>
      <Dialog.Portal>
        <Dialog.Overlay className="ss-modal-overlay" />
        <Dialog.Content className="ss-modal-content" aria-describedby={undefined}>
        <div className="ss-modal" style={{ maxWidth: 640 }}>
          <div style={{ padding: "20px 22px 16px", borderBottom: "1px solid var(--border)" }}>
            <Dialog.Title style={{ fontSize: 17, fontWeight: 600 }}>
              Post {invoices.length} invoice{invoices.length !== 1 ? "s" : ""} to Xero
            </Dialog.Title>
          </div>

          <div style={{ padding: 20, overflowY: "auto", maxHeight: 320 }}>
            <table className="ss-table">
              <thead>
                <tr>
                  <th>Supplier</th>
                  <th>Ref</th>
                  <th style={{ textAlign: "right" }}>Amount</th>
                </tr>
              </thead>
              <tbody>
                {invoices.map((inv) => (
                  <tr key={inv.id}>
                    <td>{inv.supplierName}</td>
                    <td style={{ fontFamily: "var(--font-demo-mono)" }}>{inv.invoiceRef}</td>
                    <td style={{ textAlign: "right", fontFamily: "var(--font-demo-mono)" }}>
                      {formatCurrency(inv.balance)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div style={{ display: "flex", justifyContent: "space-between", marginTop: 14, fontSize: 13.5, fontWeight: 600 }}>
              <span>Total</span>
              <span style={{ fontFamily: "var(--font-demo-mono)" }}>{formatCurrency(total)}</span>
            </div>
            <div
              style={{
                marginTop: 16,
                padding: "12px 14px",
                borderRadius: "var(--radius-md)",
                background: "color-mix(in oklch, var(--destructive) 8%, transparent)",
                border: "1px solid color-mix(in oklch, var(--destructive) 28%, transparent)",
                fontSize: 12.5,
                fontWeight: 600,
              }}
            >
              This posts every line above to Xero and can&rsquo;t be undone from here.
            </div>
          </div>

          <div style={{ padding: "14px 20px", borderTop: "1px solid var(--border)", display: "flex", justifyContent: "space-between" }}>
            <button type="button" className="ss-btn ss-btn--ghost" onClick={onClose}>
              Cancel
            </button>
            <button type="button" className="ss-btn ss-btn--primary" onClick={handleConfirm} disabled={saving}>
              {saving ? "Posting…" : `Post ${invoices.length} to Xero`}
            </button>
          </div>
        </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
