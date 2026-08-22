"use client";

import { Send, X } from "lucide-react";
import { Modal } from "./Modal";
import { useDemoStore } from "@/lib/demo/store";
import { fmtFull } from "@/lib/demo/format";
import { POST_PRODUCTS } from "@/lib/demo/seed";
import { workspace as copy } from "@/content/demo";
import type { VerifyRow } from "@/lib/demo/types";

const overline: React.CSSProperties = {
  font: "var(--text-overline)",
  textTransform: "uppercase",
  letterSpacing: "0.06em",
  color: "var(--muted-foreground)",
  fontSize: 10,
};

function rowTotal(r: VerifyRow) {
  return Math.round((r.net + (parseFloat(String(r.tax)) || 0)) * 100) / 100;
}

export function VerifyPostModal() {
  const flow = useDemoStore((s) => s.verifyFlow);
  const rows = useDemoStore((s) => s.vRows);
  const taxFocus = useDemoStore((s) => s.vTaxFocus);
  const setTaxFocus = useDemoStore((s) => s.setVTaxFocus);
  const update = useDemoStore((s) => s.updateVerifyRow);
  const close = useDemoStore((s) => s.closeVerify);
  const confirm = useDemoStore((s) => s.confirmVerify);

  if (!flow) return null;

  const multi = rows.length > 1;
  const totalTax = rows.reduce((a, r) => a + (parseFloat(String(r.tax)) || 0), 0);
  const totalAmt = rows.reduce((a, r) => a + rowTotal(r), 0);
  const single = rows[0];

  const taxValue = (r: VerifyRow) =>
    taxFocus === r.id ? String(r.tax) : fmtFull(parseFloat(String(r.tax)) || 0);

  return (
    <Modal
      open
      onClose={close}
      title={copy.verify.title}
      cardStyle={{ width: 656, maxHeight: "88vh", display: "flex", flexDirection: "column" }}
    >
      <div style={{ padding: "24px 24px 20px", flexShrink: 0 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 16 }}>
          <div>
            <h2 style={{ font: "var(--text-h3)", color: "var(--foreground)", margin: "0 0 4px" }}>
              {copy.verify.title}
            </h2>
            <p style={{ font: "var(--text-small)", color: "var(--muted-foreground)", margin: 0 }}>
              {copy.verify.subtitle}
            </p>
          </div>
          <button
            type="button"
            className="icon-btn"
            style={{ width: 32, height: 32 }}
            onClick={close}
            aria-label="Close"
          >
            <X size={16} strokeWidth={1.75} />
          </button>
        </div>

        {multi && (
          <div
            style={{
              marginTop: 16,
              border: "1px solid var(--border)",
              borderRadius: "var(--radius-md)",
              overflow: "hidden",
              display: "flex",
            }}
          >
            {[
              [copy.verify.countLabel, String(rows.length), false],
              [copy.verify.totalTaxLabel, `$${fmtFull(totalTax)}`, true],
              [copy.verify.totalAmountLabel, `$${fmtFull(totalAmt)}`, true],
            ].map(([label, value, mono], i) => (
              <div
                key={String(label)}
                style={{
                  flex: 1,
                  padding: "10px 14px",
                  background: "var(--muted)",
                  borderRight: i < 2 ? "1px solid var(--border)" : undefined,
                }}
              >
                <p style={{ ...overline, margin: "0 0 2px" }}>{label}</p>
                <p
                  style={{
                    fontSize: 15,
                    fontWeight: 500,
                    margin: 0,
                    fontFamily: mono ? "var(--font-demo-mono)" : undefined,
                  }}
                >
                  {value}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

      {multi ? (
        <div
          style={{
            overflowY: "auto",
            flex: 1,
            border: "1px solid var(--border)",
            borderRadius: 6,
            margin: "0 24px 24px",
          }}
        >
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr>
                {[copy.verify.colSupplier, copy.verify.colProduct, copy.verify.colTax, copy.verify.colTotal].map(
                  (h, i) => (
                    <th
                      key={h}
                      style={{
                        ...overline,
                        padding: "9px 12px",
                        textAlign: i >= 2 ? "right" : "left",
                        background: "var(--muted)",
                        position: "sticky",
                        top: 0,
                        zIndex: 1,
                        borderBottom: "1px solid var(--border)",
                      }}
                    >
                      {h}
                    </th>
                  ),
                )}
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.id} style={{ borderBottom: "1px solid var(--border)" }}>
                  <td style={{ padding: "10px 12px", minWidth: 140 }}>
                    <div style={{ font: "var(--text-small)", fontWeight: 500, fontSize: 13 }}>{r.supplier}</div>
                    <div
                      style={{
                        fontFamily: "var(--font-demo-mono)",
                        fontSize: 11,
                        color: "var(--muted-foreground)",
                      }}
                    >
                      {r.ref}
                    </div>
                  </td>
                  <td style={{ padding: "10px 12px" }}>
                    <select
                      className="ss-select"
                      style={{ width: "100%", minWidth: 130, height: 32, fontSize: 12 }}
                      value={r.product}
                      onChange={(e) => update(r.id, "product", e.target.value)}
                      aria-label={copy.verify.colProduct}
                    >
                      {POST_PRODUCTS.map((p) => (
                        <option key={p} value={p}>
                          {p}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td style={{ padding: "10px 12px" }}>
                    <div style={{ position: "relative", width: 100, marginLeft: "auto" }}>
                      <span
                        style={{
                          position: "absolute",
                          left: 9,
                          top: "50%",
                          transform: "translateY(-50%)",
                          fontFamily: "var(--font-demo-mono)",
                          fontSize: 11,
                          color: "var(--muted-foreground)",
                        }}
                      >
                        $
                      </span>
                      <input
                        className="ss-text-input"
                        style={{
                          height: 32,
                          paddingLeft: 20,
                          fontFamily: "var(--font-demo-mono)",
                          fontSize: 11,
                          textAlign: "right",
                          width: "100%",
                        }}
                        value={taxValue(r)}
                        onFocus={() => setTaxFocus(r.id)}
                        onChange={(e) => update(r.id, "tax", e.target.value.replace(/[^0-9.]/g, ""))}
                        onBlur={() => {
                          update(r.id, "tax", (parseFloat(String(r.tax)) || 0).toFixed(2));
                          setTaxFocus(null);
                        }}
                        aria-label={`${copy.verify.colTax} ${r.ref}`}
                      />
                    </div>
                  </td>
                  <td
                    style={{
                      padding: "10px 12px",
                      textAlign: "right",
                      fontFamily: "var(--font-demo-mono)",
                      fontSize: 11,
                      fontWeight: 600,
                      whiteSpace: "nowrap",
                    }}
                  >
                    ${fmtFull(rowTotal(r))}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        single && (
          <div style={{ padding: "20px 24px", overflowY: "auto", flex: 1 }}>
            <div style={{ display: "flex", gap: 12, marginBottom: 20 }}>
              {[
                [copy.verify.supplierLabel, single.supplier, false],
                [copy.verify.transactionLabel, single.ref, true],
              ].map(([label, value, mono]) => (
                <div
                  key={String(label)}
                  style={{
                    flex: 1,
                    borderRadius: "var(--radius-md)",
                    padding: "12px 14px",
                    backgroundColor: "rgba(173,172,172,0.082)",
                  }}
                >
                  <p style={{ ...overline, margin: "0 0 4px" }}>{label}</p>
                  <p
                    style={{
                      fontSize: 13,
                      fontWeight: 600,
                      margin: 0,
                      fontFamily: mono ? "var(--font-demo-mono)" : undefined,
                    }}
                  >
                    {value}
                  </p>
                </div>
              ))}
            </div>

            <label style={{ display: "block", fontSize: 12, fontWeight: 600, marginBottom: 6 }}>
              {copy.verify.productLabel} <span style={{ color: "var(--destructive)" }}>*</span>
            </label>
            <select
              className="ss-select"
              style={{ width: "100%", height: 36, fontSize: 12 }}
              value={single.product}
              onChange={(e) => update(single.id, "product", e.target.value)}
            >
              {POST_PRODUCTS.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>

            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-end",
                gap: 20,
                marginTop: 20,
              }}
            >
              <div>
                <label style={{ display: "block", fontSize: 12, fontWeight: 600, marginBottom: 6 }}>
                  {copy.verify.taxLabel}
                </label>
                <div style={{ position: "relative", width: 258 }}>
                  <span
                    style={{
                      position: "absolute",
                      left: 9,
                      top: "50%",
                      transform: "translateY(-50%)",
                      fontFamily: "var(--font-demo-mono)",
                      fontSize: 11,
                      color: "var(--muted-foreground)",
                    }}
                  >
                    $
                  </span>
                  <input
                    className="ss-text-input"
                    style={{
                      height: 36,
                      paddingLeft: 22,
                      fontFamily: "var(--font-demo-mono)",
                      fontSize: 11,
                      fontWeight: 600,
                      textAlign: "right",
                    }}
                    value={taxValue(single)}
                    onFocus={() => setTaxFocus(single.id)}
                    onChange={(e) => update(single.id, "tax", e.target.value.replace(/[^0-9.]/g, ""))}
                    onBlur={() => {
                      update(single.id, "tax", (parseFloat(String(single.tax)) || 0).toFixed(2));
                      setTaxFocus(null);
                    }}
                    aria-label={copy.verify.taxLabel}
                  />
                </div>
              </div>
              <div style={{ textAlign: "right" }}>
                <p style={{ fontSize: 12, fontWeight: 600, color: "var(--muted-foreground)", margin: "0 0 2px" }}>
                  {copy.verify.transTotalLabel}
                </p>
                <p
                  style={{
                    fontFamily: "var(--font-demo-mono)",
                    fontWeight: 700,
                    fontSize: 20,
                    padding: "3px 0",
                    margin: 0,
                  }}
                >
                  ${fmtFull(rowTotal(single))}
                </p>
              </div>
            </div>
          </div>
        )
      )}

      <div
        style={{
          padding: "12px 24px",
          borderTop: "1px solid var(--border)",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <button type="button" className="btn btn-ghost btn-sm" onClick={close}>
          {copy.verify.cancel}
        </button>
        <button type="button" className="btn btn-primary btn-sm" onClick={confirm}>
          <Send size={14} strokeWidth={1.75} />
          Post {rows.length} transaction{rows.length !== 1 ? "s" : ""} to Xero
        </button>
      </div>
    </Modal>
  );
}
