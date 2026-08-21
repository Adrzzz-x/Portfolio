export function formatCurrency(amount: number) {
  return amount.toLocaleString("en-AU", { style: "currency", currency: "AUD" });
}

export function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-AU", { day: "numeric", month: "short" });
}

export const STATUS_COPY: Record<
  string,
  { label: string; tone: "ok" | "exc" | "muted"; action: string }
> = {
  reconciled: { label: "Reconciled", tone: "ok", action: "" },
  pending_match: { label: "Needs review", tone: "exc", action: "Review match" },
  unlinked: { label: "New supplier", tone: "exc", action: "Link supplier" },
  no_posting_behaviour: { label: "No posting behaviour", tone: "exc", action: "Set posting behaviour" },
  no_invoice: { label: "No bill found", tone: "exc", action: "Match or post as new" },
};
