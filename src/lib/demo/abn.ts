/**
 * Real ATO ABN checksum: subtract 1 from the first digit, apply the positional
 * weights, and the weighted sum must be divisible by 89.
 */
export function isValidAbn(abn: string) {
  const d = (abn || "").replace(/\D/g, "");
  if (d.length !== 11) return false;
  const w = [10, 1, 3, 5, 7, 9, 11, 13, 15, 17, 19];
  const n = d.split("").map(Number);
  n[0] -= 1;
  return n.reduce((s, x, i) => s + x * w[i], 0) % 89 === 0;
}

function nameTokens(s: string) {
  return s
    .toLowerCase()
    .replace(
      /\b(pty|ltd|co|the|group|australia|solutions|supply|supplies|distributors|imports)\b/g,
      "",
    )
    .replace(/[^a-z0-9 ]/g, "")
    .split(/\s+/)
    .filter(Boolean);
}

/** Rough token-overlap score, used to rank and badge "Likely match" Xero contacts. */
export function nameScore(a: string, b: string) {
  const at = new Set(nameTokens(a));
  const bt = nameTokens(b);
  if (!bt.length || !at.size) return 0;
  return bt.filter((t) => at.has(t)).length / Math.max(at.size, bt.length);
}
