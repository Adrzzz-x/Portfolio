"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeftRight, Bell, ChevronLeft, Forklift, RefreshCw, Save, Search } from "lucide-react";
import { useDemoStore } from "@/lib/demo/store";
import { mappings as copy } from "@/content/settings";
import { Toast } from "../Toast";

const VIEW_ICONS = { forklift: Forklift, "arrow-left-right": ArrowLeftRight } as const;

export function MappingsPanel() {
  const notify = useDemoStore((s) => s.showToast);
  const [view, setView] = useState<"suppliers" | "products">("suppliers");
  const [supQuery, setSupQuery] = useState("");
  const [prodQuery, setProdQuery] = useState("");
  const [supplierProducts, setSupplierProducts] = useState<Record<string, string>>(
    Object.fromEntries(copy.supplierRows.map((r) => [r.id, r.product])),
  );
  const [productAccounts, setProductAccounts] = useState<Record<string, string>>({
    ...copy.productAccountSeed,
  });

  const supRows = copy.supplierRows.filter((r) =>
    r.name.toLowerCase().includes(supQuery.trim().toLowerCase()),
  );
  const prodRows = copy.mapProducts.filter((p) =>
    p.toLowerCase().includes(prodQuery.trim().toLowerCase()),
  );

  return (
    <>
      <header className="hd">
        <div className="hd__left">
          <Link className="hd__back" href="/demo">
            <ChevronLeft size={15} strokeWidth={1.75} /> {copy.backToStatement}
          </Link>
        </div>
        <div className="hd__right">
          <button type="button" className="hd__iconbtn" title="Sync">
            <RefreshCw size={17} strokeWidth={1.75} />
          </button>
          <button type="button" className="hd__iconbtn" title="Notifications">
            <Bell size={17} strokeWidth={1.75} />
          </button>
        </div>
      </header>

      <div className="page page--wide">
        <Link href="/demo/settings" className="backlink">
          <ChevronLeft size={15} strokeWidth={1.75} /> {copy.backToSettings}
        </Link>
        <div className="page__head">
          <h1>{copy.title}</h1>
          <p>{copy.subtitle}</p>
        </div>

        <div className="seg">
          {copy.views.map((v) => {
            const Icon = VIEW_ICONS[v.icon as keyof typeof VIEW_ICONS];
            return (
              <button
                key={v.id}
                type="button"
                className={`seg__btn ${view === v.id ? "is-active" : ""}`}
                onClick={() => setView(v.id as "suppliers" | "products")}
              >
                <Icon size={15} strokeWidth={1.75} /> {v.label}
              </button>
            );
          })}
        </div>

        <div className="card">
          <div className="card__head">
            <div className="card__title">
              {view === "suppliers" ? (
                <Forklift size={18} strokeWidth={1.75} style={{ color: "var(--muted-foreground)" }} />
              ) : (
                <ArrowLeftRight size={18} strokeWidth={1.75} style={{ color: "var(--muted-foreground)" }} />
              )}
              {view === "suppliers" ? copy.views[0].label : copy.views[1].label}
            </div>
          </div>
          <div className="card__body" style={{ gap: 0 }}>
            <p style={{ font: "var(--text-small)", color: "var(--muted-foreground)", margin: "0 0 16px", maxWidth: 760 }}>
              {view === "suppliers" ? copy.supplierIntro : copy.productIntro}
            </p>

            <div className="map-search">
              <span className="ic">
                <Search size={15} strokeWidth={1.75} />
              </span>
              <input
                className="input"
                placeholder={view === "suppliers" ? copy.supplierSearchPlaceholder : copy.productSearchPlaceholder}
                value={view === "suppliers" ? supQuery : prodQuery}
                onChange={(e) => (view === "suppliers" ? setSupQuery(e.target.value) : setProdQuery(e.target.value))}
              />
            </div>

            <div style={{ border: "1px solid var(--border)", borderRadius: "var(--radius)", overflow: "hidden" }}>
              {view === "suppliers" ? (
                <table className="maptable">
                  <thead>
                    <tr>
                      <th>{copy.colSupplier}</th>
                      <th>{copy.colLinked}</th>
                      <th>{copy.colDefaultProduct}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {supRows.map((r) => (
                      <tr key={r.id}>
                        <td>{r.name}</td>
                        <td style={{ color: r.xero ? "var(--foreground)" : "var(--muted-foreground)" }}>
                          {r.xero || copy.notLinked}
                        </td>
                        <td>
                          <select
                            className="ss-select"
                            style={{ maxWidth: 240, width: "100%" }}
                            value={supplierProducts[r.id]}
                            onChange={(e) => setSupplierProducts((p) => ({ ...p, [r.id]: e.target.value }))}
                            aria-label={`${copy.colDefaultProduct} for ${r.name}`}
                          >
                            <option value="">–</option>
                            {copy.mapProducts.map((p) => (
                              <option key={p} value={p}>
                                {p}
                              </option>
                            ))}
                          </select>
                        </td>
                      </tr>
                    ))}
                    {supRows.length === 0 && (
                      <tr>
                        <td colSpan={3} className="map-noresult">
                          {copy.emptySuppliers}
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              ) : (
                <table className="maptable">
                  <colgroup>
                    <col style={{ width: "40%" }} />
                    <col />
                  </colgroup>
                  <thead>
                    <tr>
                      <th>{copy.colProduct}</th>
                      <th>{copy.colAccount}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {prodRows.map((p) => (
                      <tr key={p}>
                        <td>{p}</td>
                        <td>
                          <select
                            className="ss-select"
                            style={{ maxWidth: 280, width: "100%" }}
                            value={productAccounts[p] ?? ""}
                            onChange={(e) => setProductAccounts((prev) => ({ ...prev, [p]: e.target.value }))}
                            aria-label={`${copy.colAccount} for ${p}`}
                          >
                            <option value="">–</option>
                            {copy.coaAccounts.map((a) => (
                              <option key={a.code} value={a.code}>
                                {a.label}
                              </option>
                            ))}
                          </select>
                        </td>
                      </tr>
                    ))}
                    {prodRows.length === 0 && (
                      <tr>
                        <td colSpan={2} className="map-noresult">
                          {copy.emptyProducts}
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              )}
            </div>
          </div>
          <div className="card__foot">
            <span className="legend">{copy.footNote}</span>
            <button type="button" className="btn btn-primary btn-md" onClick={() => notify(copy.savedToast)}>
              <Save size={15} strokeWidth={1.75} /> {copy.save}
            </button>
          </div>
        </div>
      </div>

      <Toast />
    </>
  );
}
