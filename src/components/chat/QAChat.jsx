import React, { useEffect, useRef, useState } from "react";
import { Send, Trash2, Loader2 } from "lucide-react";
import ChatMessage from "./ChatMessage.jsx";
import SuggestedQuestions from "./SuggestedQuestions.jsx";
import { useFilters } from "../../context/FilterContext.jsx";
import { chat, SYSTEM_PROMPT_BASE, buildPortfolioContext, apiKeyConfigured } from "../../hooks/useClaudeAI.js";

export default function QAChat() {
  const { filteredCompanies: companies, selectedFund, selectedQuarter: quarter } = useFilters();
  const fund = selectedFund === "all" ? "All Alpha PE funds" : selectedFund;
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [err, setErr] = useState("");
  const scrollRef = useRef(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, sending]);

  const send = async (text) => {
    const content = (text ?? input).trim();
    if (!content || sending) return;
    if (!apiKeyConfigured()) {
      setErr("Add VITE_ANTHROPIC_API_KEY to .env to use chat.");
      return;
    }
    setErr("");
    const nextMessages = [...messages, { role: "user", content }];
    setMessages(nextMessages);
    setInput("");
    setSending(true);

    const system = `${SYSTEM_PROMPT_BASE}\n\nYou have full access to the portfolio data below. Answer questions using this data. If a question can't be answered from it, say so directly.\n\n${buildPortfolioContext(fund, quarter, companies)}`;

    try {
      const reply = await chat({
        system,
        messages: nextMessages.map((m) => ({ role: m.role, content: m.content })),
        maxTokens: 900
      });
      setMessages((prev) => [...prev, { role: "assistant", content: reply }]);
    } catch (e) {
      setErr(e.message || "AI call failed.");
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="flex h-full min-h-[calc(100vh-3.5rem)]">
      <div className="flex-1 flex flex-col min-w-0">
        <div className="flex items-center justify-between px-5 py-3 border-b border-border-default">
          <div>
            <div className="text-sm font-semibold">Portfolio Q&A</div>
            <div className="text-xs text-text-muted">
              Portfolio context loaded · {companies.length} companies
            </div>
          </div>
          <button
            onClick={() => setMessages([])}
            disabled={!messages.length}
            className="text-xs text-text-secondary hover:text-status-risk inline-flex items-center gap-1 disabled:opacity-40"
          >
            <Trash2 className="w-3 h-3" /> Clear
          </button>
        </div>

        <div ref={scrollRef} className="flex-1 overflow-auto p-5 space-y-4 bg-bg-base">
          {messages.length === 0 && (
            <div className="text-sm text-text-muted">
              Ask a question about the portfolio, or pick a suggestion.
            </div>
          )}
          {messages.map((m, i) => (
            <ChatMessage key={i} role={m.role} content={m.content} />
          ))}
          {sending && (
            <div className="flex items-center gap-2 text-xs text-text-muted">
              <Loader2 className="w-3 h-3 animate-spin" />
              Thinking…
            </div>
          )}
          {err && <div className="text-sm text-status-below">{err}</div>}
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            send();
          }}
          className="border-t border-border-default p-3 flex items-center gap-2 bg-bg-surface"
        >
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about the portfolio…"
            className="flex-1 bg-bg-base border border-border-default rounded px-3 py-2 text-sm focus:border-accent-gold outline-none"
          />
          <button
            type="submit"
            disabled={!input.trim() || sending}
            className="inline-flex items-center gap-1.5 bg-accent-gold text-bg-base font-bold px-4 py-2 rounded hover:bg-accent-gold-dim disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <Send className="w-4 h-4" />
            Send
          </button>
        </form>
      </div>
      <SuggestedQuestions onPick={send} />
    </div>
  );
}
