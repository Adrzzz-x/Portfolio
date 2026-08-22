"use client";

import Link from "next/link";
import { Settings } from "lucide-react";
import { FreshnessControl } from "./FreshnessControl";
import { workspace as copy } from "@/content/demo";

export function WorkspaceHeader() {
  return (
    <header
      style={{
        background: "color-mix(in oklch, var(--card) 95%, transparent)",
        backdropFilter: "blur(8px)",
        borderBottom: "1px solid var(--border)",
        position: "sticky",
        top: 0,
        zIndex: 30,
      }}
    >
      <div
        className="ss-header-inner"
        style={{
          maxWidth: 1440,
          margin: "0 auto",
          padding: "18px 32px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <div>
            <h1
              style={{
                font: "var(--text-h2)",
                color: "var(--foreground)",
                margin: "0 0 4px",
                letterSpacing: "-0.01em",
              }}
            >
              {copy.title}
            </h1>
            <p style={{ font: "var(--text-small)", color: "var(--muted-foreground)", margin: 0 }}>
              {copy.subtitle}
            </p>
          </div>
          <FreshnessControl />
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <Link className="icon-btn" href="/demo/settings" title={copy.settingsTitle}>
            <Settings size={16} strokeWidth={1.75} />
          </Link>
        </div>
      </div>
    </header>
  );
}
