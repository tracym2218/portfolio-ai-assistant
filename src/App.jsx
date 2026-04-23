import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from "react-router-dom";
import Header from "./components/layout/Header.jsx";
import Sidebar from "./components/layout/Sidebar.jsx";
import GlobalFilterBar from "./components/layout/GlobalFilterBar.jsx";
import Home from "./pages/Home.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import Companies from "./pages/Companies.jsx";
import CompanyDetail from "./pages/CompanyDetail.jsx";
import Insights from "./pages/Insights.jsx";
import MarketIntelligence from "./pages/MarketIntelligence.jsx";
import Chat from "./pages/Chat.jsx";
import Export from "./pages/Export.jsx";
import { FilterProvider } from "./context/FilterContext.jsx";
import { AIContentProvider } from "./context/AIContentContext.jsx";
import { ChartSelectionProvider } from "./context/ChartSelectionContext.jsx";

function Layout() {
  const { pathname } = useLocation();
  const hideFilterBar = pathname === "/";
  return (
    <div className="min-h-screen flex flex-col bg-bg-base text-text-primary">
      <Header />
      {!hideFilterBar && <GlobalFilterBar />}
      <div className="flex-1 flex">
        <Sidebar />
        <main className="flex-1 min-w-0">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/companies" element={<Companies />} />
            <Route path="/companies/:slug" element={<CompanyDetail />} />
            <Route path="/insights" element={<Insights />} />
            <Route path="/market-intelligence" element={<MarketIntelligence />} />
            <Route path="/chat" element={<Chat />} />
            <Route path="/export" element={<Export />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <FilterProvider>
      <AIContentProvider>
        <ChartSelectionProvider>
          <Router>
            <Layout />
          </Router>
        </ChartSelectionProvider>
      </AIContentProvider>
    </FilterProvider>
  );
}
