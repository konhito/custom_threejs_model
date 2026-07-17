"use client";

import { useEffect, useState } from "react";
import { Analytics } from "@vercel/analytics/next";

const hasConsent = () => {
  try { return JSON.parse(localStorage.getItem("iadf_cookie_consent") || "{}").analytics === true; }
  catch { return false; }
};

export default function ConsentAnalytics() {
  const [enabled, setEnabled] = useState(false);
  useEffect(() => {
    const sync = () => setEnabled(hasConsent());
    sync();
    window.addEventListener("privacy-consent-changed", sync);
    return () => window.removeEventListener("privacy-consent-changed", sync);
  }, []);
  return enabled ? <Analytics /> : null;
}
