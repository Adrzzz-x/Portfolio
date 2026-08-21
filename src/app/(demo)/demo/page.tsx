import { ReconciliationWorkspace } from "@/components/demo/ReconciliationWorkspace";
import { DemoDesktopGate } from "@/components/demo/DemoDesktopGate";

export default function DemoPage() {
  return (
    <>
      <div className="hidden lg:block">
        <ReconciliationWorkspace />
      </div>
      <div className="lg:hidden">
        <DemoDesktopGate />
      </div>
    </>
  );
}
