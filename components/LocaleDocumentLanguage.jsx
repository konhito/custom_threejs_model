"use client";

import { useEffect } from "react";
import { useTranslation } from "../lib/useTranslation";

export default function LocaleDocumentLanguage() {
  const { locale, isLoading } = useTranslation();
  useEffect(() => {
    if (!isLoading) document.documentElement.lang = locale;
  }, [locale, isLoading]);
  return null;
}
