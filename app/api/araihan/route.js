import { NextResponse } from "next/server";
import { buildAraihanSystemPrompt } from "../../../lib/araihanPrompt";

export const runtime = "nodejs";

const MODEL = process.env.OPENROUTER_MODEL || "deepseek/deepseek-v4-flash";
const MAX_MESSAGES = 100;
const MAX_MESSAGE_LENGTH = 1_200;
const MAX_REQUESTS_PER_HOUR = 12;
const requestCounts = new Map();

function isRateLimited(request) {
  const address = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  const now = Date.now();
  const recent = (requestCounts.get(address) || []).filter((timestamp) => now - timestamp < 3_600_000);
  if (recent.length >= MAX_REQUESTS_PER_HOUR) return true;
  recent.push(now);
  requestCounts.set(address, recent);
  return false;
}

function cleanMessages(messages) {
  if (!Array.isArray(messages)) return [];
  return messages
    .filter((message) => message && ["user", "assistant"].includes(message.role) && typeof message.content === "string")
    .slice(0, MAX_MESSAGES)
    .map(({ role, content }) => ({ role, content: content.trim().slice(0, MAX_MESSAGE_LENGTH) }))
    .filter((message) => message.content);
}

function cleanPageContext(value) {
  const path = typeof value?.path === "string" && /^\/[a-z0-9/_-]{0,160}$/i.test(value.path) ? value.path : "/";
  const heading = typeof value?.heading === "string" ? value.heading.replace(/\s+/g, " ").trim().slice(0, 140) : "";
  return { path, heading };
}

export async function POST(request) {
  if (!process.env.OPENROUTER_API_KEY) {
    return NextResponse.json({ error: "Araihan is resting for a moment. Please try again later." }, { status: 503 });
  }

  if (isRateLimited(request)) {
    return NextResponse.json({ error: "Araihan needs a short rest. Please return in an hour." }, { status: 429 });
  }

  try {
    const { messages, locale, detectedCountry, detectedLanguage, pageContext } = await request.json();
    const conversation = cleanMessages(messages);
    if (!conversation.length || conversation.at(-1).role !== "user") {
      return NextResponse.json({ error: "Please send Araihan a question." }, { status: 400 });
    }

    const country = typeof detectedCountry === "string" && /^[A-Za-z]{2}$/.test(detectedCountry.trim())
      ? detectedCountry.trim().toUpperCase()
      : request.headers.get("x-vercel-ip-country") || request.headers.get("cf-ipcountry") || "unknown";
    const language = typeof detectedLanguage === "string" && /^[A-Za-z-]{2,12}$/.test(detectedLanguage.trim())
      ? detectedLanguage.trim()
      : locale;

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
        "HTTP-Referer": process.env.SITE_URL || "https://aquamundi.org",
        "X-OpenRouter-Title": "AquaMundi Araihan",
      },
      body: JSON.stringify({
        model: MODEL,
        messages: [
          { role: "system", content: buildAraihanSystemPrompt(locale, country, language, cleanPageContext(pageContext)) },
          ...conversation,
        ],
        max_tokens: 350,
        temperature: 0.65,
      }),
      signal: AbortSignal.timeout(30_000),
    });

    const result = await response.json().catch(() => ({}));
    const content = result?.choices?.[0]?.message?.content;
    if (!response.ok || typeof content !== "string" || !content.trim()) {
      console.error("Araihan OpenRouter error", response.status, result?.error?.message || "No response content");
      return NextResponse.json({ error: "Araihan could not answer just now. Please try again." }, { status: 502 });
    }

    return NextResponse.json({ message: content.trim() });
  } catch (error) {
    console.error("Araihan request failed", error?.name || "Unknown error");
    return NextResponse.json({ error: "Araihan could not answer just now. Please try again." }, { status: 500 });
  }
}
