"use client";

import { useEffect, useRef, useState } from "react";
import { Send } from "lucide-react";

const welcome = "I am Araihan, faithful squire of Nahiara. Shall we follow a flower's trail together?";
const prompts = ["What is AquaMundi?", "How do flowers and pollinators help one another?", "Tell me about the Flower Archive"];

function getLocale() {
  const cookie = document.cookie.split("; ").find((value) => value.startsWith("NEXT_LOCALE="));
  return cookie?.split("=")[1] || "en";
}

export default function AraihanChat() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState("");
  const inputRef = useRef(null);
  const feedRef = useRef(null);

  useEffect(() => inputRef.current?.focus(), []);

  useEffect(() => {
    feedRef.current?.scrollTo({ top: feedRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, isSending, error]);

  async function sendMessage(event) {
    event.preventDefault();
    const content = input.trim();
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
        body: JSON.stringify({ messages: nextMessages, locale: getLocale() }),
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
    setInput(prompt);
    inputRef.current?.focus();
  }

  return (
    <section className="flex min-h-[34rem] w-full flex-col overflow-hidden rounded-2xl bg-[#153527] text-white shadow-[0_8px_24px_rgba(10,36,23,0.28)]" aria-label="Talk with Araihan">
      <header className="border-b border-white/20 px-5 py-4">
        <p className="text-lg font-semibold">Araihan</p>
        <p className="text-sm text-emerald-100">Faithful squire of Nahiara</p>
      </header>

      <div ref={feedRef} className="flex-1 space-y-3 overflow-y-auto bg-[#f6f8f4] p-5 text-sm text-[#1e3428]" aria-live="polite">
        <p className="max-w-[90%] rounded-xl bg-white px-3 py-2 leading-relaxed shadow-sm">{welcome}</p>
        {!messages.length && (
          <div className="flex flex-wrap gap-2">
            {prompts.map((prompt) => (
              <button key={prompt} type="button" onClick={() => usePrompt(prompt)} className="rounded-full border border-[#a7bba9] bg-white px-3 py-1.5 text-left text-xs font-medium text-[#24543e] transition hover:bg-[#e7f0e8] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2f6b4f]">
                {prompt}
              </button>
            ))}
          </div>
        )}
        {messages.map((message, index) => (
          <p key={`${message.role}-${index}`} className={`max-w-[90%] rounded-xl px-3 py-2 leading-relaxed ${message.role === "user" ? "ml-auto bg-[#2f6b4f] text-white" : "bg-white shadow-sm"}`}>
            {message.content}
          </p>
        ))}
        {isSending && <p className="max-w-max rounded-xl bg-white px-3 py-2 text-[#496352] shadow-sm">Araihan is gathering his thoughts...</p>}
        {error && <p className="rounded-xl bg-[#fff1ed] px-3 py-2 text-[#8a2c17]">{error}</p>}
      </div>

      <form onSubmit={sendMessage} className="flex gap-2 border-t border-[#d6e0d8] bg-white p-4">
        <label className="sr-only" htmlFor="araihan-message">Your message</label>
        <input ref={inputRef} id="araihan-message" value={input} onChange={(event) => setInput(event.target.value)} maxLength={1200} placeholder="Ask Araihan about flowers..." className="min-w-0 flex-1 rounded-lg border border-[#9bb6a3] px-3 py-2 text-sm text-[#193325] placeholder:text-[#506a59] focus:border-[#2f6b4f] focus:outline-none focus:ring-2 focus:ring-[#2f6b4f]/25" />
        <button type="submit" disabled={isSending || !input.trim()} className="rounded-lg bg-[#2f6b4f] p-2.5 text-white transition hover:bg-[#24543e] disabled:cursor-not-allowed disabled:opacity-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2f6b4f]" aria-label="Send message">
          <Send size={18} />
        </button>
      </form>

    </section>
  );
}
