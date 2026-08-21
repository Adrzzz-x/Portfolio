import type { ReactNode } from "react";

export function BrowserFrame({ children }: { children: ReactNode }) {
  return (
    <div className="lg:-mr-30 bg-white border border-border rounded-lg lg:rounded-r-none shadow-[0_16px_40px_rgba(32,27,22,.1)] overflow-hidden">
      <div className="flex gap-1.5 items-center px-4 py-3 border-b border-border-light">
        <span className="w-2.5 h-2.5 rounded-full bg-border" />
        <span className="w-2.5 h-2.5 rounded-full bg-border" />
        <span className="w-2.5 h-2.5 rounded-full bg-border" />
      </div>
      <div className="h-[308px] overflow-hidden bg-[#F7F9FB]">{children}</div>
    </div>
  );
}
