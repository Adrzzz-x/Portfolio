"use client";

import { RefreshCw } from "lucide-react";
import { useDemoStore } from "@/lib/demo/store";
import { isPostable } from "@/lib/demo/derive";
import { workspace as copy } from "@/content/demo";
import type { StatementLine } from "@/lib/demo/types";

export function XeroImportPanel({ list }: { list: StatementLine[] }) {
  const selected = useDemoStore((s) => s.selected);
  const openVerify = useDemoStore((s) => s.openVerify);

  const selectedCount = list.filter((i) => selected[i.id]).length;
  const readyCount = list.filter(isPostable).length;
  const postableSel = list.filter((i) => isPostable(i) && selected[i.id]).length;

  const hasPostAction = selectedCount > 0 ? postableSel > 0 : readyCount > 0;
  const postLabel =
    selectedCount > 0 ? `Post selected (${postableSel})` : `Post all (${readyCount})`;
  const subtitle =
    selectedCount > 0
      ? `${selectedCount} invoice${selectedCount !== 1 ? "s" : ""} selected`
      : copy.xeroImport.subtitle;

  function onPost() {
    const pool = (selectedCount > 0 ? list.filter((i) => selected[i.id]) : list).filter(isPostable);
    if (pool.length) openVerify(pool);
  }

  return (
    <div
      className="ss-card"
      style={{
        padding: "14px 18px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 16,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
        <div
          style={{
            width: 38,
            height: 38,
            borderRadius: "50%",
            background: "color-mix(in oklch, var(--primary) 12%, transparent)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
            color: "var(--primary)",
          }}
        >
          <RefreshCw size={17} strokeWidth={1.75} />
        </div>
        <div style={{ minWidth: 110 }}>
          <p
            style={{
              font: "var(--text-body)",
              fontWeight: 700,
              color: "var(--foreground)",
              margin: "0 0 2px",
            }}
          >
            {copy.xeroImport.title}
          </p>
          <p style={{ font: "var(--text-caption)", color: "var(--muted-foreground)", margin: 0 }}>
            {subtitle}
          </p>
        </div>
      </div>
      <div style={{ flexShrink: 0 }}>
        {hasPostAction && (
          <button type="button" onClick={onPost} className="btn btn-outline btn-sm" style={{ gap: 7 }}>
            <RefreshCw size={13} strokeWidth={1.75} />
            <span>{postLabel}</span>
          </button>
        )}
      </div>
    </div>
  );
}
