"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, PaymentElement, useElements, useStripe } from "@stripe/react-stripe-js";
import { ArrowLeft, BookOpen, CreditCard, Download, LockKeyhole, LogIn, LogOut, X } from "lucide-react";
import { MusicToggleButton } from "./MusicToggleButton";
import ChapterPdfReader from "./ChapterPdfReader";
import styles from "./ChapterLibraryDemo.module.css";
import { chaptersAPI, customerAuthAPI, customerGoogleAuthUrl } from "../lib/api";
import { chapterList, chapterNumber, isPurchased } from "../lib/chapterLibraryDemo.mjs";

const countries = ["South Africa", "Nigeria", "Egypt", "Ethiopia", "Morocco", "Tanzania", "Pakistan", "India", "Indonesia", "Malaysia", "Thailand", "China", "USA", "Canada", "Mexico", "Guatemala", "Costa Rica", "Colombia", "Venezuela", "Argentina", "Peru", "Panama", "France", "Germany", "England", "Spain", "Scotland", "Ireland"];
const cells = [
  { label: "Credits", type: "open" }, { label: "Index", type: "open" },
  ...Array.from({ length: 6 }, (_, index) => ({ label: `Chapter ${index + 1}`, chapter: index + 1, type: index < 3 ? "free" : "chapter" })),
  { label: "Interlude I", type: "interlude" },
  ...Array.from({ length: 5 }, (_, index) => ({ label: `Chapter ${index + 7}`, chapter: index + 7, type: "chapter" })),
  { label: "Interlude II", type: "interlude" },
  ...Array.from({ length: 25 }, (_, index) => ({ label: `Chapter ${index + 12}`, chapter: index + 12, type: "chapter" })),
  { label: "Appendices", type: "closing", sub: "SAN · PFNO · Glossary" }, { label: "Epilogue", type: "closing" },
].map((cell, index) => ({ ...cell, id: index + 1, sub: cell.sub || (cell.chapter && cell.chapter <= 28 ? countries[cell.chapter - 1] : "") }));

function HoneyCell({ cell, owned, onOpen }) {
  const available = cell.type === "open" || cell.type === "free" || owned;
  const color = cell.type === "open" ? "border-stone-300 bg-stone-100 text-stone-600" : cell.type === "interlude" ? "border-violet-300 bg-violet-100 text-violet-950" : cell.type === "closing" ? "border-emerald-300 bg-emerald-100 text-emerald-950" : available ? "border-amber-400 bg-amber-300 text-stone-950" : "border-stone-300 bg-stone-100 text-stone-400";
  return <button onClick={() => onOpen(cell)} style={{ "--cell-delay": cell.id }} className={`${styles.cell} ${available ? styles.ready : ""} group relative aspect-[1/.88] w-full min-w-0 [clip-path:polygon(50%_0,100%_25%,100%_75%,50%_100%,0_75%,0_25%)] border-2 p-1 transition hover:scale-[1.04] focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-300 ${color}`} aria-label={`${cell.label}${available ? "" : ", locked"}`}>
    <span className="flex h-full w-full flex-col items-center justify-center [clip-path:inherit] px-1.5 text-center">
      {!available && <LockKeyhole size={14} className="mb-1" />}
      <span className="break-words text-[9px] font-bold uppercase leading-[1.1] sm:text-[11px]">{cell.label}</span>
      {cell.sub && <span className="mt-0.5 break-words text-[8px] leading-tight opacity-70 sm:text-[10px]">{cell.sub}</span>}
      {cell.type === "free" && <span className="mt-1 rounded-full bg-stone-950/15 px-1.5 py-0.5 text-[8px] font-black">FREE</span>}
    </span>
  </button>;
}

function Reader({ active, pdfUrl, onClose }) {
  const [soundUrl, setSoundUrl] = useState("");
  const audioUrl = soundUrl;
  const hasSoundtrack = Boolean(active?.audio_url);
  const number = chapterNumber(active);
  useEffect(() => {
    let cancelled = false;
    let objectUrl = "";
    setSoundUrl("");
    if (!hasSoundtrack) return undefined;
    chaptersAPI.getAudio(number).then((blob) => {
      if (cancelled) return;
      objectUrl = URL.createObjectURL(blob);
      setSoundUrl(objectUrl);
    }).catch(() => setSoundUrl(""));
    return () => { cancelled = true; if (objectUrl) URL.revokeObjectURL(objectUrl); };
  }, [hasSoundtrack, number]);
  return <main className="min-h-screen bg-[#f7f5ef] text-stone-900">
    <section>
      <header className="sticky top-0 z-10 flex items-center justify-between border-b border-stone-300 bg-[#f7f5ef]/95 px-5 py-4 backdrop-blur sm:px-10"><button onClick={onClose} className="inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-stone-700 hover:text-stone-950"><ArrowLeft size={18}/> Back to library</button><div className="flex items-center gap-2">{soundUrl && <MusicToggleButton src={soundUrl} autoPlay volume={0.12}/>} {pdfUrl && <a href={pdfUrl} download={`${active.title || "chapter"}.pdf`} className="inline-flex min-h-11 items-center gap-2 px-2 text-sm font-semibold text-stone-700 hover:text-stone-950" aria-label="Download chapter PDF"><Download size={17}/><span className="hidden sm:inline">Download PDF</span></a>}<span className="hidden text-xs font-bold uppercase tracking-[.18em] text-amber-700 sm:block">Tomo I · Digital edition</span></div></header>
      {pdfUrl ? <ChapterPdfReader file={pdfUrl} title={active.title} summary={active.summary} content={active.content_text} /> : <div className="grid min-h-[50vh] place-items-center p-8 text-center text-stone-500"><BookOpen className="mb-3"/><p>This chapter is being prepared for the digital library.</p></div>}
    </section>
  </main>;
}

