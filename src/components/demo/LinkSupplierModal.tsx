"use client";

import { useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { useDemoStore } from "@/lib/demo/store";
import { XERO_CONTACTS, PRODUCTS, SUPPLIERS } from "@/lib/demo/seed";
import type { StatementLine } from "@/lib/demo/types";

export function LinkSupplierModal({
  invoice,
  onClose,
}: {
  invoice: StatementLine | null;
  onClose: () => void;
}) {
  const linkSupplier = useDemoStore((s) => s.linkSupplier);
  const setPostingBehaviour = useDemoStore((s) => s.setPostingBehaviour);

  const [step, setStep] = useState<1 | 2>(1);
  const [contactId, setContactId] = useState<string | null>(null);
  const [productCode, setProductCode] = useState("");
  const [uploadMode, setUploadMode] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<string | null>(null);
  const [extracting, setExtracting] = useState(false);
  const [saving, setSaving] = useState(false);

  if (!invoice) return null;

  const supplier = SUPPLIERS.find((s) => s.name === invoice.supplierName);
  const isNonPreferred = supplier ? !supplier.preferred : false;

  function reset() {
    setStep(1);
    setContactId(null);
    setProductCode("");
    setUploadMode(false);
    setUploadedFile(null);
  }

  async function handleUpload(file: File) {
    setUploadedFile(file.name);
    setExtracting(true);
    // Simulated extraction — a real integration would OCR/parse the PDF; the demo fakes the
    // delay + result so the "no Xero contact yet" path still feels real without a parser.
    await new Promise((r) => setTimeout(r, 900));
    setExtracting(false);
    setContactId(XERO_CONTACTS[0].id);
  }

  async function handleContinue() {
    if (step === 1 && contactId) {
      setStep(2);
      return;
    }
    if (step === 2 && invoice && contactId) {
      setSaving(true);
      await linkSupplier(invoice.id, contactId);
      await setPostingBehaviour(invoice.id, productCode);
      setSaving(false);
      reset();
      onClose();
    }
  }

  return (
    <Dialog.Root
      open={!!invoice}
      onOpenChange={(open) => {
        if (!open) {
          reset();
          onClose();
        }
      }}
    >
      <Dialog.Portal>
        <Dialog.Overlay className="ss-modal-overlay" />
        <Dialog.Content className="ss-modal-content" aria-describedby={undefined}>
        <div className="ss-modal" style={{ maxWidth: 640 }}>
          <div style={{ padding: "20px 22px 16px", borderBottom: "1px solid var(--border)" }}>
            <Dialog.Title style={{ fontSize: 17, fontWeight: 600 }}>
              {step === 1 ? "Link supplier" : "Posting behaviour"}
            </Dialog.Title>
            <p style={{ fontSize: 12.5, color: "var(--muted-foreground)", marginTop: 4 }}>
              {invoice.supplierName} · {invoice.invoiceRef}
            </p>
          </div>

          <div style={{ padding: 20, overflowY: "auto" }}>
            {step === 1 && !uploadMode && (
              <div>
                <p style={{ fontSize: 12.5, color: "var(--muted-foreground)", marginBottom: 12 }}>
                  Match this statement supplier to a supplier in your Xero. Future statements from
                  them reconcile automatically.
                </p>
                <div style={{ border: "1px solid var(--border)", borderRadius: "var(--radius-md)", overflow: "hidden" }}>
                  {XERO_CONTACTS.map((c) => (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => setContactId(c.id)}
                      className="flex items-center gap-3 w-full text-left"
                      style={{
                        padding: "10px 14px",
                        borderTop: "1px solid var(--border)",
                        background: contactId === c.id ? "color-mix(in oklch, var(--primary) 7%, transparent)" : "transparent",
                      }}
                    >
                      <span
                        style={{
                          width: 16,
                          height: 16,
                          borderRadius: "50%",
                          border: `2px solid ${contactId === c.id ? "var(--primary)" : "var(--border)"}`,
                          flexShrink: 0,
                        }}
                      />
                      <span style={{ minWidth: 0 }}>
                        <div style={{ fontSize: 13, fontWeight: 600 }}>{c.name}</div>
                        <div style={{ fontSize: 11.5, color: "var(--muted-foreground)" }}>ABN {c.abn}</div>
                      </span>
                    </button>
                  ))}
                </div>

                {isNonPreferred && (
                  <div style={{ marginTop: 14 }}>
                    <p style={{ fontSize: 12, color: "var(--muted-foreground)", marginBottom: 8 }}>
                      Can&rsquo;t find them? This is a non-preferred supplier — upload their invoice
                      and we&rsquo;ll extract the supplier details.
                    </p>
                    <button type="button" className="ss-btn ss-btn--outline ss-btn--sm" onClick={() => setUploadMode(true)}>
                      Upload invoice PDF
                    </button>
                  </div>
                )}
              </div>
            )}

            {step === 1 && uploadMode && (
              <div>
                <button
                  type="button"
                  onClick={() => setUploadMode(false)}
                  style={{ fontSize: 12.5, color: "var(--primary)", marginBottom: 12, background: "none", border: "none" }}
                >
                  ← Back to search
                </button>
                <label
                  className="flex flex-col items-center justify-center gap-2 w-full"
                  style={{
                    border: "1px dashed var(--border)",
                    borderRadius: "var(--radius-md)",
                    padding: "28px 16px",
                    cursor: "pointer",
                    background: "var(--muted)",
                  }}
                >
                  <span style={{ fontSize: 13, fontWeight: 600 }}>
                    {uploadedFile ?? "Click to choose a PDF"}
                  </span>
                  <span style={{ fontSize: 11.5, color: "var(--muted-foreground)" }}>
                    Supplier name, ABN and default product are extracted automatically
                  </span>
                  <input
                    type="file"
                    accept="application/pdf"
                    className="sr-only"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleUpload(file);
                    }}
                  />
                </label>
                {extracting && (
                  <p style={{ fontSize: 12.5, color: "var(--muted-foreground)", marginTop: 10 }}>Extracting details…</p>
                )}
                {!extracting && contactId && uploadedFile && (
                  <div
                    style={{
                      marginTop: 12,
                      padding: "10px 12px",
                      borderRadius: "var(--radius-md)",
                      background: "color-mix(in oklch, var(--chart-1) 8%, transparent)",
                      border: "1px solid color-mix(in oklch, var(--chart-1) 26%, transparent)",
                      fontSize: 12.5,
                    }}
                  >
                    Matched to <strong>{XERO_CONTACTS.find((c) => c.id === contactId)?.name}</strong>
                  </div>
                )}
              </div>
            )}

            {step === 2 && (
              <div>
                <p style={{ fontSize: 12.5, color: "var(--muted-foreground)", marginBottom: 12 }}>
                  Pick the product you typically get from this supplier. We&rsquo;ll use its expense
                  code to categorise costs correctly.
                </p>
                <select
                  className="ss-select"
                  value={productCode}
                  onChange={(e) => setProductCode(e.target.value)}
                >
                  <option value="">Select a product…</option>
                  {PRODUCTS.map((p) => (
                    <option key={p.code} value={p.code}>
                      {p.name}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>

          <div
            style={{
              padding: "14px 20px",
              borderTop: "1px solid var(--border)",
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <button type="button" className="ss-btn ss-btn--ghost" onClick={() => (step === 2 ? setStep(1) : onClose())}>
              {step === 2 ? "Back" : "Cancel"}
            </button>
            <button
              type="button"
              className="ss-btn ss-btn--primary"
              onClick={handleContinue}
              disabled={(step === 1 && !contactId) || (step === 2 && !productCode) || saving}
            >
              {saving ? "Saving…" : step === 1 ? "Continue" : "Save & link"}
            </button>
          </div>
        </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
