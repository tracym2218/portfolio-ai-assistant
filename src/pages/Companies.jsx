import React from "react";
import { useNavigate } from "react-router-dom";
import PageWrapper from "../components/layout/PageWrapper.jsx";
import CompanyTable from "../components/companies/CompanyTable.jsx";
import { slugify } from "../utils/slug.js";

export default function Companies() {
  const navigate = useNavigate();
  return (
    <PageWrapper title="Portfolio Companies" subtitle="Click any row to open the full company page.">
      <CompanyTable onRowClick={(c) => navigate(`/companies/${slugify(c.company)}`)} />
    </PageWrapper>
  );
}
