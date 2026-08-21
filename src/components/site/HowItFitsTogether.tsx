import { swiftstatementCaseStudy as cs } from "@/content/site";

export function HowItFitsTogether() {
  const { flow } = cs;
  return (
    <div className="mt-16">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-16">
        {cs.threeUp.map((item) => (
          <div key={item.label} className="border border-border rounded-lg p-5 bg-white">
            <div className="font-mono text-xs uppercase tracking-[0.1em] text-text-muted mb-2">
              {item.label}
            </div>
            <p className="text-sm leading-relaxed text-text-muted">{item.body}</p>
          </div>
        ))}
      </div>

      <h2 className="font-serif font-medium text-2xl mb-2 tracking-[-0.01em]">{flow.heading}</h2>
      <p className="text-sm text-text-muted mb-8">{flow.subheading}</p>

      <div className="border border-border rounded-lg bg-white p-6 sm:p-10 shadow-[0_16px_40px_rgba(32,27,22,.08)]">
        <div className="grid grid-cols-1 sm:grid-cols-[1fr_auto_1.2fr_auto_1fr] gap-6 sm:gap-4 items-center">
          <div className="border border-border rounded-lg p-4">
            <div className="text-sm font-semibold mb-1">{flow.tradeAccountHq.label}</div>
            <div className="text-xs text-text-muted mb-2">{flow.tradeAccountHq.examples}</div>
            <p className="text-xs text-text-muted leading-relaxed">{flow.tradeAccountHq.description}</p>
          </div>
          <div className="hidden sm:block text-center text-accent" aria-hidden="true">
            →
          </div>
          <div className="border-2 border-accent rounded-xl p-5 text-center bg-[color-mix(in_oklab,var(--color-accent)_6%,white)]">
            <div className="font-serif font-semibold text-base mb-2">SwiftStatement</div>
            <div className="flex items-center justify-center gap-5 pt-3 border-t border-accent/20">
              <div>
                <div className="font-mono text-base font-semibold">{flow.stats.lines}</div>
                <div className="text-[10px] text-text-muted">statement lines</div>
              </div>
              <div>
                <div className="font-mono text-base font-semibold">{flow.stats.bills}</div>
                <div className="text-[10px] text-text-muted">bills</div>
              </div>
            </div>
            <div className="flex gap-2 justify-center mt-3">
              <span className="font-mono text-[10px] bg-green/10 text-green rounded-full px-2.5 py-1">
                {flow.stats.matched} matched
              </span>
              <span className="font-mono text-[10px] bg-border/40 text-text-muted rounded-full px-2.5 py-1">
                {flow.stats.review} need review
              </span>
            </div>
          </div>
          <div className="hidden sm:block text-center text-accent" aria-hidden="true">
            →
          </div>
          <div className="border border-border rounded-lg p-4">
            <div className="text-sm font-semibold mb-1">{flow.accounting.label}</div>
            <p className="text-xs text-text-muted leading-relaxed">{flow.accounting.description}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
