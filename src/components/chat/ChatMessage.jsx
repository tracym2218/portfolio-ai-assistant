import React, { useState } from "react";
import { Copy, Check, User, Sparkles } from "lucide-react";

export default function ChatMessage({ role, content }) {
  const [copied, setCopied] = useState(false);
  const isUser = role === "user";

  const copy = async () => {
    await navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className={`flex gap-3 ${isUser ? "flex-row-reverse" : ""}`}>
      <div
        className={`w-7 h-7 shrink-0 rounded flex items-center justify-center ${
          isUser ? "bg-accent-gold text-bg-base" : "bg-bg-elevated text-status-track"
        }`}
      >
        {isUser ? <User className="w-4 h-4" /> : <Sparkles className="w-4 h-4" />}
      </div>
      <div className={`max-w-[80%] ${isUser ? "items-end" : "items-start"} flex flex-col gap-1`}>
        <div
          className={`rounded-lg px-3 py-2 text-sm leading-relaxed whitespace-pre-wrap ${
            isUser
              ? "bg-accent-gold/15 text-text-primary border border-accent-gold/30"
              : "bg-bg-card border border-border-default"
          }`}
        >
          {content}
        </div>
        {!isUser && content && (
          <button
            onClick={copy}
            className="text-[11px] text-text-muted hover:text-accent-gold inline-flex items-center gap-1"
          >
            {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
            {copied ? "Copied" : "Copy"}
          </button>
        )}
      </div>
    </div>
  );
}
