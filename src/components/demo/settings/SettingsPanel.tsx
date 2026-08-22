"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowLeftRight,
  Bell,
  Building2,
  Check,
  ChevronLeft,
  ChevronRight,
  Ellipsis,
  FileText,
  History,
  Plug,
  Plus,
  RefreshCw,
  Save,
  Upload,
  Users,
  X,
} from "lucide-react";
import { useDemoStore } from "@/lib/demo/store";
import { settings as copy } from "@/content/settings";
import { Toast } from "../Toast";

const TAB_ICONS = { "building-2": Building2, users: Users, plug: Plug, "file-text": FileText } as const;

function Toggle({ on, onClick, title, desc }: { on: boolean; onClick: () => void; title: string; desc: string }) {
  return (
    <div className="toggle-row">
      <div className="meta">
        <p className="t">{title}</p>
        <p className="d">{desc}</p>
      </div>
      <button type="button" className={`switch ${on ? "is-on" : ""}`} onClick={onClick} aria-pressed={on} aria-label={title}>
        <span className="switch__thumb" />
      </button>
    </div>
  );
}

export function SettingsPanel() {
  const notify = useDemoStore((s) => s.showToast);
  const [tab, setTab] = useState<string>("business");
  const [showLegacy, setShowLegacy] = useState(false);
  const [s, setS] = useState(copy.defaults);

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

      <div className="page">
        <div className="page__head">
          <h1>{copy.title}</h1>
          <p>{copy.subtitle}</p>
        </div>

        <div className="tabs">
          {copy.tabs.map((t) => {
            const Icon = TAB_ICONS[t.icon as keyof typeof TAB_ICONS];
            return (
              <button
                key={t.id}
                type="button"
                className={`tabs__t ${tab === t.id ? "is-active" : ""}`}
                onClick={() => setTab(t.id)}
              >
                <Icon size={15} strokeWidth={1.75} /> {t.label}
              </button>
            );
          })}
        </div>

        {tab === "business" && (
          <div className="card">
            <div className="card__head">
              <div className="card__title">
                <Building2 size={18} strokeWidth={1.75} style={{ color: "var(--muted-foreground)" }} />
                {copy.business.cardTitle}
              </div>
              <p className="card__desc">{copy.business.cardDesc}</p>
            </div>
            <div className="card__body">
              <div className="field">
                <label>{copy.business.logoLabel}</label>
                <div className="logo-row">
                  <div className="logo-box">SS</div>
                  <button type="button" className="btn btn-outline btn-sm">
                    <Upload size={14} strokeWidth={1.75} /> {copy.business.change}
                  </button>
                  <button type="button" className="btn btn-ghost btn-sm">
                    <X size={14} strokeWidth={1.75} /> {copy.business.remove}
                  </button>
                </div>
              </div>
              <div className="field">
                <label>{copy.business.tradingName}</label>
                <input className="input" defaultValue={copy.business.tradingNameValue} />
              </div>
              <div className="field">
                <label>
                  {copy.business.abnLabel} <span className="req">*</span>
                </label>
                <input className="input" defaultValue={copy.business.abnValue} />
                <span className="help">{copy.business.abnHelp}</span>
              </div>
              <div className="grid2">
                <div className="field">
                  <label>{copy.business.phone}</label>
                  <input className="input" defaultValue={copy.business.phoneValue} />
                </div>
                <div className="field">
                  <label>{copy.business.email}</label>
                  <input className="input" placeholder={copy.business.emailPlaceholder} />
                </div>
              </div>
              <div className="field">
                <label>{copy.business.website}</label>
                <input className="input" placeholder={copy.business.websitePlaceholder} />
              </div>
            </div>
            <div className="card__foot">
              <span className="legend">{copy.business.requiredNote}</span>
              <button type="button" className="btn btn-primary btn-md" onClick={() => notify(copy.business.savedToast)}>
                <Save size={15} strokeWidth={1.75} /> {copy.business.save}
              </button>
            </div>
          </div>
        )}

        {tab === "users" && (
          <div className="card">
            <div className="card__head" style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <div>
                <div className="card__title">
                  <Users size={18} strokeWidth={1.75} style={{ color: "var(--muted-foreground)" }} />
                  {copy.users.cardTitle}
                </div>
                <p className="card__desc">{copy.users.cardDesc}</p>
              </div>
              <button type="button" className="btn btn-outline btn-sm">
                <Plus size={14} strokeWidth={1.75} /> {copy.users.add}
              </button>
            </div>
            <div className="card__body" style={{ paddingTop: 4, gap: 0 }}>
              {copy.users.list.map((u) => (
                <div key={u.email} className="list-row">
                  <span className="avatar">{u.initials}</span>
                  <div className="grow">
                    <div className="n">
                      {u.name}{" "}
                      {u.you && (
                        <span className="ss-badge ss-badge--muted" style={{ marginLeft: 4 }}>
                          {copy.users.youBadge}
                        </span>
                      )}
                    </div>
                    <div className="s">{u.email}</div>
                  </div>
                  <span className="ss-badge ss-badge--muted">{u.role}</span>
                  <button type="button" className="hd__iconbtn" style={{ width: 32, height: 32 }} aria-label="More">
                    <Ellipsis size={16} strokeWidth={1.75} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {tab === "integrations" && (
          <div className="card">
            <div className="card__head">
              <div className="card__title">
                <Plug size={18} strokeWidth={1.75} style={{ color: "var(--muted-foreground)" }} />
                {copy.integrations.cardTitle}
              </div>
              <p className="card__desc">{copy.integrations.cardDesc}</p>
            </div>
            <div className="card__body">
              <div className="integration">
                <span className="logo" style={{ background: "#13B5EA" }}>
                  X
                </span>
                <div className="grow">
                  <div className="n" style={{ fontSize: 13.5, fontWeight: 600 }}>
                    {copy.integrations.xeroName}
                  </div>
                  <div className="s">{copy.integrations.xeroMeta}</div>
                </div>
                <span className="ss-badge ss-badge--success">
                  <Check size={12} strokeWidth={2.5} /> {copy.integrations.connected}
                </span>
                <button type="button" className="btn btn-ghost btn-sm">
                  {copy.integrations.manage}
                </button>
              </div>
              <div className="integration">
                <span className="logo" style={{ background: "var(--foreground)" }}>
                  B
                </span>
                <div className="grow">
                  <div className="n" style={{ fontSize: 13.5, fontWeight: 600 }}>
                    {copy.integrations.bankName}
                  </div>
                  <div className="s">{copy.integrations.bankMeta}</div>
                </div>
                <button type="button" className="btn btn-outline btn-sm">
                  {copy.integrations.connect}
                </button>
              </div>
            </div>
            <div className="card__foot">
              <span className="legend">{copy.integrations.legacyNote}</span>
              <button type="button" className="btn btn-outline btn-md" onClick={() => setShowLegacy(true)}>
                <History size={15} strokeWidth={1.75} /> {copy.integrations.legacyCta}
              </button>
            </div>
          </div>
        )}

        {tab === "swift" && (
          <div className="card">
            <div className="card__head">
              <div className="card__title">
                <span
                  className="logo"
                  style={{
                    width: 26,
                    height: 26,
                    borderRadius: 7,
                    background: "var(--primary)",
                    fontSize: 12,
                    color: "#fff",
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontWeight: 700,
                  }}
                >
                  S
                </span>
                {copy.swift.cardTitle}
              </div>
              <p className="card__desc">{copy.swift.cardDesc}</p>
            </div>
            <div className="card__body">
              <div>
                <p className="section-lbl" style={{ marginBottom: 4 }}>
                  {copy.swift.featuresLabel}
                </p>
                {copy.swift.toggles.map((t) => (
                  <Toggle
                    key={t.id}
                    on={s[t.id as keyof typeof s] as boolean}
                    onClick={() => setS((prev) => ({ ...prev, [t.id]: !prev[t.id as keyof typeof prev] }))}
                    title={t.title}
                    desc={t.desc}
                  />
                ))}
              </div>

              <div>
                <p className="section-lbl" style={{ margin: "4px 0 14px" }}>
                  {copy.swift.creditLineLabel}
                </p>
                <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
                  <div className="field">
                    <label>{copy.swift.creditLimitLabel}</label>
                    <div className="input-prefix" style={{ maxWidth: 280 }}>
                      <span>$</span>
                      <input
                        className="input"
                        inputMode="numeric"
                        value={s.creditLimit.toLocaleString("en-AU")}
                        onChange={(e) =>
                          setS((prev) => ({
                            ...prev,
                            creditLimit: parseInt(e.target.value.replace(/[^\d]/g, ""), 10) || 0,
                          }))
                        }
                      />
                    </div>
                    <span className="help">{copy.swift.creditLimitHelp}</span>
                  </div>
                  <div className="field">
                    <label>{copy.swift.liabilityLabel}</label>
                    <select
                      className="ss-select"
                      style={{ width: "100%", maxWidth: 420, height: 40 }}
                      value={s.liabilityAccount}
                      onChange={(e) => setS((prev) => ({ ...prev, liabilityAccount: e.target.value }))}
                    >
                      {copy.chartOfAccounts.map((a) => (
                        <option key={a.id} value={a.id}>
                          {a.name}
                        </option>
                      ))}
                    </select>
                    <span className="help">{copy.swift.liabilityHelp}</span>
                  </div>
                </div>
              </div>

              <div>
                <p className="section-lbl" style={{ margin: "4px 0 12px" }}>
                  {copy.swift.mappingsLabel}
                </p>
                <Link href="/demo/settings/mappings" className="map-card">
                  <span className="map-card__ic">
                    <ArrowLeftRight size={18} strokeWidth={1.75} />
                  </span>
                  <span style={{ flex: 1, minWidth: 0 }}>
                    <span className="map-card__t">{copy.swift.mappingsTitle}</span>
                    <span className="map-card__d">{copy.swift.mappingsDesc}</span>
                  </span>
                  <span className="btn btn-outline btn-sm">
                    {copy.swift.mappingsCta} <ChevronRight size={14} strokeWidth={1.75} />
                  </span>
                </Link>
              </div>
            </div>
            <div className="card__foot">
              <span className="legend">{copy.swift.footNote}</span>
              <button type="button" className="btn btn-primary btn-md" onClick={() => notify(copy.swift.savedToast)}>
                <Save size={15} strokeWidth={1.75} /> {copy.swift.save}
              </button>
            </div>
          </div>
        )}
      </div>

      {showLegacy && (
        <div className="modal-overlay" onClick={() => setShowLegacy(false)}>
          <div
            style={{
              position: "fixed",
              inset: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: 28,
            }}
          >
            <div
              className="modal-card"
              role="dialog"
              aria-modal="true"
              aria-label={copy.integrations.legacyTitle}
              style={{
                width: "100%",
                maxWidth: 1040,
                height: "100%",
                maxHeight: 760,
                display: "flex",
                flexDirection: "column",
                overflow: "hidden",
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: 12,
                  padding: "16px 20px",
                  borderBottom: "1px solid var(--border)",
                  flexShrink: 0,
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <div>
                    <div style={{ font: "var(--text-h3)" }}>{copy.integrations.legacyTitle}</div>
                    <div style={{ font: "var(--text-caption)", color: "var(--muted-foreground)", marginTop: 1 }}>
                      {copy.integrations.legacyDesc}
                    </div>
                  </div>
                  <span className="ss-badge ss-badge--muted">
                    <History size={12} strokeWidth={1.75} /> {copy.integrations.legacyChip}
                  </span>
                </div>
                <button type="button" className="hd__iconbtn" onClick={() => setShowLegacy(false)} aria-label="Close">
                  <X size={18} strokeWidth={1.75} />
                </button>
              </div>
              <div style={{ flex: 1, minHeight: 0, background: "var(--muted)" }} />
            </div>
          </div>
        </div>
      )}

      <Toast />
    </>
  );
}
