export function DemoDesktopGate() {
  return (
    <div className="flex items-center justify-center" style={{ minHeight: "100vh", padding: 24 }}>
      <div className="ss-card" style={{ maxWidth: 420, padding: "28px 26px", textAlign: "center" }}>
        <div style={{ fontSize: 15, fontWeight: 600, marginBottom: 8 }}>Built for a bigger screen</div>
        <p style={{ fontSize: 13, color: "var(--muted-foreground)", lineHeight: 1.55 }}>
          SwiftStatement&rsquo;s reconciliation table needs more room than a phone gives it. Open this
          on a laptop or desktop to try it, or head back to the case study on your phone.
        </p>
      </div>
    </div>
  );
}
