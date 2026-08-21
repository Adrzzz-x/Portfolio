"use client";

import { useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { useDemoStore } from "@/lib/demo/store";
import { DISCREPANCY_CANDIDATE } from "@/lib/demo/seed";
import { formatCurrency } from "@/lib/demo/format";
import type { StatementLine } from "@/lib/demo/types";

export function MatchModal({ invoice, onClose }: { invoice: StatementLine | null; onClose: () => void }) {
  const matchInvoice = useDemoStore((s) => s.matchInvoice);
  const [writeOff, setWriteOff] = useState<"writeoff" | "leave" | null>(null);
  const [saving, setSaving] = useState(false);

  if (!invoice) return null;

  const isDiscrepancy = invoice.id === "inv-exc-discrepancy";
  const candidate = isDiscrepancy ? DISCREPANCY_CANDIDATE : null;
  const hasMismatch = candidate ? candidate.total !== invoice.balance : false;

  async function handleConfirm() {
    setSaving(true);
    await matchInvoice(invoice!.id, { candidateId: candidate?.id, writeOff: writeOff === "writeoff" });
    setSaving(false);
    setWriteOff(null);
    onClose();
  }

  const canConfirm = !hasMismatch || writeOff !== null;

  return (
    <Dialog.Root open={!!invoice} onOpenChange={(open) => !open && onClose()}>
      <Dialog.Portal>
        <Dialog.Overlay className="ss-modal-overlay" />
        <Dialog.Content className="ss-modal-content" aria-describedby={undefined}>
        <div className="ss-modal" style={{ maxWidth: 560 }}>
          <div style={{ padding: "20px 22px 16px", borderBottom: "1px solid var(--border)" }}>
            <Dialog.Title style={{ fontSize: 17, fontWeight: 600 }}>Review match</Dialog.Title>
            <p style={{ fontSize: 12.5, color: "var(--muted-foreground)", marginTop: 4 }}>
              {invoice.supplierName} · {invoice.invoiceRef}
            </p>
          </div>

          <div style={{ padding: 20 }}>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, marginBottom: 6 }}>
              <span style={{ color: "var(--muted-foreground)" }}>Statement amount</span>
              <span style={{ fontFamily: "var(--font-demo-mono)", fontWeight: 600 }}>
                {formatCurrency(invoice.balance)}
              </span>
            </div>

            {candidate ? (
              <>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, marginBottom: 14 }}>
                  <span style={{ color: "var(--muted-foreground)" }}>Xero candidate ({candidate.ref})</span>
                  <span style={{ fontFamily: "var(--font-demo-mono)", fontWeight: 600 }}>
                    {formatCurrency(candidate.total)}
                  </span>
                </div>
                {hasMismatch && (
                  <div
                    style={{
                      padding: "12px 14px",
                      borderRadius: "var(--radius-md)",
                      background: "color-mix(in oklch, var(--destructive) 8%, transparent)",
                      border: "1px solid color-mix(in oklch, var(--destructive) 28%, transparent)",
                      fontSize: 12.5,
                      marginBottom: 14,
                    }}
                  >
                    <div style={{ fontWeight: 600, marginBottom: 8 }}>
                      Amounts don&rsquo;t match — difference of{" "}
                      {formatCurrency(Math.abs(candidate.total - invoice.balance))}
                    </div>
                    <label className="flex items-center gap-2" style={{ marginBottom: 6 }}>
                      <input
                        type="radio"
                        name="writeoff"
                        checked={writeOff === "writeoff"}
                        onChange={() => setWriteOff("writeoff")}
                      />
                      Write off the difference
                    </label>
                    <label className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="writeoff"
                        checked={writeOff === "leave"}
                        onChange={() => setWriteOff("leave")}
                      />
                      Leave unaccounted for now
                    </label>
                  </div>
                )}
              </>
            ) : (
              <p style={{ fontSize: 12.5, color: "var(--muted-foreground)", marginBottom: 14 }}>
                No matching bill found in Xero for this line. Posting will create a new bill against
                the mapped product account.
              </p>
            )}

            <div
              style={{
                padding: "10px 12px",
                borderRadius: "var(--radius-md)",
                background: "var(--muted)",
                fontSize: 12,
                color: "var(--muted-foreground)",
              }}
            >
              This posts to Xero and can&rsquo;t be undone from here.
            </div>
          </div>

          <div style={{ padding: "14px 20px", borderTop: "1px solid var(--border)", display: "flex", justifyContent: "space-between" }}>
            <button type="button" className="ss-btn ss-btn--ghost" onClick={onClose}>
              Cancel
            </button>
            <button type="button" className="ss-btn ss-btn--primary" onClick={handleConfirm} disabled={!canConfirm || saving}>
              {saving ? "Posting…" : "Confirm & post to Xero"}
            </button>
          </div>
        </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
