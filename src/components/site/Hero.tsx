import { hero } from "@/content/site";
import { Polaroid } from "./Polaroid";

export function Hero() {
  return (
    <div className="relative z-10 grid grid-cols-1 lg:grid-cols-[1.12fr_.88fr] gap-14 lg:gap-18 items-center px-6 sm:px-10 lg:px-20 py-16 lg:py-28">
      <div>
        <div className="font-mono text-[14px] uppercase tracking-[0.12em] text-text-muted">
          {hero.eyebrow}
        </div>
        <h1 className="mt-6 mb-7 font-serif font-semibold text-5xl sm:text-6xl leading-[1.02] tracking-[-0.02em]">
          {hero.heading}
        </h1>
        <p className="max-w-[34ch] text-xl sm:text-2xl leading-[1.55] text-pretty">{hero.intro}</p>
        <div
          className="w-[232px] h-2 mt-2.5 bg-left-bottom bg-no-repeat"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 240 12' preserveAspectRatio='none'%3E%3Cpath d='M2 7C46 2 92 10 140 5S204 3 238 7' fill='none' stroke='%23C0562B' stroke-width='2.4' stroke-linecap='round'/%3E%3C/svg%3E\")",
            backgroundSize: "100% 8px",
          }}
        />
        <div className="flex flex-wrap gap-3.5 mt-11">
          <a
            href={hero.primaryCta.href}
            className="font-medium text-[15px] text-white bg-accent px-6 py-4 rounded-sm"
          >
            {hero.primaryCta.label}
          </a>
          <a
            href={hero.secondaryCta.href}
            className="font-medium text-[15px] text-accent-dark border border-border px-6 py-4 rounded-sm"
          >
            {hero.secondaryCta.label}
          </a>
        </div>
      </div>
      <Polaroid
        src={hero.portrait.src}
        alt={hero.portrait.alt}
        rotationDeg={-1.8}
        height={400}
        tape={{ rotateDeg: 2.5, top: "-13px", left: "50%", transform: "translateX(-50%)" }}
      />
    </div>
  );
}
