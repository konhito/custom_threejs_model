"use client";

import { useTranslation } from "../../lib/useTranslation";

export default function ChatPageContent() {
  const { t, isLoading } = useTranslation();
  if (isLoading) return null;
  return <header className="mb-8 max-w-3xl">
    <p className="text-sm font-semibold text-[#2f6b4f]">{t("chatPage.eyebrow")}</p>
    <h1 className="mt-2 text-4xl font-semibold tracking-tight sm:text-5xl">{t("chatPage.title")}</h1>
    <p className="mt-4 text-lg leading-relaxed text-[#496352]">{t("chatPage.description")}</p>
  </header>;
}
