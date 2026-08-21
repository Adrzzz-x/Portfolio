import { closingCta } from "@/content/site";

export function ClosingCta() {
  return (
    <div className="relative z-10 bg-panel border-t border-border px-6 sm:px-10 lg:px-20 pt-20 lg:pt-28 pb-11">
      <h2 className="max-w-[24ch] font-serif font-medium text-4xl sm:text-5xl leading-[1.14] tracking-[-0.02em]">
        {closingCta.heading}
      </h2>
      <a
        href={closingCta.emailHref}
        className="block mt-11 font-serif font-medium text-3xl sm:text-4xl text-accent tracking-[-0.02em]"
      >
        {closingCta.emailLabel}
      </a>
      <div className="flex flex-wrap gap-6 sm:gap-7 mt-6 text-[15px] text-text-muted">
        <a href={closingCta.linkedinHref}>{closingCta.linkedinLabel}</a>
        <a href={closingCta.cvHref}>{closingCta.cvLabel}</a>
        <span>{closingCta.location}</span>
      </div>
    </div>
  );
}
