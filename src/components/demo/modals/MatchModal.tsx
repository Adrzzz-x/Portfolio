"use client";

import { useMemo } from "react";
import { AlertCircle, CornerDownRight, FilePlus, Link2, X } from "lucide-react";
import { Modal } from "./Modal";
import { useDemoStore } from "@/lib/demo/store";
import { xeroCandidatesFor } from "@/lib/demo/derive";
import { fmtFull, gstIncl } from "@/lib/demo/format";
import { MATCH_SUPPLIERS, POST_PRODUCTS, POST_PRODUCT_ACCOUNTS } from "@/lib/demo/seed";
import { workspace as copy } from "@/content/demo";

const overline: React.CSSProperties = {
  font: "var(--text-overline)",
  textTransform: "uppercase",
  letterSpacing: "0.06em",
  color: "var(--muted-foreground)",
};

const detailRow: React.CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "baseline",
  gap: 16,
  padding: "9px 0",
  borderBottom: "1px solid color-mix(in oklch, var(--border) 50%, transparent)",
};

function num(v: string) {
  return parseFloat(v.replace(/[^0-9.]/g, "")) || 0;
}

export function MatchModal() {
  const flow = useDemoStore((s) => s.matchFlow);
  const mMode = useDemoStore((s) => s.mMode);
  const mSelId = useDemoStore((s) => s.mSelId);
  const mSearch = useDemoStore((s) => s.mSearch);
  const mResolution = useDemoStore((s) => s.mResolution);
  const mProduct = useDemoStore((s) => s.mProduct);
  const mTax = useDemoStore((s) => s.mTax);
  const mTotal = useDemoStore((s) => s.mTotal);
  const mPreview = useDemoStore((s) => s.mPreview);
  const setMatchMode = useDemoStore((s) => s.setMatchMode);
  const setMatchSel = useDemoStore((s) => s.setMatchSel);
  const setMatchSearch = useDemoStore((s) => s.setMatchSearch);
  const setResolution = useDemoStore((s) => s.setResolution);
  const setMProduct = useDemoStore((s) => s.setMProduct);
  const setMTax = useDemoStore((s) => s.setMTax);
  const setMTotal = useDemoStore((s) => s.setMTotal);
  const setPreview = useDemoStore((s) => s.setPreview);
  const close = useDemoStore((s) => s.closeMatch);
  const confirmMatch = useDemoStore((s) => s.confirmMatch);
  const confirmPostNew = useDemoStore((s) => s.confirmPostNew);

  const inv = flow?.inv;
  const cands = useMemo(() => xeroCandidatesFor(inv), [inv]);

  if (!inv) return null;

  const canMatch = cands.length > 0;
  const isMatch = mMode === "match";
  const stmtTotal = Math.abs(inv.balance);
  const stmtGst = gstIncl(stmtTotal);
  const stmtSub = Math.round((stmtTotal - stmtGst) * 100) / 100;
  const sup = MATCH_SUPPLIERS[inv.supplierName];

  const q = mSearch.trim().toLowerCase();
  const shown = cands.filter(
    (c) => !q || c.ref.toLowerCase().includes(q) || fmtFull(c.total).includes(q),
  );
  const sel = cands.find((c) => c.id === mSelId);
  const diff = sel ? Math.round((stmtTotal - sel.total) * 100) / 100 : 0;
  const mismatch = !!sel && Math.abs(diff) >= 0.01;

  const postSub = Math.max(0, Math.round((mTotal - mTax) * 100) / 100);
  const taxError =
    mTax < 0
      ? "Enter a tax amount of $0.00 or more"
      : mTax > mTotal + 0.005
        ? `Tax can't be more than the total ($${fmtFull(mTotal)})`
        : "";
  const canPost = !!mProduct && !taxError;
  const acct = mProduct ? POST_PRODUCT_ACCOUNTS[mProduct] : null;

  return (
    <>
      <Modal
        open
        onClose={close}
        title={copy.match.title}
        cardStyle={{
          width: "min(90vw, 1075px)",
          maxHeight: "87vh",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            padding: "20px 26px 16px",
            borderBottom: "1px solid var(--border)",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            gap: 16,
          }}
        >
          <div>
            <h2 style={{ font: "var(--text-h3)", color: "var(--foreground)", margin: "0 0 4px" }}>
              {copy.match.title}
            </h2>
            <p
              style={{
                font: "var(--text-caption)",
                color: "var(--muted-foreground)",
                margin: 0,
                maxWidth: 560,
              }}
            >
              {canMatch
                ? copy.match.subWithCandidates
                : `${inv.supplierName} has no unreconciled invoices in Xero to match against, so we'll post this line as a new invoice.`}
            </p>
          </div>
          <button type="button" className="icon-btn" onClick={close} aria-label="Close">
            <X size={16} strokeWidth={1.75} />
          </button>
        </div>

        <div style={{ flex: 1, display: "flex", minHeight: 0, overflow: "hidden" }}>
          {/* Left: statement line */}
          <div
            style={{
              width: 409,
              flexShrink: 0,
              borderRight: "1px solid var(--border)",
              overflowY: "auto",
              display: "flex",
              flexDirection: "column",
              gap: 18,
              padding: "14px 26px 22px",
            }}
          >
            <div>
              <p style={{ ...overline, margin: "0 0 6px" }}>{copy.match.statementLine}</p>
              <p style={{ font: "var(--text-body)", fontWeight: 600, margin: 0, fontSize: 14 }}>
                {inv.supplierName}
              </p>
              {sup && (
                <div style={{ display: "flex", flexWrap: "wrap", gap: "3px 14px", marginTop: 6 }}>
                  {[`Account ${sup.refId}`, `ABN ${sup.abn}`, sup.phone].map((t) => (
                    <span key={t} style={{ fontSize: 12, fontWeight: 500, color: "var(--muted-foreground)" }}>
                      {t}
                    </span>
                  ))}
                </div>
              )}
            </div>

            <div
              style={{
                background: "var(--muted)",
                border: "1px solid var(--border)",
                borderRadius: "var(--radius)",
                padding: "16px 18px",
                display: "flex",
                justifyContent: "space-between",
                gap: 12,
              }}
            >
              <div>
                <p style={{ font: "var(--text-caption)", color: "var(--muted-foreground)", margin: 0 }}>
                  {inv.type}
                </p>
                <p style={{ fontSize: 13, fontWeight: 600, margin: "2px 0 0" }}>
                  Trade supply — {inv.statementPeriod}
                </p>
              </div>
              <div style={{ textAlign: "right" }}>
                <p style={{ font: "var(--text-caption)", color: "var(--muted-foreground)", margin: 0 }}>
                  {copy.match.amountOnStatement}
                </p>
                <p
                  style={{
                    font: "600 1.5rem/1.2 var(--font-demo-sans)",
                    margin: "2px 0 0",
                  }}
                >
                  ${fmtFull(stmtTotal)}
                </p>
              </div>
            </div>

            <div>
              {[
                [copy.match.invoiceRef, inv.invoiceRef, true],
                [copy.match.invoiceDate, inv.invoiceDate, false],
                [copy.match.dueDate, inv.dueDate, false],
                [copy.match.statementPeriod, inv.statementPeriod, false],
              ].map(([label, value, mono], i, arr) => (
                <div
                  key={String(label)}
                  style={i === arr.length - 1 ? { ...detailRow, borderBottom: "none" } : detailRow}
                >
                  <span style={{ font: "var(--text-small)", color: "var(--muted-foreground)" }}>{label}</span>
                  <span
                    style={{
                      font: "var(--text-small)",
                      fontWeight: 500,
                      fontFamily: mono ? "var(--font-demo-mono)" : undefined,
                    }}
                  >
                    {value}
                  </span>
                </div>
              ))}
            </div>

            <div>
              {[
                [copy.match.subtotal, stmtSub],
                [copy.match.tax, stmtGst],
              ].map(([label, value]) => (
                <div
                  key={String(label)}
                  style={{ display: "flex", justifyContent: "space-between", padding: "5px 0" }}
                >
                  <span style={{ font: "var(--text-small)", color: "var(--muted-foreground)" }}>{label}</span>
                  <span
                    style={{
                      font: "var(--text-small)",
                      fontWeight: 500,
                      fontFamily: "var(--font-demo-mono)",
                    }}
                  >
                    ${fmtFull(value as number)}
                  </span>
                </div>
              ))}
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  padding: "8px 0 0",
                  marginTop: 4,
                  borderTop: "1px solid var(--border)",
                }}
              >
                <span style={{ fontSize: 13, fontWeight: 700 }}>{copy.match.total}</span>
                <span
                  style={{
                    fontSize: 13,
                    fontWeight: 700,
                    fontFamily: "var(--font-demo-mono)",
                  }}
                >
                  ${fmtFull(stmtTotal)}
                </span>
              </div>
            </div>
          </div>

          {/* Right: match vs post-new */}
          <div
            style={{
              flex: 1,
              minWidth: 0,
              display: "flex",
              flexDirection: "column",
              minHeight: 0,
              background: "color-mix(in oklch, var(--muted) 35%, transparent)",
            }}
          >
            <div style={{ padding: "14px 24px 0", display: "flex", gap: 12 }}>
              <button
                type="button"
                className={`path-tab ${isMatch ? "on" : ""}`}
                disabled={!canMatch}
                onClick={() => canMatch && setMatchMode("match")}
              >
                <Link2
                  size={20}
                  strokeWidth={1.75}
                  style={{
                    color: isMatch
                      ? "var(--primary)"
                      : canMatch
                        ? "var(--foreground)"
                        : "var(--muted-foreground)",
                  }}
                />
                <span>
                  <span
                    style={{
                      display: "block",
                      fontSize: 17,
                      fontWeight: 700,
                      letterSpacing: "-0.01em",
                      lineHeight: 1.2,
                    }}
                  >
                    {copy.match.tabMatchTitle}
                  </span>
                  <span
                    style={{
                      display: "block",
                      font: "var(--text-small)",
                      color: "var(--muted-foreground)",
                      marginTop: 4,
                    }}
                  >
                    {canMatch ? copy.match.tabMatchSubAvailable : copy.match.tabMatchSubNone}
                  </span>
                </span>
              </button>
              <button
                type="button"
                className={`path-tab ${!isMatch ? "on" : ""}`}
                onClick={() => setMatchMode("postnew")}
              >
                <FilePlus
                  size={20}
                  strokeWidth={1.75}
                  style={{ color: !isMatch ? "var(--primary)" : "var(--foreground)" }}
                />
                <span>
                  <span
                    style={{
                      display: "block",
                      fontSize: 17,
                      fontWeight: 700,
                      letterSpacing: "-0.01em",
                      lineHeight: 1.2,
                    }}
                  >
                    {copy.match.tabPostTitle}
                  </span>
                  <span
                    style={{
                      display: "block",
                      font: "var(--text-small)",
                      color: "var(--muted-foreground)",
                      marginTop: 4,
                    }}
                  >
                    {copy.match.tabPostSub}
                  </span>
                </span>
              </button>
            </div>

            {isMatch ? (
              <div style={{ display: "flex", flexDirection: "column", minHeight: 0, flex: 1 }}>
                <div
                  style={{
                    padding: "12px 24px 10px",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    gap: 12,
                  }}
                >
                  <p style={{ font: "var(--text-small)", margin: 0 }}>
                    Unreconciled invoices from <strong>{inv.supplierName}</strong>
                  </p>
                  <span
                    style={{
                      padding: "2px 8px",
                      borderRadius: "var(--radius-full)",
                      background: "color-mix(in oklch, var(--primary) 10%, transparent)",
                      border: "1px solid color-mix(in oklch, var(--primary) 20%, transparent)",
                      font: "var(--text-caption)",
                      fontWeight: 600,
                      color: "var(--primary)",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {cands.length} potential invoice matches
                  </span>
                </div>

                {cands.length > 4 && (
                  <div style={{ padding: "0 24px 10px" }}>
                    <input
                      className="ss-search"
                      style={{ paddingLeft: 12 }}
                      placeholder={copy.match.candidateSearchPlaceholder}
                      value={mSearch}
                      onChange={(e) => setMatchSearch(e.target.value)}
                    />
                  </div>
                )}

                <div style={{ padding: "0 24px 16px", overflowY: "auto", flex: 1, minHeight: 0 }}>
                  <div
                    style={{
                      background: "var(--card)",
                      border: "1px solid var(--border)",
                      borderRadius: "var(--radius-md)",
                      overflow: "hidden",
                    }}
                  >
                    <table className="ss-table match-list">
                      <thead>
                        <tr>
                          <th style={{ width: 38 }} />
                          <th>{copy.match.colRef}</th>
                          <th>{copy.match.colDate}</th>
                          <th style={{ textAlign: "right" }}>{copy.match.colTotal}</th>
                          <th style={{ textAlign: "right" }}>{copy.match.colAction}</th>
                        </tr>
                      </thead>
                      <tbody>
                        {shown.map((c) => {
                          const isPotential =
                            c.ref === inv.invoiceRef || Math.abs(c.total - stmtTotal) < 0.01;
                          return (
                            <tr
                              key={c.id}
                              className={`ss-tr ${mSelId === c.id ? "is-selected" : ""}`}
                              style={{ cursor: "pointer" }}
                              onClick={() => setMatchSel(c.id)}
                            >
                              <td>
                                <span className={`mradio ${mSelId === c.id ? "on" : ""}`} />
                              </td>
                              <td>
                                <span
                                  style={{
                                    fontFamily: "var(--font-demo-mono)",
                                    fontWeight: 600,
                                    color: "var(--primary)",
                                  }}
                                >
                                  {c.ref}
                                </span>
                                {isPotential && (
                                  <span
                                    style={{
                                      marginLeft: 8,
                                      padding: "1px 8px",
                                      borderRadius: "var(--radius-full)",
                                      background: "color-mix(in oklch, var(--primary) 12%, transparent)",
                                      border: "1px solid color-mix(in oklch, var(--primary) 25%, transparent)",
                                      font: "var(--text-caption)",
                                      fontWeight: 600,
                                      color: "var(--primary)",
                                      verticalAlign: "middle",
                                    }}
                                  >
                                    {copy.match.potentialMatch}
                                  </span>
                                )}
                              </td>
                              <td style={{ color: "var(--muted-foreground)", whiteSpace: "nowrap" }}>
                                {c.date}
                              </td>
                              <td
                                style={{
                                  textAlign: "right",
                                  fontFamily: "var(--font-demo-mono)",
                                  fontWeight: 600,
                                }}
                              >
                                ${fmtFull(c.total)}
                              </td>
                              <td style={{ textAlign: "right" }}>
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setPreview(c);
                                  }}
                                  style={{
                                    background: "none",
                                    border: "none",
                                    color: "var(--primary)",
                                    font: "var(--text-small)",
                                    fontWeight: 600,
                                    cursor: "pointer",
                                  }}
                                >
                                  {copy.match.preview}
                                </button>
                              </td>
                            </tr>
                          );
                        })}
                        {shown.length === 0 && (
                          <tr>
                            <td
                              colSpan={5}
                              style={{
                                textAlign: "center",
                                padding: "40px 16px",
                                color: "var(--muted-foreground)",
                                font: "var(--text-small)",
                              }}
                            >
                              {copy.match.candidateEmpty}
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>

                {mismatch && (
                  <div
                    style={{
                      flexShrink: 0,
                      borderTop: "1px solid var(--border)",
                      background: "var(--muted)",
                      padding: "14px 24px 16px",
                      display: "flex",
                      gap: 8,
                    }}
                  >
                    <button
                      type="button"
                      className={`resolve-opt ${mResolution === "writeoff" ? "on" : ""}`}
                      onClick={() => setResolution("writeoff")}
                    >
                      <span className={`mradio ${mResolution === "writeoff" ? "on" : ""}`} />
                      <span>
                        <span
                          style={{
                            display: "block",
                            font: "var(--text-small)",
                            fontWeight: 600,
                            color: "var(--foreground)",
                          }}
                        >
                          {copy.match.writeOffTitle}
                        </span>
                        <span
                          style={{
                            display: "block",
                            font: "var(--text-caption)",
                            color: "var(--muted-foreground)",
                            marginTop: 2,
                          }}
                        >
                          We&rsquo;ll post a ${fmtFull(Math.abs(diff))} adjustment so this matches in full.
                        </span>
                      </span>
                    </button>
                    <button
                      type="button"
                      className={`resolve-opt ${mResolution === "nothing" ? "on" : ""}`}
                      onClick={() => setResolution("nothing")}
                    >
                      <span className={`mradio ${mResolution === "nothing" ? "on" : ""}`} />
                      <span>
                        <span
                          style={{
                            display: "block",
                            font: "var(--text-small)",
                            fontWeight: 600,
                            color: "var(--foreground)",
                          }}
                        >
                          {copy.match.leaveTitle}
                        </span>
                        <span
                          style={{
                            display: "block",
                            font: "var(--text-caption)",
                            color: "var(--muted-foreground)",
                            marginTop: 2,
                          }}
                        >
                          {copy.match.leaveBody}
                        </span>
                      </span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div
                style={{
                  padding: "16px 24px 20px",
                  display: "flex",
                  flexDirection: "column",
                  gap: 16,
                  overflowY: "auto",
                }}
              >
                <div
                  style={{
                    background: "var(--card)",
                    border: "1px solid var(--border)",
                    borderRadius: "var(--radius)",
                    padding: "14px 16px",
                  }}
                >
                  <label style={{ display: "block", font: "var(--text-label)", fontWeight: 600, marginBottom: 8 }}>
                    {copy.match.productLabel} <span style={{ color: "var(--destructive)" }}>*</span>
                  </label>
                  <select
                    className="ss-select"
                    style={{ width: "100%", height: 38 }}
                    value={mProduct}
                    onChange={(e) => setMProduct(e.target.value)}
                  >
                    <option value="">{copy.match.productPlaceholder}</option>
                    {POST_PRODUCTS.map((p) => (
                      <option key={p} value={p}>
                        {p}
                      </option>
                    ))}
                  </select>
                  <p style={{ font: "var(--text-caption)", color: "var(--muted-foreground)", marginTop: 8 }}>
                    {copy.match.productHelp}
                  </p>
                  {acct && (
                    <div
                      style={{
                        marginTop: 12,
                        paddingTop: 12,
                        borderTop: "1px solid var(--border)",
                        display: "flex",
                        alignItems: "center",
                        gap: 10,
                      }}
                    >
                      <CornerDownRight size={15} strokeWidth={1.75} style={{ color: "var(--muted-foreground)" }} />
                      <div>
                        <p style={{ ...overline, margin: "0 0 2px" }}>{copy.match.postsToAccount}</p>
                        <p style={{ font: "var(--text-small)", fontWeight: 600, margin: 0 }}>
                          <span style={{ fontFamily: "var(--font-demo-mono)" }}>{acct.expenseCode}</span> ·{" "}
                          {acct.expenseName}
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                <div
                  style={{
                    background: "var(--card)",
                    border: "1px solid var(--border)",
                    borderRadius: "var(--radius)",
                    padding: "14px 16px",
                  }}
                >
                  <p style={{ ...overline, margin: "0 0 2px" }}>{copy.match.invoiceAmount}</p>
                  <p style={{ font: "var(--text-caption)", color: "var(--muted-foreground)", margin: "0 0 12px" }}>
                    {copy.match.invoiceAmountHelp}
                  </p>
                  <div style={{ display: "flex", justifyContent: "space-between", padding: "5px 0" }}>
                    <span style={{ font: "var(--text-small)", color: "var(--muted-foreground)" }}>
                      {copy.match.subtotal}
                    </span>
                    <span
                      style={{
                        font: "var(--text-small)",
                        fontFamily: "var(--font-demo-mono)",
                      }}
                    >
                      ${fmtFull(postSub)}
                    </span>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      padding: "5px 0",
                    }}
                  >
                    <span style={{ font: "var(--text-small)", color: "var(--muted-foreground)" }}>
                      {copy.match.tax}
                    </span>
                    <div style={{ position: "relative", width: 168 }}>
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
                          textAlign: "right",
                          fontFamily: "var(--font-demo-mono)",
                          fontWeight: 500,
                        }}
                        value={String(mTax)}
                        onChange={(e) => setMTax(num(e.target.value))}
                        aria-label={copy.match.tax}
                      />
                    </div>
                  </div>
                  {taxError && (
                    <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 4 }}>
                      <AlertCircle size={13} strokeWidth={1.75} style={{ color: "var(--destructive)" }} />
                      <span style={{ font: "var(--text-caption)", color: "var(--destructive)" }}>{taxError}</span>
                    </div>
                  )}
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      padding: "10px 0 0",
                      marginTop: 6,
                      borderTop: "1px solid var(--border)",
                    }}
                  >
                    <span style={{ fontSize: 13, fontWeight: 700 }}>{copy.match.total}</span>
                    <div style={{ position: "relative", width: 168 }}>
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
                          textAlign: "right",
                          fontFamily: "var(--font-demo-mono)",
                          fontWeight: 700,
                        }}
                        value={String(mTotal)}
                        onChange={(e) => setMTotal(num(e.target.value))}
                        aria-label={copy.match.total}
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        <div
          style={{
            padding: "14px 26px",
            borderTop: "1px solid var(--border)",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <button type="button" className="btn btn-ghost btn-md" onClick={close}>
            {copy.match.cancel}
          </button>
          {isMatch ? (
            <button
              type="button"
              className="btn btn-primary btn-md"
              onClick={confirmMatch}
              style={{ opacity: sel ? 1 : 0.5 }}
            >
              <Link2 size={15} strokeWidth={1.75} />
              {sel ? copy.match.reconcileCta : copy.match.reconcileCtaDisabled}
            </button>
          ) : (
            <button
              type="button"
              className="btn btn-primary btn-md"
              onClick={confirmPostNew}
              style={{ opacity: canPost ? 1 : 0.5 }}
            >
              <FilePlus size={15} strokeWidth={1.75} />
              {!mProduct
                ? copy.match.postCtaNoProduct
                : taxError
                  ? copy.match.postCtaBadTax
                  : copy.match.postCta}
            </button>
          )}
        </div>
      </Modal>

      {/* Nested candidate preview */}
      {mPreview && (
        <div
          className="modal-overlay"
          style={{ zIndex: 120, background: "rgba(15,23,42,0.35)" }}
          onClick={() => setPreview(null)}
        >
          <div
            style={{
              position: "fixed",
              inset: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: 20,
            }}
          >
            <div
              className="modal-card"
              style={{ width: 420, padding: "22px 24px 20px" }}
              onClick={(e) => e.stopPropagation()}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <div>
                  <p style={{ ...overline, margin: "0 0 4px" }}>{copy.match.previewOverline}</p>
                  <h3
                    style={{
                      font: "var(--text-h3)",
                      fontFamily: "var(--font-demo-mono)",
                      margin: 0,
                    }}
                  >
                    {mPreview.ref}
                  </h3>
                </div>
                <button
                  type="button"
                  className="icon-btn"
                  style={{ border: "none", background: "none" }}
                  onClick={() => setPreview(null)}
                  aria-label="Close"
                >
                  <X size={16} strokeWidth={1.75} />
                </button>
              </div>
              <p style={{ font: "var(--text-small)", fontWeight: 600, margin: "10px 0 2px" }}>
                {inv.supplierName}
              </p>
              <div style={{ marginTop: 8 }}>
                {[
                  [copy.match.invoiceDate, mPreview.date],
                  [copy.match.previewStatusLabel, copy.match.previewStatus],
                  [copy.match.previewDescriptionLabel, copy.match.previewDescription],
                ].map(([label, value], i, arr) => (
                  <div
                    key={String(label)}
                    style={i === arr.length - 1 ? { ...detailRow, borderBottom: "none" } : detailRow}
                  >
                    <span style={{ font: "var(--text-small)", color: "var(--muted-foreground)" }}>{label}</span>
                    <span style={{ font: "var(--text-small)", fontWeight: 500 }}>{value}</span>
                  </div>
                ))}
              </div>
              <div
                style={{
                  marginTop: 14,
                  background: "var(--muted)",
                  borderRadius: "var(--radius)",
                  padding: "12px 14px",
                }}
              >
                {[
                  [copy.match.subtotal, Math.round((mPreview.total - gstIncl(mPreview.total)) * 100) / 100],
                  [copy.match.previewTaxLabel, gstIncl(mPreview.total)],
                ].map(([label, value]) => (
                  <div
                    key={String(label)}
                    style={{ display: "flex", justifyContent: "space-between", padding: "3px 0" }}
                  >
                    <span style={{ font: "var(--text-small)", color: "var(--muted-foreground)" }}>{label}</span>
                    <span
                      style={{
                        font: "var(--text-small)",
                        fontFamily: "var(--font-demo-mono)",
                      }}
                    >
                      ${fmtFull(value as number)}
                    </span>
                  </div>
                ))}
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    padding: "6px 0 0",
                    marginTop: 4,
                    borderTop: "1px solid var(--border)",
                  }}
                >
                  <span style={{ font: "var(--text-small)", fontWeight: 700 }}>{copy.match.total}</span>
                  <span
                    style={{
                      font: "var(--text-small)",
                      fontWeight: 700,
                      fontFamily: "var(--font-demo-mono)",
                    }}
                  >
                    ${fmtFull(mPreview.total)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
