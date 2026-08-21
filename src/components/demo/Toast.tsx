"use client";

import { useDemoStore } from "@/lib/demo/store";

export function Toast() {
  const toast = useDemoStore((s) => s.toast);
  if (!toast) return null;
  return (
    <div className="ss-toast" role="status" aria-live="polite">
      {toast.message}
    </div>
  );
}
