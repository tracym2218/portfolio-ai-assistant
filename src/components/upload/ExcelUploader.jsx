import React, { useState } from "react";
import { UploadCloud, FileSpreadsheet, AlertCircle } from "lucide-react";
import { parseWorkbook } from "../../hooks/useExcelParser.js";

export default function ExcelUploader({ onParsed }) {
  const [drag, setDrag] = useState(false);
  const [error, setError] = useState("");

  const handleFile = async (file) => {
    setError("");
    if (!file) return;
    const ok = /\.(xlsx|xls|csv)$/i.test(file.name);
    if (!ok) {
      setError("Unsupported file type. Use .xlsx, .xls, or .csv.");
      return;
    }
    try {
      const buf = await file.arrayBuffer();
      const { rows, headers } = parseWorkbook(buf);
      if (!rows.length) {
        setError("No rows found in the first sheet.");
        return;
      }
      onParsed({ rows, headers, fileName: file.name });
    } catch (e) {
      setError(e.message || "Failed to parse file.");
    }
  };

  return (
    <div>
      <label
        onDragOver={(e) => {
          e.preventDefault();
          setDrag(true);
        }}
        onDragLeave={() => setDrag(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDrag(false);
          handleFile(e.dataTransfer.files?.[0]);
        }}
        className={`flex flex-col items-center justify-center gap-2 border-2 border-dashed rounded-lg px-6 py-8 cursor-pointer transition ${
          drag
            ? "border-accent-gold bg-bg-elevated"
            : "border-border-strong hover:border-accent-gold hover:bg-bg-surface"
        }`}
      >
        <UploadCloud className="w-8 h-8 text-text-muted" />
        <div className="text-sm text-text-secondary">
          <span className="text-accent-gold font-semibold">Click to upload</span> or drag and drop
        </div>
        <div className="text-xs text-text-muted mono">.xlsx · .xls · .csv</div>
        <input
          type="file"
          accept=".xlsx,.xls,.csv"
          className="hidden"
          onChange={(e) => handleFile(e.target.files?.[0])}
        />
      </label>
      {error && (
        <div className="mt-3 flex items-center gap-2 text-sm text-status-risk">
          <AlertCircle className="w-4 h-4" /> {error}
        </div>
      )}
      <div className="mt-3 flex items-center gap-1.5 text-xs text-text-muted">
        <FileSpreadsheet className="w-3 h-3" /> First sheet is used. Headers in row 1.
      </div>
    </div>
  );
}
