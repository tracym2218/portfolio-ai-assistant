/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        "bg-base": "#0a0f1e",
        "bg-surface": "#0f1420",
        "bg-card": "#181e2a",
        "bg-elevated": "#1e293b",
        "border-subtle": "#1a2538",
        "border-default": "#1e293b",
        "border-strong": "#334155",
        "text-primary": "#e2e8f0",
        "text-secondary": "#94a3b8",
        "text-muted": "#475569",
        "text-dim": "#334155",
        "accent-gold": "#f59e0b",
        "accent-gold-dim": "#d97706",
        "status-out": "#22c55e",
        "status-track": "#60a5fa",
        "status-below": "#f59e0b",
        "status-risk": "#ef4444"
      },
      fontFamily: {
        sans: ["'DM Sans'", "system-ui", "sans-serif"],
        mono: ["'DM Mono'", "ui-monospace", "monospace"]
      }
    }
  },
  plugins: []
};