function ChapterPayment({ chapter, onPaid, onCancel }) {
  const stripe = useStripe(); const elements = useElements(); const [busy, setBusy] = useState(false); const [error, setError] = useState("");
  async function submit(event) {
    event.preventDefault(); if (!stripe || !elements) return; setBusy(true); setError("");
    const { error: submitError } = await elements.submit();
    if (submitError) { setError(submitError.message); setBusy(false); return; }
    const { error: paymentError, paymentIntent } = await stripe.confirmPayment({ elements, confirmParams: { return_url: `${window.location.origin}/library` }, redirect: "if_required" });
    if (paymentError) { setError(paymentError.message); setBusy(false); return; }
    if (paymentIntent?.status === "succeeded") onPaid(); else { setError("Payment is processing. Your chapter will appear after confirmation."); setBusy(false); }
  }
  return <form onSubmit={submit} className="p-6 sm:p-8"><p className="mb-5 flex items-center gap-2 text-sm font-semibold text-stone-700"><CreditCard size={17}/> Secure payment for {chapter.title}</p><PaymentElement />{error && <p role="alert" className="mt-3 text-sm text-red-700">{error}</p>}<div className="mt-5 flex gap-3"><button disabled={!stripe || busy} className="rounded-xl bg-stone-900 px-4 py-3 text-sm font-bold text-white disabled:opacity-50">{busy ? "Processing…" : "Pay securely"}</button><button type="button" onClick={onCancel} className="px-3 text-sm font-semibold text-stone-600">Cancel</button></div></form>;
}

