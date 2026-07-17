"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

const KEY = "iadf_cookie_consent";

export default function CookieConsent() {
  const [open, setOpen] = useState(false);
  const [configure, setConfigure] = useState(false);
  const [analytics, setAnalytics] = useState(false);

  useEffect(() => {
    const sync = () => setOpen(!localStorage.getItem(KEY));
    const settings = () => { setConfigure(true); setOpen(true); };
    sync();
    window.addEventListener("cookie-settings", settings);
    return () => window.removeEventListener("cookie-settings", settings);
  }, []);

  const save = (value) => {
    localStorage.setItem(KEY, JSON.stringify(value));
    window.dispatchEvent(new Event("privacy-consent-changed"));
    setOpen(false);
  };

  if (!open) return null;
  return <section aria-label="Cookie consent" className="fixed inset-x-4 bottom-4 z-50 mx-auto max-w-2xl rounded-xl border border-gray-700 bg-white p-5 text-gray-900 shadow-lg">
    <h2 className="text-base font-bold">Your privacy choices</h2>
    <p className="mt-2 text-sm leading-6">We use essential storage to keep this choice and optional analytics only if you allow it. Read our <Link className="underline" href="/privacy">Privacy Policy</Link> and <Link className="underline" href="/legal-notice">Legal Notice</Link>.</p>
    {configure && <label className="mt-4 flex items-start gap-3 text-sm"><input type="checkbox" checked={analytics} onChange={(event) => setAnalytics(event.target.checked)} className="mt-1 h-4 w-4" /><span><strong>Analytics cookies</strong><br />Help us understand aggregate site use. Optional.</span></label>}
    <div className="mt-4 flex flex-wrap gap-3"><button type="button" onClick={() => save({ necessary: true, analytics: false })} className="rounded-md border border-gray-700 px-4 py-2 text-sm font-semibold">Reject optional</button><button type="button" onClick={() => setConfigure(true)} className="rounded-md border border-gray-700 px-4 py-2 text-sm font-semibold">Configure</button><button type="button" onClick={() => save({ necessary: true, analytics: configure ? analytics : true })} className="rounded-md bg-gray-900 px-4 py-2 text-sm font-semibold text-white">Accept selected</button></div>
  </section>;
}
