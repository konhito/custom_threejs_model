"use client";

import { useEffect, useRef, useState } from "react";
import { Send } from "lucide-react";
import { detectUserCountry } from "../lib/languageDetection";

const SPANISH_COUNTRIES = new Set(["AR", "BO", "CL", "CO", "CR", "CU", "DO", "EC", "ES", "GT", "HN", "MX", "NI", "PA", "PE", "PR", "PY", "SV", "UY", "VE"]);
const GERMAN_COUNTRIES = new Set(["AT", "CH", "DE"]);
const copy = {
  en: {
    welcome: "I am Araihan, faithful squire of Nahiara. Shall we follow a flower's trail together?",
    starters: ["What is AquaMundi?", "How do flowers and pollinators help one another?", "Which books are available in the shop?"],
    followUps: ["Tell me about the Flower Archive", "Which books are available in the shop?", "Help me explore a flower"],
    start: "Start here", explore: "Keep exploring", thinking: "Araihan is gathering his thoughts...", placeholder: "Ask Araihan about flowers...",
  },
  es: {
    welcome: "Soy Araihan, fiel escudero de Nahiara. ¿Seguimos juntos el rastro de una flor?",
    starters: ["¿Qué es AquaMundi?", "¿Cómo se ayudan las flores y los polinizadores?", "¿Qué libros están disponibles en la tienda?"],
    followUps: ["Háblame del Archivo de Flores", "¿Qué libros están disponibles en la tienda?", "Ayúdame a explorar una flor"],
    start: "Empieza aquí", explore: "Sigue explorando", thinking: "Araihan está reuniendo sus pensamientos...", placeholder: "Pregunta a Araihan sobre las flores...",
  },
  de: {
    welcome: "Ich bin Araihan, Nahiaras treuer Knappe. Wollen wir gemeinsam der Spur einer Blume folgen?",
    starters: ["Was ist AquaMundi?", "Wie helfen sich Blumen und Bestäuber gegenseitig?", "Welche Bücher sind im Shop erhältlich?"],
    followUps: ["Erzähl mir vom Blumenarchiv", "Welche Bücher sind im Shop erhältlich?", "Hilf mir, eine Blume zu entdecken"],
    start: "Hier beginnen", explore: "Weiter entdecken", thinking: "Araihan sammelt seine Gedanken...", placeholder: "Frage Araihan nach Blumen...",
  },
};

function languageFor(country) {
  const code = String(country || "").toUpperCase();
  if (SPANISH_COUNTRIES.has(code)) return "es";
  if (GERMAN_COUNTRIES.has(code)) return "de";
  return "en";
}