export default function ChapterLibraryDemo() {
  const [user, setUser] = useState(null); const [chapters, setChapters] = useState([]); const [active, setActive] = useState(null); const [pdfUrl, setPdfUrl] = useState("");
  const [mode, setMode] = useState("login"); const [busy, setBusy] = useState(true); const [error, setError] = useState(""); const [checkout, setCheckout] = useState(null);
  async function load() { setBusy(true); try { const me = await customerAuthAPI.me(); setUser(me.customer || me.user || me.data?.user || me.data || me); setChapters(chapterList(await chaptersAPI.getLibrary())); } catch { setUser(null); setChapters(chapterList(await chaptersAPI.getAll())); } finally { setBusy(false); } }
  useEffect(() => { load().catch((requestError) => setError(requestError.message)); }, []);
  useEffect(() => () => { if (pdfUrl) URL.revokeObjectURL(pdfUrl); }, [pdfUrl]);
  const chapterFor = (number) => chapters.find((chapter) => chapterNumber(chapter) === number);
  const nextChapter = chapters.find((chapter) => chapterNumber(chapter) > 3 && !isPurchased(chapter));
  const chapterPrice = nextChapter?.price_eur ? `€${Number(nextChapter.price_eur).toFixed(2)}` : "";
  async function open(cell) {
    if (!cell.chapter) return;
    const chapter = chapterFor(cell.chapter); const allowed = cell.chapter <= 3 || (user && isPurchased(chapter || {}));
    if (!allowed) { if (!user) { setError("Sign in first to purchase and keep your chapters unlocked."); return; } if (chapter?.available_to_purchase || chapters.filter((item) => chapterNumber(item) > 3 && !isPurchased(item))[0] === chapter) { purchase(chapter); return; } setError("Read the previous chapter before unlocking this petal."); return; }
    setBusy(true); setError("");
    try { const result = cell.chapter <= 3 ? await chaptersAPI.getFreeByNumber(cell.chapter) : await chaptersAPI.getByNumber(cell.chapter); const detail = result.chapter || result.data || result; setActive(detail); if (detail.has_pdf) setPdfUrl(URL.createObjectURL(await (cell.chapter <= 3 ? chaptersAPI.getFreeFile(cell.chapter) : chaptersAPI.getFile(cell.chapter)))); } catch (requestError) { setError(requestError.message); } finally { setBusy(false); }
  }
  async function authenticate(event) { event.preventDefault(); const form = new FormData(event.currentTarget); setBusy(true); setError(""); try { if (mode === "register") await customerAuthAPI.register({ name: form.get("name"), email: form.get("email"), password: form.get("password") }); else await customerAuthAPI.login(form.get("email"), form.get("password")); await load(); } catch (requestError) { setError(requestError.message); setBusy(false); } }
  async function logout() { await customerAuthAPI.logout(); setUser(null); await load(); }
  async function purchase(chapter) { setBusy(true); setError(""); try { const response = await chaptersAPI.createCheckout(chapter.id, "eur"); const payment = response.data || response; setCheckout({ chapter, clientSecret: payment.client_secret, stripe: loadStripe(payment.publishable_key) }); } catch (requestError) { setError(requestError.message); } finally { setBusy(false); } }
  async function paymentComplete() { setCheckout(null); await new Promise((resolve) => window.setTimeout(resolve, 1000)); await load(); }
  const unlocked = (number) => number <= 3 || Boolean(user && isPurchased(chapterFor(number) || {}));
  if (active) return <Reader active={active} pdfUrl={pdfUrl} onClose={() => { setActive(null); setPdfUrl(""); }}/>
  return <main className={`${styles.library} ${user ? styles.signedIn : ""} min-h-screen px-4 py-10 text-stone-900 sm:px-8`}>
    <div className={`mx-auto w-full ${user ? "max-w-[78rem]" : "max-w-6xl"}`}><header className="border-b border-stone-200 pb-10"><div className="flex flex-wrap items-start justify-between gap-5"><div><Link href="/shop" className="text-sm font-semibold text-amber-700 hover:text-amber-800">← Return to shop</Link><p className="mt-8 text-xs font-semibold uppercase tracking-[.25em] text-stone-400">AquaMundi · Universo Nahiara</p><h1 className="mt-3 text-5xl font-bold leading-[.95] tracking-tight text-stone-900 sm:text-7xl" style={{ fontFamily: '"Cormorant Garamond", serif' }}>Stories that<br/><span className="font-normal italic">keep blooming</span></h1><p className="mt-5 max-w-2xl text-base leading-relaxed text-stone-500">Tomo I · Read chapters 1 to 3 free, then unlock one chapter at a time. The printed book is purchased separately.</p></div>{user ? <div className="rounded-xl border border-stone-200 bg-stone-50 px-4 py-3 text-right text-sm"><p>{user.name || user.email}</p><button onClick={logout} className="mt-2 inline-flex items-center gap-2 font-semibold text-amber-700"><LogOut size={15}/> Sign out</button></div> : <Link href="#library-login" className="rounded-full bg-stone-900 px-5 py-3 text-sm font-bold text-white hover:bg-stone-800">Sign in to unlock chapters</Link>}</div><p className="mt-8 text-sm text-stone-500">Digital ISBN: <span className="font-semibold text-stone-700">978-84-09-79252-8</span></p></header>
      {(!user || nextChapter) && <section className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-amber-200 bg-amber-50 px-5 py-4 text-stone-900"><div><p className="font-semibold">{user ? `Next to unlock: Chapter ${chapterNumber(nextChapter)}` : "Your reading path starts free"}</p><p className="mt-1 text-sm text-stone-600">{user ? `${nextChapter.title || "Continue the story"}${chapterPrice ? ` · ${chapterPrice}` : ""}` : "Read chapters 1 to 3, then sign in to unlock the next chapter."}</p></div>{user ? <button onClick={() => purchase(nextChapter)} disabled={busy || !nextChapter.available_to_purchase} className="rounded-xl bg-stone-900 px-4 py-3 text-sm font-bold text-white hover:bg-stone-800 disabled:cursor-not-allowed disabled:opacity-50">{nextChapter.available_to_purchase ? `Unlock Chapter ${chapterNumber(nextChapter)}${chapterPrice ? ` · ${chapterPrice}` : ""}` : "Read the previous chapter first"}</button> : <Link href="#library-login" className="rounded-xl bg-stone-900 px-4 py-3 text-sm font-bold text-white hover:bg-stone-800">Create reader account</Link>}</section>}
      {!user && <a href={customerGoogleAuthUrl} className="mt-6 inline-flex items-center gap-3 rounded-xl border border-stone-300 bg-white px-4 py-3 text-sm font-semibold text-stone-800 transition hover:bg-stone-50"><span className="grid h-5 w-5 place-items-center rounded-full bg-white text-xs font-bold text-[#4285f4]">G</span>Continue with Google</a>}
      {error && <p role="alert" className="mt-6 rounded-xl border border-red-300/40 bg-red-950/50 px-4 py-3 text-sm text-red-100">{error}</p>}
      {!user && !busy && <section id="library-login" className="mt-10 grid overflow-hidden rounded-3xl border border-amber-200/20 bg-white text-stone-900 shadow-2xl md:grid-cols-[1fr_1.15fr]"><aside className="bg-[linear-gradient(145deg,#f4a51c,#ffd970)] p-7 text-stone-950 sm:p-10"><p className="text-xs font-black uppercase tracking-[.2em]">Your private garden</p><h2 className="mt-4 text-3xl font-semibold">Pick up your story where it blooms.</h2><p className="mt-4 text-sm leading-6">Sign in to see your unlocked petals and read from any device. Chapters 1 to 3 are always free.</p></aside><div className="p-7 sm:p-10"><h2 className="text-2xl font-semibold">{mode === "login" ? "Welcome back" : "Create your reader account"}</h2><p className="mt-2 text-sm text-stone-500">{mode === "login" ? "Your library opens after a secure sign in." : "One account keeps your chapters together."}</p><form onSubmit={authenticate} className="mt-6 grid gap-4">{mode === "register" && <label className="grid gap-1 text-sm font-semibold">Name<input name="name" required className="rounded-xl border border-stone-300 px-3 py-3 font-normal outline-none focus:border-amber-600 focus:ring-2 focus:ring-amber-100"/></label>}<label className="grid gap-1 text-sm font-semibold">Email<input name="email" type="email" autoComplete="email" required className="rounded-xl border border-stone-300 px-3 py-3 font-normal outline-none focus:border-amber-600 focus:ring-2 focus:ring-amber-100"/></label><label className="grid gap-1 text-sm font-semibold">Password<input name="password" type="password" autoComplete={mode === "login" ? "current-password" : "new-password"} minLength={8} required className="rounded-xl border border-stone-300 px-3 py-3 font-normal outline-none focus:border-amber-600 focus:ring-2 focus:ring-amber-100"/></label><button disabled={busy} className="mt-2 inline-flex items-center justify-center gap-2 rounded-xl bg-stone-900 px-4 py-3 font-bold text-white hover:bg-stone-800 disabled:opacity-50"><LogIn size={17}/>{mode === "login" ? "Open my library" : "Create account"}</button></form><button onClick={() => setMode(mode === "login" ? "register" : "login")} className="mt-5 text-sm font-semibold text-amber-700 hover:underline">{mode === "login" ? "New here? Create an account" : "Already a reader? Sign in"}</button></div></section>}
      <section className={`${styles.hive} mt-10 rounded-3xl border p-3 sm:p-7`}><div className="mb-6 flex flex-wrap items-center justify-between gap-3"><div><p className="text-xs font-semibold uppercase tracking-[.2em] text-stone-400">The reading path</p><h2 className="mt-2 text-4xl font-semibold" style={{ fontFamily: '"Cormorant Garamond", serif' }}>42 cells, one journey</h2><p className="mt-2 text-sm text-stone-500">Gold petals are ready to read. Your next chapter opens in sequence.</p></div><span className="rounded-full border border-amber-300/30 px-3 py-1 text-xs font-bold text-amber-200">{chapters.filter(isPurchased).length} unlocked</span></div><div className={`mx-auto grid grid-cols-3 gap-2 sm:grid-cols-5 sm:gap-3 xl:grid-cols-7 ${user ? "max-w-[70rem]" : "max-w-5xl"}`}>{cells.map((cell) => <HoneyCell key={cell.id} cell={cell} owned={cell.chapter ? unlocked(cell.chapter) : true} onOpen={open}/>)}</div><div className="mt-6 flex flex-wrap gap-4 text-xs text-slate-400"><span>Gold: free or yours</span><span>Violet: interlude</span><span>Green: closing materials</span><span>Grey: locked</span></div></section>
    </div>
    {checkout && <div className="fixed inset-0 z-[110] grid place-items-center bg-slate-950/90 p-4 backdrop-blur-sm"><section className="max-h-[92vh] w-full max-w-lg overflow-auto rounded-2xl bg-white shadow-2xl"><header className="flex items-center justify-between border-b border-stone-200 px-6 py-4"><div><p className="text-xs font-bold uppercase tracking-[.18em] text-amber-700">Unlock the next petal</p><h2 className="mt-1 text-lg font-semibold text-stone-900">{checkout.chapter.title}</h2></div><button onClick={() => setCheckout(null)} className="rounded-full p-2 text-stone-600 hover:bg-stone-100" aria-label="Close checkout"><X size={19}/></button></header><Elements stripe={checkout.stripe} options={{ clientSecret: checkout.clientSecret }}><ChapterPayment chapter={checkout.chapter} onPaid={paymentComplete} onCancel={() => setCheckout(null)}/></Elements></section></div>}
  </main>;
}
