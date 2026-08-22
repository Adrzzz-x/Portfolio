"use client";

import { useMemo } from "react";
import { ArrowLeft, Building2, Check, FileText, GitBranch, Link2, Link as LinkIcon, Plus, Search, X } from "lucide-react";
import { Modal } from "./Modal";
import { useDemoStore } from "@/lib/demo/store";
import { PRODUCTS, XERO_CONTACTS } from "@/lib/demo/seed";
import { isValidAbn, nameScore } from "@/lib/demo/abn";
import { workspace as copy } from "@/content/demo";

const overline: React.CSSProperties = {
  font: "var(--text-overline)",
  textTransform: "uppercase",
  letterSpacing: "0.06em",
  color: "var(--muted-foreground)",
};

export function SupplierFlowModal() {
  const flow = useDemoStore((s) => s.supplierFlow);
  const step = useDemoStore((s) => s.sfStep);
  const contact = useDemoStore((s) => s.sfContact);
  const creating = useDemoStore((s) => s.sfCreating);
  const newName = useDemoStore((s) => s.sfNewName);
  const newAbn = useDemoStore((s) => s.sfNewAbn);
  const search = useDemoStore((s) => s.sfSearch);
  const product = useDemoStore((s) => s.sfProduct);
  const setStep = useDemoStore((s) => s.setSfStep);
  const setContact = useDemoStore((s) => s.setSfContact);
  const setCreating = useDemoStore((s) => s.setSfCreating);
  const startCreate = useDemoStore((s) => s.startCreateSupplier);
  const setNewName = useDemoStore((s) => s.setSfNewName);
  const setNewAbn = useDemoStore((s) => s.setSfNewAbn);
  const setSearch = useDemoStore((s) => s.setSfSearch);
  const setProduct = useDemoStore((s) => s.setSfProduct);
  const close = useDemoStore((s) => s.closeSupplier);
  const next = useDemoStore((s) => s.supplierNext);

  const inv = flow?.inv;

  const contacts = useMemo(() => {
    if (!inv) return [];
    const q = search.trim().toLowerCase();
    return XERO_CONTACTS.filter(
      (c) =>
        !q ||
        c.name.toLowerCase().includes(q) ||
        c.refId.toLowerCase().includes(q) ||
        c.abn.replace(/\s/g, "").includes(q.replace(/\s/g, "")),
    )
      .map((c) => ({ ...c, _score: nameScore(inv.supplierName, c.name) }))
      .sort((a, b) => b._score - a._score || a.name.localeCompare(b.name));
  }, [inv, search]);

  if (!inv) return null;

  const abnDigits = newAbn.replace(/\D/g, "");
  const abnValid = abnDigits.length === 11 && isValidAbn(newAbn);
  const abnMsg =
    abnDigits.length > 0 && abnDigits.length !== 11
      ? copy.supplier.abnShort
      : abnDigits.length === 11 && !abnValid
        ? copy.supplier.abnInvalid
        : abnValid
          ? copy.supplier.abnValid
          : copy.supplier.abnEmpty;
  const abnMsgColor = abnValid
    ? "var(--chart-1)"
    : abnDigits.length > 0 && !abnValid
      ? "var(--destructive)"
      : "var(--muted-foreground)";

  const linked = !!contact || creating;
  const rightName = contact ? contact.name : creating ? newName : "";
  const rightSub = contact ? `${contact.refId} · ${contact.abn}` : creating ? copy.supplier.newSupplier : "";
  const contactName = contact ? contact.name : creating ? newName : inv.supplierName;

  const canNext1 = contact != null || (creating && newName.trim().length > 0 && abnValid);
  const canNext2 = !!product;
  const canNext = step === 1 ? canNext1 : canNext2;

  const prod = PRODUCTS.find((p) => p.id === product);

  return (
    <Modal
      open
      onClose={close}
      title={step === 1 ? copy.supplier.step1Title : copy.supplier.step2Title}
      cardStyle={{ width: 720, maxHeight: "90vh", display: "flex", flexDirection: "column" }}
    >
      <div style={{ padding: "22px 24px 18px", borderBottom: "1px solid var(--border)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
          <h2 style={{ font: "var(--text-h3)", color: "var(--foreground)", margin: 0 }}>
            {step === 1 ? copy.supplier.step1Title : copy.supplier.step2Title}
          </h2>
          <button type="button" className="icon-btn" onClick={close} aria-label="Close">
            <X size={16} strokeWidth={1.75} />
          </button>
        </div>
        <div style={{ display: "flex", alignItems: "center" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
            <div
              className="step-dot"
              style={{ background: "var(--primary)", color: "var(--primary-foreground)" }}
            >
              {step > 1 ? <Check size={11} strokeWidth={3} /> : "1"}
            </div>
            <span
              style={{
                font: "var(--text-small)",
                fontWeight: 600,
                color: step === 1 ? "var(--foreground)" : "var(--primary)",
                whiteSpace: "nowrap",
              }}
            >
              {copy.supplier.step1Label}
            </span>
          </div>
          <div
            style={{
              width: 28,
              height: 1,
              margin: "0 12px",
              background: step > 1 ? "var(--primary)" : "var(--border)",
            }}
          />
          <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
            <div
              className="step-dot"
              style={{
                background: step >= 2 ? "var(--primary)" : "var(--muted)",
                color: step >= 2 ? "var(--primary-foreground)" : "var(--muted-foreground)",
              }}
            >
              2
            </div>
            <span
              style={{
                font: "var(--text-small)",
                fontWeight: 500,
                color: step === 2 ? "var(--foreground)" : "var(--muted-foreground)",
                whiteSpace: "nowrap",
              }}
            >
              {copy.supplier.step2Label}
            </span>
          </div>
        </div>
      </div>

      {step === 1 ? (
        <div style={{ padding: "22px 24px", overflowY: "auto", flex: 1 }}>
          <div style={{ display: "flex", alignItems: "stretch", marginBottom: 22 }}>
            <div
              style={{
                flex: 1,
                border: "1px solid var(--border)",
                borderRadius: "var(--radius-md)",
                padding: "14px 16px",
                background: "var(--card)",
              }}
            >
              <p style={{ ...overline, margin: "0 0 6px" }}>{copy.supplier.onYourStatement}</p>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div
                  style={{
                    width: 30,
                    height: 30,
                    borderRadius: "var(--radius-sm)",
                    background: "var(--muted)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  <FileText size={15} strokeWidth={1.75} style={{ color: "var(--muted-foreground)" }} />
                </div>
                <div style={{ minWidth: 0 }}>
                  <p style={{ font: "var(--text-small)", fontWeight: 600, margin: 0 }}>{inv.supplierName}</p>
                  <p
                    style={{
                      font: "var(--text-caption)",
                      color: "var(--muted-foreground)",
                      margin: 0,
                      fontFamily: "var(--font-demo-mono)",
                    }}
                  >
                    {inv.invoiceRef}
                  </p>
                </div>
              </div>
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                width: 56,
                flexShrink: 0,
              }}
            >
              <div
                style={{
                  width: 30,
                  height: 30,
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  background: linked ? "var(--chart-1)" : "var(--muted)",
                  color: linked ? "var(--primary-foreground)" : "var(--muted-foreground)",
                }}
              >
                {linked ? <LinkIcon size={14} strokeWidth={1.75} /> : <Link2 size={14} strokeWidth={1.75} />}
              </div>
            </div>
            <div
              style={{
                flex: 1,
                borderRadius: "var(--radius-md)",
                padding: "14px 16px",
                minWidth: 0,
                border: "1px dashed var(--border)",
                background: "var(--muted)",
              }}
            >
              <p style={{ ...overline, margin: "0 0 6px" }}>{copy.supplier.inYourXero}</p>
              {rightName ? (
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <div
                    style={{
                      width: 30,
                      height: 30,
                      borderRadius: "var(--radius-sm)",
                      background: "color-mix(in oklch, var(--primary) 14%, transparent)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                    }}
                  >
                    <Building2 size={15} strokeWidth={1.75} style={{ color: "var(--primary)" }} />
                  </div>
                  <div style={{ minWidth: 0 }}>
                    <p style={{ font: "var(--text-small)", fontWeight: 600, margin: 0 }}>{rightName}</p>
                    <p style={{ font: "var(--text-caption)", color: "var(--muted-foreground)", margin: 0 }}>
                      {rightSub}
                    </p>
                  </div>
                </div>
              ) : (
                <div style={{ display: "flex", alignItems: "center", gap: 10, height: 30 }}>
                  <span style={{ font: "var(--text-small)", color: "var(--muted-foreground)" }}>
                    {copy.supplier.choosePlaceholder}
                  </span>
                </div>
              )}
            </div>
          </div>

          {!creating ? (
            <>
              <div style={{ position: "relative", marginBottom: 10 }}>
                <span
                  style={{
                    position: "absolute",
                    left: 11,
                    top: "50%",
                    transform: "translateY(-50%)",
                    display: "flex",
                    pointerEvents: "none",
                    color: "var(--muted-foreground)",
                  }}
                >
                  <Search size={14} strokeWidth={1.75} />
                </span>
                <input
                  className="ss-search"
                  placeholder={copy.supplier.searchPlaceholder}
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
              <div
                style={{
                  border: "1px solid var(--border)",
                  borderRadius: "var(--radius-md)",
                  overflow: "hidden",
                  maxHeight: 198,
                  overflowY: "auto",
                }}
              >
                {contacts.length === 0 && (
                  <p
                    style={{
                      padding: "18px 14px",
                      textAlign: "center",
                      font: "var(--text-small)",
                      color: "var(--muted-foreground)",
                      margin: 0,
                    }}
                  >
                    {copy.supplier.emptyList}
                  </p>
                )}
                {contacts.map((c, i) => (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => setContact(c)}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 12,
                      padding: "10px 14px",
                      cursor: "pointer",
                      width: "100%",
                      textAlign: "left",
                      background: "transparent",
                      border: "none",
                      borderTop: "1px solid color-mix(in oklch, var(--border) 55%, transparent)",
                    }}
                  >
                    <span className={`mradio ${contact?.id === c.id ? "on" : ""}`} />
                    <span style={{ flex: 1, minWidth: 0 }}>
                      <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <span style={{ font: "var(--text-small)" }}>{c.name}</span>
                        {i === 0 && !search.trim() && c._score >= 0.5 && (
                          <span
                            className="ss-badge ss-badge--primary"
                            style={{ fontSize: 10, padding: "1px 7px", flexShrink: 0 }}
                          >
                            {copy.supplier.likelyMatch}
                          </span>
                        )}
                      </span>
                      <span
                        style={{
                          display: "block",
                          font: "var(--text-caption)",
                          color: "var(--muted-foreground)",
                        }}
                      >
                        {c.refId} · {c.abn}
                      </span>
                    </span>
                  </button>
                ))}
              </div>
              <button
                type="button"
                onClick={startCreate}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  width: "100%",
                  marginTop: 10,
                  padding: "11px 14px",
                  cursor: "pointer",
                  background: "transparent",
                  border: "1px dashed var(--border)",
                  borderRadius: "var(--radius-md)",
                  font: "var(--text-small)",
                  fontWeight: 500,
                  color: "var(--primary)",
                }}
              >
                <Plus size={15} strokeWidth={1.75} /> {copy.supplier.createCta}
              </button>
            </>
          ) : (
            <>
              <button
                type="button"
                onClick={() => setCreating(false)}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 6,
                  marginBottom: 16,
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  font: "var(--text-small)",
                  color: "var(--primary)",
                  padding: 0,
                }}
              >
                <ArrowLeft size={14} strokeWidth={1.75} /> {copy.supplier.backToSearch}
              </button>
              <p style={{ font: "var(--text-label)", fontWeight: 600, margin: "0 0 10px" }}>
                {copy.supplier.detailsHeading}
              </p>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
                  <label
                    style={{ font: "var(--text-caption)", color: "var(--muted-foreground)", fontWeight: 500 }}
                  >
                    {copy.supplier.businessNameLabel} <span style={{ color: "var(--destructive)" }}>*</span>
                  </label>
                  <input
                    className="ss-text-input"
                    placeholder={copy.supplier.businessNamePlaceholder}
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                  />
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
                  <label
                    style={{ font: "var(--text-caption)", color: "var(--muted-foreground)", fontWeight: 500 }}
                  >
                    {copy.supplier.abnLabel} <span style={{ color: "var(--destructive)" }}>*</span>
                  </label>
                  <input
                    className="ss-text-input"
                    placeholder={copy.supplier.abnPlaceholder}
                    value={newAbn}
                    onChange={(e) => setNewAbn(e.target.value)}
                  />
                  <span style={{ font: "var(--text-caption)", color: abnMsgColor }}>{abnMsg}</span>
                </div>
              </div>
            </>
          )}
        </div>
      ) : (
        <div style={{ padding: "22px 24px", overflowY: "auto", flex: 1 }}>
          <div
            style={{
              background: "color-mix(in oklch, var(--chart-1) 9%, transparent)",
              border: "1px solid color-mix(in oklch, var(--chart-1) 26%, transparent)",
              borderRadius: "var(--radius-md)",
              padding: "10px 14px",
              marginBottom: 20,
              display: "flex",
              alignItems: "center",
              gap: 10,
            }}
          >
            <LinkIcon size={15} strokeWidth={1.75} style={{ color: "var(--chart-1)", flexShrink: 0 }} />
            <span style={{ font: "var(--text-small)" }}>
              <strong>{inv.supplierName}</strong> linked to <strong>{contactName}</strong>
            </span>
          </div>
          <label style={{ display: "block", font: "var(--text-label)", fontWeight: 600, marginBottom: 8 }}>
            {copy.supplier.productLabel} <span style={{ color: "var(--destructive)" }}>*</span>
          </label>
          <select
            className="ss-select"
            style={{ width: "100%", height: 40 }}
            value={product}
            onChange={(e) => setProduct(e.target.value)}
          >
            <option value="">{copy.supplier.productPlaceholder}</option>
            {PRODUCTS.map((p) => (
              <option key={p.id} value={p.id}>
                {p.code} · {p.name}
              </option>
            ))}
          </select>
          <p style={{ font: "var(--text-caption)", color: "var(--muted-foreground)", marginTop: 5 }}>
            {copy.supplier.productHelp}
          </p>
          {prod && (
            <div
              style={{
                marginTop: 14,
                background: "var(--muted)",
                border: "1px solid var(--border)",
                borderRadius: "var(--radius-md)",
                padding: "12px 16px",
                display: "flex",
                alignItems: "center",
                gap: 12,
              }}
            >
              <GitBranch size={15} strokeWidth={1.75} style={{ color: "var(--muted-foreground)", flexShrink: 0 }} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ ...overline, margin: "0 0 2px" }}>{copy.supplier.expenseAccount}</p>
                <p style={{ font: "var(--text-small)", fontWeight: 600, margin: 0 }}>
                  <span style={{ fontFamily: "var(--font-demo-mono)" }}>{prod.expenseCode}</span> ·{" "}
                  {prod.expenseName}
                </p>
              </div>
              <span
                style={{
                  flexShrink: 0,
                  font: "var(--text-caption)",
                  color: "var(--muted-foreground)",
                  whiteSpace: "nowrap",
                }}
              >
                {copy.supplier.setByProduct}
              </span>
            </div>
          )}
        </div>
      )}

      <div
        style={{
          padding: "14px 24px",
          borderTop: "1px solid var(--border)",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div style={{ display: "flex", gap: 8 }}>
          {step === 2 && (
            <button type="button" className="btn btn-ghost btn-md" onClick={() => setStep(1)}>
              <ArrowLeft size={14} strokeWidth={1.75} /> {copy.supplier.back}
            </button>
          )}
          <button type="button" className="btn btn-ghost btn-md" onClick={close}>
            {copy.supplier.cancel}
          </button>
        </div>
        <button
          type="button"
          className="btn btn-primary btn-md"
          onClick={next}
          style={{ opacity: canNext ? 1 : 0.45 }}
        >
          {step === 2 ? copy.supplier.save : copy.supplier.next}
        </button>
      </div>
    </Modal>
  );
}
