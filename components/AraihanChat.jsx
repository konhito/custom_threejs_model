"use client";

import { useEffect, useRef, useState } from "react";
import { Send, X } from "lucide-react";
import { usePathname } from "next/navigation";
import { detectUserCountry } from "../lib/languageDetection";
import { useTranslation } from "../lib/useTranslation";

function visiblePageContext(pathname) {
  const headings = [...document.querySelectorAll("[data-araihan-context], h1, h2")];
  const heading = headings.sort((a, b) => Math.abs(a.getBoundingClientRect().top) - Math.abs(b.getBoundingClientRect().top))[0]?.textContent?.replace(/\s+/g, " ").trim().slice(0, 140);
  return { path: pathname || "/", heading: heading || "" };
}

export default function AraihanChat({ compact = false, onClose }) {
  const pathname = usePathname();
  const { locale, messages: translations } = useTranslation();
  const text = translations?.araihanChat;
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState("");
  const [detectedCountry, setDetectedCountry] = useState("");
  const [isDetecting, setIsDetecting] = useState(true);
  const inputRef = useRef(null);
  const feedRef = useRef(null);
  const pageContextRef = useRef({ path: pathname || "/", heading: "" });

  useEffect(() => {
    if (text) setMessages([{ role: "assistant", content: text.welcome }]);
  }, [text]);

  useEffect(() => {
    let active = true;
    detectUserCountry().then((country) => {
      if (!active) return;
      setDetectedCountry(country || "");
      setIsDetecting(false);
      inputRef.current?.focus();
    });
    return () => { active = false; };
  }, []);

  useEffect(() => {
    let frame = 0;
    const update = () => { pageContextRef.current = visiblePageContext(pathname); };
    const onScroll = () => { if (!frame) frame = requestAnimationFrame(() => { frame = 0; update(); }); };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => { window.removeEventListener("scroll", onScroll); if (frame) cancelAnimationFrame(frame); };
  }, [pathname]);

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
        body: JSON.stringify({ messages: nextMessages.slice(1), locale, detectedCountry, detectedLanguage: locale, pageContext: pageContextRef.current }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || text.error);
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

  if (!text) return null;
  const starters = compact ? text.starters.slice(0, 2) : text.starters;
  const followUps = compact ? text.followUps.slice(0, 2) : text.followUps;

  return (
    <section className={`flex w-full flex-col overflow-hidden bg-[#153527] text-white ${compact ? "h-[26rem] max-h-[calc(100vh-6.5rem)]" : "min-h-[36rem] rounded-2xl shadow-[0_8px_24px_rgba(10,36,23,0.28)]"}`} aria-label={text.talkAriaLabel}>
      <header className={`flex items-center justify-between border-b border-white/20 ${compact ? "px-4 py-3" : "px-5 py-4"}`}>
        <div>
          <p className={`${compact ? "text-base" : "text-lg"} font-semibold`}>{text.name}</p>
          <p className="text-xs text-emerald-100">{text.subtitle}</p>
        </div>
        {compact ? <button type="button" onClick={onClose} className="rounded-full p-1.5 text-emerald-50 transition hover:bg-white/10" aria-label={text.closeAriaLabel}><X size={17}/></button> : <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-medium text-emerald-50">{text.guidedConversation}</span>}
      </header>

      <div ref={feedRef} data-lenis-prevent className={`flex-1 touch-pan-y overscroll-contain space-y-3 overflow-y-auto bg-[#f6f8f4] text-sm text-[#1e3428] ${compact ? "p-4" : "p-5"}`} aria-live="polite">
        {messages.length === 1 && (
          <div className="pt-1">
            <p className="mb-2 text-xs font-semibold text-[#496352]">{text.start}</p>
            <div className="flex flex-wrap gap-2">
            {starters.map((prompt) => (
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
                  {followUps.map((prompt) => (
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

      <form onSubmit={sendMessage} className={`flex gap-2 border-t border-[#d6e0d8] bg-white ${compact ? "p-3" : "p-4"}`}>
        <label className="sr-only" htmlFor="araihan-message">{text.yourMessage}</label>
        <input ref={inputRef} id="araihan-message" value={input} onFocus={() => { pageContextRef.current = visiblePageContext(pathname); }} onChange={(event) => setInput(event.target.value)} maxLength={1200} disabled={isDetecting} placeholder={text.placeholder} className="min-w-0 flex-1 rounded-lg border border-[#9bb6a3] px-3 py-2 text-sm text-[#193325] placeholder:text-[#506a59] focus:border-[#2f6b4f] focus:outline-none focus:ring-2 focus:ring-[#2f6b4f]/25 disabled:opacity-60" />
        <button type="submit" disabled={isDetecting || isSending || !input.trim()} className="rounded-lg bg-[#2f6b4f] p-2.5 text-white transition hover:bg-[#24543e] disabled:cursor-not-allowed disabled:opacity-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2f6b4f]" aria-label={text.sendAriaLabel}>
          <Send size={18} />
        </button>
      </form>

    </section>
  );
}