export default function AraihanChat({ compact = false }) {
  const [messages, setMessages] = useState([{ role: "assistant", content: copy.en.welcome }]);
  const [input, setInput] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState("");
  const [detectedCountry, setDetectedCountry] = useState("");
  const [detectedLanguage, setDetectedLanguage] = useState("en");
  const [isDetecting, setIsDetecting] = useState(true);
  const inputRef = useRef(null);
  const feedRef = useRef(null);

  useEffect(() => {
    let active = true;
    detectUserCountry().then((country) => {
      if (!active) return;
      const language = languageFor(country);
      setDetectedCountry(country || "");
      setDetectedLanguage(language);
      setMessages([{ role: "assistant", content: copy[language].welcome }]);
      setIsDetecting(false);
      inputRef.current?.focus();
    });
    return () => { active = false; };
  }, []);

  useEffect(() => {
    feedRef.current?.scrollTo({ top: feedRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, isSending, error]);

  async function sendMessage(event, prompt) {
    event?.preventDefault();
    const content = (prompt || input).trim();
    if (!content || isSending) return;

    const nextMessages = [...messages, { role: "user", content }];
    setMessages(nextMessages);
    setInput("");
    setError("");
    setIsSending(true);

    try {
      const response = await fetch("/api/araihan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: nextMessages.slice(1), locale: detectedLanguage, detectedCountry, detectedLanguage }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Araihan could not answer just now.");
      setMessages((current) => [...current, { role: "assistant", content: result.message }]);
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setIsSending(false);
    }
  }

  function usePrompt(prompt) {
    sendMessage(null, prompt);
  }

  const text = copy[detectedLanguage];

  return (
    <section className={`flex w-full flex-col overflow-hidden bg-[#153527] text-white ${compact ? "min-h-[31rem] max-h-[min(42rem,calc(100vh-8rem))]" : "min-h-[36rem] rounded-2xl shadow-[0_8px_24px_rgba(10,36,23,0.28)]"}`} aria-label="Talk with Araihan">
      <header className="flex items-center justify-between border-b border-white/20 px-5 py-4">
        <div>
          <p className="text-lg font-semibold">Araihan</p>
          <p className="text-sm text-emerald-100">Faithful squire of Nahiara</p>
        </div>
        <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-medium text-emerald-50">Guided conversation</span>
      </header>

      <div ref={feedRef} className="flex-1 space-y-3 overflow-y-auto bg-[#f6f8f4] p-5 text-sm text-[#1e3428]" aria-live="polite">
        {messages.length === 1 && (
          <div className="pt-1">
            <p className="mb-2 text-xs font-semibold text-[#496352]">{text.start}</p>
            <div className="flex flex-wrap gap-2">
            {text.starters.map((prompt) => (
              <button key={prompt} type="button" onClick={() => usePrompt(prompt)} disabled={isSending || isDetecting} className="rounded-full border border-[#a7bba9] bg-white px-3 py-1.5 text-left text-xs font-medium text-[#24543e] transition hover:bg-[#e7f0e8] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2f6b4f] disabled:cursor-not-allowed disabled:opacity-50">
                {prompt}
              </button>
            ))}
            </div>
          </div>
        )}
        {messages.map((message, index) => (
          <div key={`${message.role}-${index}`} className={message.role === "user" ? "ml-auto max-w-[88%]" : "max-w-[88%]"}>
            <p className={`rounded-xl px-3 py-2.5 leading-relaxed ${message.role === "user" ? "bg-[#2f6b4f] text-white" : "bg-white shadow-sm"}`}>
              {message.content}
            </p>
            {message.role === "assistant" && (
              <div className="mt-2">
                <p className="mb-1.5 text-xs font-semibold text-[#496352]">{text.explore}</p>
                <div className="flex flex-wrap gap-1.5">
                  {text.followUps.map((prompt) => (
                    <button key={`${index}-${prompt}`} type="button" onClick={() => usePrompt(prompt)} disabled={isSending} className="rounded-full border border-[#a7bba9] bg-white px-2.5 py-1 text-left text-xs font-medium text-[#24543e] transition hover:bg-[#e7f0e8] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2f6b4f] disabled:cursor-not-allowed disabled:opacity-50">
                      {prompt}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
        {isSending && <p className="max-w-max rounded-xl bg-white px-3 py-2 text-[#496352] shadow-sm">{text.thinking}</p>}
        {error && <p role="alert" className="rounded-xl bg-[#fff1ed] px-3 py-2 text-[#8a2c17]">{error}</p>}
      </div>

      <form onSubmit={sendMessage} className="flex gap-2 border-t border-[#d6e0d8] bg-white p-4">
        <label className="sr-only" htmlFor="araihan-message">Your message</label>
        <input ref={inputRef} id="araihan-message" value={input} onChange={(event) => setInput(event.target.value)} maxLength={1200} disabled={isDetecting} placeholder={text.placeholder} className="min-w-0 flex-1 rounded-lg border border-[#9bb6a3] px-3 py-2 text-sm text-[#193325] placeholder:text-[#506a59] focus:border-[#2f6b4f] focus:outline-none focus:ring-2 focus:ring-[#2f6b4f]/25 disabled:opacity-60" />
        <button type="submit" disabled={isDetecting || isSending || !input.trim()} className="rounded-lg bg-[#2f6b4f] p-2.5 text-white transition hover:bg-[#24543e] disabled:cursor-not-allowed disabled:opacity-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2f6b4f]" aria-label="Send message">
          <Send size={18} />
        </button>
      </form>

    </section>
  );
}
