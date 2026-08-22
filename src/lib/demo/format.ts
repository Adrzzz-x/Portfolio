/** Absolute value, en-AU, always 2dp. Used wherever the sign is rendered separately. */
export const fmt = (v: number) =>
  Math.abs(v).toLocaleString("en-AU", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

/** Signed value, en-AU, always 2dp. */
export const fmtFull = (v: number) =>
  v.toLocaleString("en-AU", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

/** GST component of a GST-inclusive total (AU: 1/11th). */
export const gstIncl = (t: number) => Math.round((t / 11) * 100) / 100;

const MONTH_IDX: Record<string, number> = {
  Jan: 0, Feb: 1, Mar: 2, Apr: 3, May: 4, Jun: 5,
  Jul: 6, Aug: 7, Sep: 8, Oct: 9, Nov: 10, Dec: 11,
};

const MONTH_ABBR = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

/** Parses the design's "05 May 2026" date strings. */
export function parseAU(s: string) {
  const [d, m, y] = String(s).split(" ");
  return new Date(Number(y), MONTH_IDX[m] ?? 0, Number(d));
}

/** Formats without zero-padding — matches the design's generated candidate dates. */
export function fmtAU(dt: Date) {
  return `${dt.getDate()} ${MONTH_ABBR[dt.getMonth()]} ${dt.getFullYear()}`;
}

export function hashStr(s: string) {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0;
  return Math.abs(h);
}

/** Relative "x minutes ago" copy for the statement-feed control. */
export function relTime(ts: number, now: number) {
  const d = now - ts;
  if (d < 45000) return "just now";
  const m = Math.round(d / 60000);
  if (m < 60) return `${m} minute${m !== 1 ? "s" : ""} ago`;
  const h = Math.round(m / 60);
  if (h < 24) return `${h} hour${h !== 1 ? "s" : ""} ago`;
  return new Date(ts).toLocaleDateString("en-AU", { day: "numeric", month: "short" });
}
