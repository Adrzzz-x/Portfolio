"use client";

import { CheckCircle2, X } from "lucide-react";
import { useDemoStore } from "@/lib/demo/store";

export function Toast() {
  const toast = useDemoStore((s) => s.toast);
  const closeToast = useDemoStore((s) => s.closeToast);
  if (!toast) return null;
  return (
    <div className="ss-toast" role="status" aria-live="polite">
      <CheckCircle2 size={16} strokeWidth={1.75} style={{ color: "var(--chart-1)", flexShrink: 0 }} />
      <span style={{ font: "var(--text-small)", flex: 1 }}>{toast}</span>
      <button
        type="button"
        onClick={closeToast}
        aria-label="Dismiss"
        style={{
          background: "none",
          border: "none",
          cursor: "pointer",
          color: "var(--muted-foreground)",
          padding: 0,
          display: "flex",
        }}
      >
        <X size={14} strokeWidth={1.75} />
      </button>
    </div>
  );
}
