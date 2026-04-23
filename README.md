# Portfolio AI Assistant

Private markets portfolio review tool — upload quarterly data, get AI insights, export client-ready reports.

## Setup

```bash
npm install
cp .env.example .env      # then add your Anthropic API key
npm run dev
```

Open http://localhost:5173.

## Stack

React · Vite · Tailwind · Recharts · SheetJS · jsPDF · pptxgenjs · Anthropic Claude (`claude-sonnet-4-6`)

## Notes

- Sample data loads by default, so the app is usable without uploading anything.
- The Anthropic SDK runs in the browser via `dangerouslyAllowBrowser: true`. For production, proxy through a backend.
