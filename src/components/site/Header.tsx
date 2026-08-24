import { navItems, cvHref } from "@/content/site";
import { TrackedLink } from "./TrackedLink";

export function Header() {
  return (
    <header className="relative z-10 flex items-center justify-between px-6 sm:px-10 lg:px-20 py-5 border-b border-border bg-bg/90">
      <span className="font-serif font-medium text-[17px] tracking-[-0.02em]">Adrian Mullee</span>
      <nav className="flex items-center gap-4 sm:gap-8">
        {navItems.map((item) => (
          <a
            key={item.label}
            href={item.href}
            className="hidden sm:inline text-[15px] text-text-muted hover:text-accent-dark"
          >
            {item.label}
          </a>
        ))}
        <TrackedLink
          event="CV downloaded"
          eventData={{ location: "header" }}
          href={cvHref}
          target="_blank"
          rel="noopener noreferrer"
          className="font-mono text-xs uppercase tracking-[0.12em] text-accent-dark border border-border rounded-sm px-3.5 py-2.5"
        >
          CV ↓
        </TrackedLink>
      </nav>
    </header>
  );
}
