import { stats } from "@/content/site";

export function StatsBar() {
  return (
    <div className="relative z-10 bg-panel border-y border-border px-6 sm:px-10 lg:px-20 py-14">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-12">
        {stats.map((stat) => (
          <div key={stat.label} className="border-t border-border pt-4.5">
            <div className="font-mono text-4xl sm:text-5xl leading-none text-accent tracking-[-0.03em]">
              {stat.value}
              {stat.unit && <span className="text-2xl"> {stat.unit}</span>}
            </div>
            <div className="mt-3.5 text-[15px] leading-normal text-text-muted">{stat.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
