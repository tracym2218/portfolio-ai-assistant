import React, { forwardRef, useEffect, useImperativeHandle, useRef, useState } from "react";
import {
  ChevronDown,
  ChevronRight,
  Copy,
  Check,
  RotateCw,
  Loader2,
  Pencil,
  X,
  AlertTriangle
} from "lucide-react";
import { useAIContent } from "../../context/AIContentContext.jsx";
import { streamText, apiKeyConfigured } from "../../hooks/useClaudeAI.js";

const timestamp = () =>
  new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

const AISectionCard = forwardRef(function AISectionCard(
  {
    sectionKey,
    title,
    dimensions,         // optional [{ value, label, prompt }]
    buildPrompt,        // (dimension) => { system, user, maxTokens }
    defaultOpen = true
  },
  ref
) {
  const { aiContent, setSection, getSection } = useAIContent();
  const section = aiContent[sectionKey] || {};
  const content = typeof section.content === "string" ? section.content : "";
  const loading = !!section.isStreaming;
  const isEdited = !!section.isEdited;
  const generatedDimension = section.dimension || null;
  const generatedAt = section.generatedAt || null;

  const [open, setOpen] = useState(defaultOpen);
  const [copied, setCopied] = useState(false);
  const [editing, setEditing] = useState(false);
  const [editValue, setEditValue] = useState("");
  const [confirmRegen, setConfirmRegen] = useState(false);
  const [err, setErr] = useState("");
  const textareaRef = useRef(null);

  // Selected dimension for the NEXT generation. Defaults to the dimension saved on the section.
  const initialDimension =
    generatedDimension ||
    (dimensions && dimensions.length > 0 ? dimensions[0].value : null);
  const [dimension, setDimension] = useState(initialDimension);

  // If the stored dimension changes underneath (e.g. context reset), reflect it.
  useEffect(() => {
    if (generatedDimension && generatedDimension !== dimension) {
      setDimension(generatedDimension);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [generatedDimension]);

  useEffect(() => {
    if (editing && textareaRef.current) {
      const el = textareaRef.current;
      el.style.height = "auto";
      el.style.height = el.scrollHeight + "px";
    }
  }, [editValue, editing]);

  const dimensionChangedSinceGeneration =
    !!dimensions && !!generatedDimension && dimension !== generatedDimension;

  const dimensionLabel = (value) =>
    (dimensions || []).find((d) => d.value === value)?.label || value;

  const startEdit = () => {
    setEditValue(content || "");
    setEditing(true);
    setOpen(true);
    setConfirmRegen(false);
  };

  const save = () => {
    const original = section.original || "";
    setSection(sectionKey, {
      content: editValue,
      isEdited: editValue !== original
    });
    setEditing(false);
  };

  const cancelEdit = () => {
    setEditing(false);
    setEditValue("");
  };

  const copy = async () => {
    if (!content) return;
    await navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const doGenerate = async () => {
    if (!apiKeyConfigured()) {
      setErr("Add VITE_ANTHROPIC_API_KEY to .env to generate AI commentary.");
      return;
    }
    setErr("");
    const existing = getSection(sectionKey);
    if (existing.isStreaming) return;

    // Reset content, mark streaming, record dimension we're using for this run.
    setSection(sectionKey, {
      content: "",
      isStreaming: true,
      dimension
    });

    const { system, user, maxTokens = 600 } = buildPrompt(dimension) || {};
    try {
      const full = await streamText({
        system,
        user,
        maxTokens,
        onDelta: (_, fullText) => {
          setSection(sectionKey, { content: fullText });
        }
      });
      setSection(sectionKey, {
        content: full,
        original: full,
        isEdited: false,
        isStreaming: false,
        dimension,
        generatedAt: timestamp()
      });
    } catch (e) {
      setErr(e.message || "AI generation failed.");
      setSection(sectionKey, { isStreaming: false });
    }
  };

  useImperativeHandle(
    ref,
    () => ({
      generate: async () => {
        await doGenerate();
      },
      isStreaming: () => !!getSection(sectionKey).isStreaming
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [dimension, buildPrompt]
  );

  const handleRegenClick = () => {
    if (editing) return;
    const needsConfirm = content && (isEdited || dimensionChangedSinceGeneration);
    if (needsConfirm) {
      setConfirmRegen(true);
      setOpen(true);
    } else {
      doGenerate();
    }
  };

  const confirmYes = () => {
    setConfirmRegen(false);
    doGenerate();
  };

  // When the section is unmounted mid-stream, clear isStreaming so the next open isn't stuck.
  useEffect(() => {
    return () => {
      setSection(sectionKey, (prev) => (prev.isStreaming ? { isStreaming: false } : {}));
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sectionKey]);

  const confirmMessage = isEdited
    ? "Regenerating will replace your edits. Continue?"
    : dimensionChangedSinceGeneration
    ? `Regenerating will replace the current content with a new "${dimensionLabel(dimension)}" version. Continue?`
    : "Regenerating will replace the current content. Continue?";

  return (
    <div className="bg-bg-card border border-border-default rounded-[10px]">
      <div className="flex flex-wrap items-center gap-2 px-4 py-3">
        <button
          onClick={() => setOpen((o) => !o)}
          className="flex items-center gap-2 text-left min-w-0 hover:text-accent-gold transition"
        >
          {open ? (
            <ChevronDown className="w-4 h-4 text-text-muted shrink-0" />
          ) : (
            <ChevronRight className="w-4 h-4 text-text-muted shrink-0" />
          )}
          <span className="font-semibold text-sm truncate">{title}</span>
          {loading && <Loader2 className="w-3 h-3 animate-spin text-accent-gold shrink-0" />}
          {isEdited && !editing && (
            <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded-full bg-accent-gold/15 text-accent-gold border border-accent-gold/30 shrink-0">
              Edited
            </span>
          )}
        </button>

        <div className="flex items-center gap-2 ml-auto shrink-0" onClick={(e) => e.stopPropagation()}>
          {dimensions && dimensions.length > 0 && !editing && (
            <div className="inline-flex items-center gap-1 bg-bg-surface border border-border-default rounded px-2 py-1">
              <span className="text-[10px] uppercase tracking-wider text-text-muted">Dim</span>
              <select
                value={dimension || ""}
                onChange={(e) => setDimension(e.target.value)}
                className="bg-transparent text-xs text-text-primary outline-none"
              >
                {dimensions.map((d) => (
                  <option key={d.value} value={d.value}>
                    {d.label}
                  </option>
                ))}
              </select>
            </div>
          )}

          {generatedAt && !loading && (
            <span className="text-[11px] text-text-dim mono whitespace-nowrap">
              Generated {generatedAt}
            </span>
          )}

          {editing ? (
            <>
              <button
                onClick={save}
                className="text-[11px] font-semibold text-bg-base bg-accent-gold inline-flex items-center gap-1 px-2 py-1 rounded hover:bg-accent-gold-dim"
              >
                <Check className="w-3 h-3" /> Save
              </button>
              <button
                onClick={cancelEdit}
                className="text-[11px] text-text-muted hover:text-text-primary inline-flex items-center gap-1 px-2 py-1 rounded hover:bg-bg-elevated"
              >
                <X className="w-3 h-3" /> Cancel
              </button>
            </>
          ) : (
            <>
              {content && (
                <button
                  onClick={startEdit}
                  className="text-[11px] text-text-secondary hover:text-accent-gold inline-flex items-center gap-1 px-2 py-1 rounded hover:bg-bg-elevated"
                >
                  <Pencil className="w-3 h-3" /> Edit
                </button>
              )}
              {content && (
                <button
                  onClick={copy}
                  className="text-[11px] text-text-secondary hover:text-accent-gold inline-flex items-center gap-1 px-2 py-1 rounded hover:bg-bg-elevated"
                >
                  {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                  {copied ? "Copied" : "Copy"}
                </button>
              )}
              <button
                onClick={handleRegenClick}
                disabled={loading}
                className="text-[11px] text-text-secondary hover:text-accent-gold inline-flex items-center gap-1 px-2 py-1 rounded hover:bg-bg-elevated disabled:opacity-40"
              >
                <RotateCw className="w-3 h-3" /> Regen
              </button>
            </>
          )}
        </div>
      </div>

      {dimensionChangedSinceGeneration && content && !loading && !confirmRegen && !editing && (
        <div className="mx-4 mb-2 px-3 py-2 rounded bg-bg-surface border border-border-default text-[11px] text-text-secondary">
          Dimension changed to <strong className="text-accent-gold">{dimensionLabel(dimension)}</strong> — click Regenerate to update.
        </div>
      )}

      {confirmRegen && !editing && (
        <div className="mx-4 mb-3 flex items-center gap-2 bg-bg-elevated border border-accent-gold/40 rounded px-3 py-2 text-xs">
          <AlertTriangle className="w-3.5 h-3.5 text-accent-gold shrink-0" />
          <span className="flex-1 text-text-primary">{confirmMessage}</span>
          <button
            onClick={confirmYes}
            className="text-[11px] font-semibold text-bg-base bg-accent-gold px-2 py-1 rounded hover:bg-accent-gold-dim"
          >
            Yes, replace
          </button>
          <button
            onClick={() => setConfirmRegen(false)}
            className="text-[11px] text-text-muted hover:text-text-primary px-2 py-1 rounded hover:bg-bg-card"
          >
            Cancel
          </button>
        </div>
      )}

      {err && <div className="mx-4 mb-3 text-xs text-status-below">{err}</div>}

      {open && (
        <div className="px-4 pb-4">
          {editing ? (
            <textarea
              ref={textareaRef}
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              className="w-full bg-bg-card border border-border-default text-text-primary outline-none focus:border-accent-gold transition"
              style={{
                fontSize: "13px",
                lineHeight: "1.75",
                padding: "12px",
                borderRadius: "8px",
                resize: "none"
              }}
              autoFocus
            />
          ) : content ? (
            <div className="text-sm leading-relaxed whitespace-pre-wrap">
              {content}
              {loading && (
                <span className="inline-block w-2 h-4 ml-0.5 bg-accent-gold animate-pulse align-middle" />
              )}
            </div>
          ) : loading ? (
            <span className="text-text-muted text-sm">Streaming…</span>
          ) : (
            <span className="text-text-muted text-sm">Click Regen to generate.</span>
          )}
        </div>
      )}
    </div>
  );
});

export default AISectionCard;
