"use client";

import { useState } from "react";
import Link from "next/link";
import { useDemoStore } from "@/lib/demo/store";
import { SUPPLIERS, PRODUCTS, ACCOUNTS, XERO_CONTACTS } from "@/lib/demo/seed";
import { Toast } from "./Toast";

type View = "suppliers" | "products";

export function MappingsPanel() {
  const notify = useDemoStore((s) => s.notify);
  const [view, setView] = useState<View>("suppliers");
  const [supplierProducts, setSupplierProducts] = useState<Record<string, string>>(
    Object.fromEntries(SUPPLIERS.map((s) => [s.id, s.defaultProductCode ?? ""])),
  );
  const [productAccounts, setProductAccounts] = useState<Record<string, string>>(
    Object.fromEntries(PRODUCTS.map((p) => [p.code, p.expenseCode])),
  );

  return (
    <>
      <header className="ss-hd">
        <Link href="/demo/settings" className="ss-back">
          ← SwiftStatement settings
        </Link>
      </header>
      <div className="ss-page" style={{ maxWidth: 960 }}>
        <div style={{ marginBottom: 20 }}>
          <div style={{ fontSize: 22, fontWeight: 700, letterSpacing: "-0.01em" }}>Mappings</div>
          <p style={{ fontSize: 13, color: "var(--muted-foreground)", marginTop: 4 }}>
            Map how trade account statement lines flow into Xero — supplier to product, then
            product to chart of accounts category.
          </p>
        </div>

        <div
          className="inline-flex"
          style={{ gap: 4, background: "var(--muted)", padding: 4, borderRadius: "var(--radius)", marginBottom: 18 }}
        >
          {(["suppliers", "products"] as View[]).map((v) => (
            <button
              key={v}
              type="button"
              onClick={() => setView(v)}
              className="ss-btn ss-btn--sm"
              style={{
                background: view === v ? "var(--card)" : "transparent",
                color: view === v ? "var(--primary)" : "var(--muted-foreground)",
                boxShadow: view === v ? "var(--shadow-sm)" : "none",
              }}
            >
              {v === "suppliers" ? "Suppliers → products" : "Products → accounts"}
            </button>
          ))}
        </div>

        <div className="ss-card" style={{ overflow: "hidden" }}>
          {view === "suppliers" ? (
            <table className="ss-table">
              <thead>
                <tr>
                  <th>Supplier</th>
                  <th>Linked Xero contact</th>
                  <th>Default product</th>
                </tr>
              </thead>
              <tbody>
                {SUPPLIERS.map((s) => {
                  const contact = XERO_CONTACTS.find((c) => c.name.startsWith(s.name.split(" ")[0]));
                  return (
                    <tr key={s.id}>
                      <td>{s.name}</td>
                      <td style={{ color: contact ? "var(--foreground)" : "var(--muted-foreground)" }}>
                        {contact ? contact.name : "Not linked"}
                      </td>
                      <td>
                        <select
                          className="ss-select"
                          style={{ maxWidth: 220 }}
                          value={supplierProducts[s.id]}
                          onChange={(e) =>
                            setSupplierProducts((prev) => ({ ...prev, [s.id]: e.target.value }))
                          }
                        >
                          <option value="">–</option>
                          {PRODUCTS.map((p) => (
                            <option key={p.code} value={p.code}>
                              {p.name}
                            </option>
                          ))}
                        </select>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          ) : (
            <table className="ss-table">
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Chart of accounts category</th>
                </tr>
              </thead>
              <tbody>
                {PRODUCTS.map((p) => (
                  <tr key={p.code}>
                    <td>{p.name}</td>
                    <td>
                      <select
                        className="ss-select"
                        style={{ maxWidth: 260 }}
                        value={productAccounts[p.code]}
                        onChange={(e) =>
                          setProductAccounts((prev) => ({ ...prev, [p.code]: e.target.value }))
                        }
                      >
                        {ACCOUNTS.map((a) => (
                          <option key={a.code} value={a.code}>
                            {a.name}
                          </option>
                        ))}
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        <div className="flex items-center justify-between" style={{ marginTop: 16 }}>
          <span style={{ fontSize: 12, color: "var(--muted-foreground)" }}>
            Changes apply when SwiftStatement posts invoices to Xero
          </span>
          <button type="button" className="ss-btn ss-btn--primary" onClick={() => notify("Mappings saved")}>
            Save changes
          </button>
        </div>
      </div>
      <Toast />
    </>
  );
}
