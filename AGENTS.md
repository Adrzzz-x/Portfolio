<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# Project notes

This is Adrian Mullee's personal portfolio, converted from a Claude Design canvas export into
this Next.js app. Two isolated design systems live side by side via route groups — do not let
either bleed into the other.

- **`(site)` route group** — the portfolio itself. Warm cream/terracotta palette (`#FAF6F0`
  background, `#C0562B`/`#8E3D1D` accents, `#F1E9DE` panels), Fraunces (serif headings),
  Inter (body), JetBrains Mono (eyebrow labels/mono numerals). Tokens live in the Tailwind
  `@theme` block in `src/app/(site)/globals.css` — safe to extend as Tailwind utilities.
- **`(demo)` route group** — the embedded SwiftStatement prototype at `/demo`. Cool oklch
  palette modeled on a shadcn-style system, Geist/Geist Mono. Tokens are plain CSS custom
  properties scoped under `[data-app="demo"]` in `src/app/(demo)/globals.css` —
  **deliberately not** Tailwind theme tokens, so they can never collide with `(site)`'s
  utility classes. Style demo components with the `ss-*` CSS classes there, not Tailwind's
  color utilities.
- **Never autoplay video.** Every `<video>` on this site is click-to-play only: a poster/first
  frame plus a play affordance, opening in a modal. `autoPlay` should never be `true`.
- **No real third-party branding.** The SwiftStatement design was originally built as
  "SwiftStatement, by Spenda" with a real company's logo, and named real Australian trade
  buying groups (Capricorn, Bapcor, IRT) as example integrations. Both were deliberately
  stripped/genericized before this app was written — don't reintroduce real company names or
  logos into the demo content if pulling anything from the original canvas export again.
- **Known placeholder assets.** `hero-portrait.jpg`, `gallery-shed.jpg`, and
  `swiftstatement-screenshot.png` failed to decode when originally fetched from the design
  tool (truncated at a 256KB response cap) and were never re-imported — `src/content/site.ts`
  intentionally omits their static imports and renders labeled placeholders instead. The
  aircraft-build video (`public/video/aircraft-build.mp4` + poster) was never fetched at all.
  Swap these in from clean source files when available; don't statically `import` a corrupt
  image file — Next's build-time image processing hard-crashes on decode failure.
