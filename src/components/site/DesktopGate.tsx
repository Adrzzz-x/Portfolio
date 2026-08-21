export function DesktopGate() {
  return (
    <div className="flex items-center justify-center rounded-lg border border-border bg-panel p-8 text-center">
      <div className="max-w-[36ch]">
        <div className="font-serif font-medium text-lg mb-2">Built for a bigger screen</div>
        <p className="text-sm text-text-muted leading-relaxed">
          The interactive demo needs more room than a phone gives it. Open this page on a laptop
          or desktop to try it out.
        </p>
      </div>
    </div>
  );
}
