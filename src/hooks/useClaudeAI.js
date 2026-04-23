import Anthropic from "@anthropic-ai/sdk";

const MODEL = "claude-sonnet-4-6";

let _client = null;
function client() {
  if (_client) return _client;
  const key = import.meta.env.VITE_ANTHROPIC_API_KEY;
  if (!key) throw new Error("VITE_ANTHROPIC_API_KEY is not set. Copy .env.example to .env and add your key.");
  _client = new Anthropic({ apiKey: key, dangerouslyAllowBrowser: true });
  return _client;
}

export const SYSTEM_PROMPT_BASE = `You are a senior private equity portfolio analyst at a leading private markets consulting firm. Your job is to produce sharp, data-driven, executive-ready quarterly portfolio commentary.

Write like a managing director briefing an investment committee — direct, data-specific, no filler.
Use PE industry language: EBITDA, leverage, covenant, plan vs actual, QoQ, YoY.
Never hedge with phrases like "it appears" or "it seems". State facts and call out risks clearly.
Structure every response exactly as requested. No preamble.`;

export const TONE_PROMPTS = {
  "Deal Team Internal":
    "Audience: internal deal team. Be blunt about underperformance, name specific companies, reference plan variance in numbers, suggest concrete operator actions.",
  "LP Update":
    "Audience: limited partners. Professional and measured tone. Lead with portfolio strength, contextualize risk without minimizing it, avoid overly technical jargon.",
  "Board Memo":
    "Audience: portfolio company board / GP investment committee. Formal, decision-oriented. Flag items requiring board attention and recommend governance actions."
};

export function buildPortfolioContext(fund, quarter, companies) {
  const rows = companies
    .map(
      (c) =>
        `- ${c.company} (${c.sector}): Revenue $${c.revenue}M (plan $${c.revenuePlan}M, ${((c.revenue / c.revenuePlan - 1) * 100).toFixed(1)}% vs plan), EBITDA $${c.ebitda}M (plan $${c.ebitdaPlan}M, margin ${c.ebitdaMargin}%), YoY growth ${c.revenueGrowth}%, Net Debt $${c.netDebt}M`
    )
    .join("\n");
  return `FUND: ${fund}\nQUARTER: ${quarter}\nPORTFOLIO (${companies.length} companies):\n${rows}`;
}

export async function generateNonStream({ system, user, maxTokens = 1200 }) {
  const res = await client().messages.create({
    model: MODEL,
    max_tokens: maxTokens,
    system,
    messages: [{ role: "user", content: user }]
  });
  const text = res.content
    .filter((b) => b.type === "text")
    .map((b) => b.text)
    .join("");
  return text;
}

export async function streamText({ system, user, maxTokens = 1500, onDelta, signal }) {
  const stream = client().messages.stream(
    {
      model: MODEL,
      max_tokens: maxTokens,
      system,
      messages: [{ role: "user", content: user }]
    },
    { signal }
  );
  let full = "";
  for await (const event of stream) {
    if (event.type === "content_block_delta" && event.delta?.type === "text_delta") {
      full += event.delta.text;
      onDelta?.(event.delta.text, full);
    }
  }
  return full;
}

export async function chat({ system, messages, maxTokens = 1200 }) {
  const res = await client().messages.create({
    model: MODEL,
    max_tokens: maxTokens,
    system,
    messages
  });
  return res.content
    .filter((b) => b.type === "text")
    .map((b) => b.text)
    .join("");
}

export function apiKeyConfigured() {
  return Boolean(import.meta.env.VITE_ANTHROPIC_API_KEY);
}
