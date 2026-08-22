"use client";

import { RefreshCw } from "lucide-react";
import { useDemoStore } from "@/lib/demo/store";
import { getFreshness } from "@/lib/demo/derive";
import { useNow } from "@/lib/demo/useNow";
import { workspace as copy } from "@/content/demo";

export function FreshnessControl() {
  const fetching = useDemoStore((s) => s.fetching);
  const lastUpdated = useDemoStore((s) => s.lastUpdated);
  const handleRefresh = useDemoStore((s) => s.handleRefresh);
  const now = useNow();

  const f = getFreshness(lastUpdated, fetching, now);

  return (
    <div className="ss-fresh">
      {fetching ? (
        <span className="spin" style={{ display: "inline-flex", color: "var(--primary)" }}>
          <RefreshCw size={16} strokeWidth={1.75} />
        </span>
      ) : (
        <span className={`ss-fresh__dot ${f.dotCls}`} />
      )}
      <div style={{ lineHeight: 1.25, minWidth: 154 }}>
        <p style={{ font: "var(--text-small)", fontWeight: 600, color: f.titleColor, margin: 0 }}>
          {f.title}
        </p>
        <p
          style={{
            font: "var(--text-caption)",
            color: "var(--muted-foreground)",
            margin: 0,
          }}
        >
          {/* Empty until the clock is available on the client, so SSR output matches. */}
          {f.sub}
        </p>
      </div>
      <span className="ss-fresh__sep" />
      <button
        type="button"
        className="ss-fresh__btn"
        onClick={handleRefresh}
        title={copy.refreshTitle}
      >
        <RefreshCw size={16} strokeWidth={1.75} />
        {f.refreshLabel}
      </button>
    </div>
  );
}
