import React from "react";
import PageWrapper from "../components/layout/PageWrapper.jsx";
import InsightsPanel from "../components/insights/InsightsPanel.jsx";
import WatchList from "../components/insights/WatchList.jsx";

export default function Insights() {
  return (
    <PageWrapper
      title="AI Insights"
      subtitle="Executive-ready commentary, streamed. Regenerate sections independently or adjust tone."
    >
      <div className="mb-4">
        <WatchList />
      </div>
      <InsightsPanel />
    </PageWrapper>
  );
}
