"use client";

import { useEffect, useMemo } from "react";
import { useDemoStore } from "@/lib/demo/store";
import { getFiltered } from "@/lib/demo/derive";
import { WorkspaceHeader } from "./WorkspaceHeader";
import { CreditHealthPanel } from "./CreditHealthPanel";
import { FilterBar } from "./FilterBar";
import { XeroImportPanel } from "./XeroImportPanel";
import { StatementTable } from "./StatementTable";
import { Toast } from "../Toast";
import { ReconInfoModal } from "../modals/ReconInfoModal";
import { MatchModal } from "../modals/MatchModal";
import { VerifyPostModal } from "../modals/VerifyPostModal";
import { SupplierFlowModal } from "../modals/SupplierFlowModal";
import { GuidedTour } from "../tour/GuidedTour";

export function Workspace() {
  const init = useDemoStore((s) => s.init);
  const invoices = useDemoStore((s) => s.invoices);
  const searchQuery = useDemoStore((s) => s.searchQuery);
  const statementMonth = useDemoStore((s) => s.statementMonth);
  const reconFilter = useDemoStore((s) => s.reconFilter);
  const typeFilter = useDemoStore((s) => s.typeFilter);
  const sortColumn = useDemoStore((s) => s.sortColumn);
  const sortDir = useDemoStore((s) => s.sortDir);
  const matchFlow = useDemoStore((s) => s.matchFlow);
  const verifyFlow = useDemoStore((s) => s.verifyFlow);
  const supplierFlow = useDemoStore((s) => s.supplierFlow);

  useEffect(() => {
    init();
  }, [init]);

  const list = useMemo(
    () =>
      getFiltered(invoices, {
        searchQuery,
        statementMonth,
        reconFilter,
        typeFilter,
        sortColumn,
        sortDir,
      }),
    [invoices, searchQuery, statementMonth, reconFilter, typeFilter, sortColumn, sortDir],
  );

  return (
    <div style={{ minHeight: "100vh", background: "var(--background)" }}>
      <WorkspaceHeader />
      <main
        id="ss-main"
        style={{
          maxWidth: 1440,
          margin: "0 auto",
          padding: "24px 32px 40px",
          display: "flex",
          flexDirection: "column",
          gap: 14,
        }}
      >
        <CreditHealthPanel />
        <FilterBar />
        <XeroImportPanel list={list} />
        <StatementTable list={list} />
      </main>

      <ReconInfoModal />
      {matchFlow && <MatchModal />}
      {verifyFlow && <VerifyPostModal />}
      {supplierFlow && <SupplierFlowModal />}
      <Toast />
      <GuidedTour />
    </div>
  );
}
