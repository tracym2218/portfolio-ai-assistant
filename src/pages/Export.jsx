import React from "react";
import PageWrapper from "../components/layout/PageWrapper.jsx";
import ExportMenu from "../components/export/ExportMenu.jsx";

export default function Export() {
  return (
    <PageWrapper
      title="Export Report"
      subtitle="Select sections, pick a format, and generate a client-ready deliverable."
    >
      <ExportMenu />
    </PageWrapper>
  );
}
