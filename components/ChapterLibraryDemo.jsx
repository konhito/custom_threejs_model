"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, PaymentElement, useElements, useStripe } from "@stripe/react-stripe-js";
import { BookOpen, CreditCard, Headphones, LockKeyhole, LogOut } from "lucide-react";
import { chaptersAPI, customerAuthAPI } from "../lib/api";
import { chapterList, chapterNumber, isPurchased } from "../lib/chapterLibraryDemo.mjs";

function ChapterPayment({ chapter, onPaid, onCancel }) {
  const stripe = useStripe();
  const elements = useElements();
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(event) {
    event.preventDefault();
    if (!stripe || !elements) return;
    setBusy(true);
    setError("");
    const { error: submitError } = await elements.submit();
    if (submitError) { setError(submitError.message); setBusy(false); return; }
    const { error: paymentError, paymentIntent } = await stripe.confirmPayment({
      elements,
      confirmParams: { return_url: `${window.location.origin}/library` },
      redirect: "if_required",
    });
    if (paymentError) { setError(paymentError.message); setBusy(false); return; }
    if (paymentIntent?.status === "succeeded") onPaid();
    else { setError("Payment is still processing. Your chapter will appear after Stripe confirms it."); setBusy(false); }
  }

  return <form onSubmit={submit} className="mt-8 border-t border-[#d7e1d8] pt-6">
    <h3 className="mb-4 flex items-center gap-2 font-semibold"><CreditCard size={18}/> Purchase {chapter.title}</h3>
    <PaymentElement />
    {error && <p role="alert" className="mt-3 text-sm text-red-700">{error}</p>}
    <div className="mt-5 flex gap-3"><button disabled={!stripe || busy} className="rounded-lg bg-[#2f6b4f] px-4 py-2 font-semibold text-white disabled:opacity-50">{busy ? "Processing…" : "Pay securely"}</button><button type="button" onClick={onCancel} className="px-4 py-2 text-sm font-semibold text-[#496352]">Cancel</button></div>
  </form>;
}

export default function ChapterLibraryDemo() {
  const [user, setUser] = useState(null);
  const [chapters, setChapters] = useState([]);
  const [assets, setAssets] = useState([]);
  const [active, setActive] = useState(null);
  const [pdfUrl, setPdfUrl] = useState("");
  const [mode, setMode] = useState("login");
  const [busy, setBusy] = useState(true);
  const [error, setError] = useState("");
  const [checkout, setCheckout] = useState(null);

  async function load() {
    setBusy(true);
    setError("");
    try {
      const me = await customerAuthAPI.me();
      setUser(me.customer || me.user || me.data?.user || me.data || me);
      const [library, bookAssets] = await Promise.all([chaptersAPI.getLibrary(), chaptersAPI.getAssets()]);
      setChapters(chapterList(library));
      setAssets(chapterList(bookAssets));
    } catch {
      setUser(null);
      try { setChapters(chapterList(await chaptersAPI.getAll())); } catch (requestError) { setError(requestError.message); }
    } finally { setBusy(false); }
  }

  useEffect(() => { load(); }, []);
  useEffect(() => () => { if (pdfUrl) URL.revokeObjectURL(pdfUrl); }, [pdfUrl]);

  async function authenticate(event) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    setBusy(true);
    setError("");
    try {
      if (mode === "register") await customerAuthAPI.register({ name: form.get("name"), email: form.get("email"), password: form.get("password") });
      else await customerAuthAPI.login(form.get("email"), form.get("password"));
      await load();
    } catch (requestError) { setError(requestError.message); setBusy(false); }
  }

  async function openChapter(chapter) {
    if (!user || !isPurchased(chapter)) return;
    setBusy(true);
    setError("");
    try {
      const result = await chaptersAPI.getByNumber(chapterNumber(chapter));
      const detail = result.chapter || result.data || result;
      setActive(detail);
      setPdfUrl("");
      if (detail.has_pdf) setPdfUrl(URL.createObjectURL(await chaptersAPI.getFile(chapterNumber(chapter))));
    }
    catch (requestError) { setError(requestError.message); }
    finally { setBusy(false); }
  }

  async function openAsset(asset) {
    setBusy(true);
    setError("");
    try {
      setActive(asset);
      setPdfUrl(URL.createObjectURL(await chaptersAPI.getAssetFile(asset.slug)));
    } catch (requestError) { setError(requestError.message); }
    finally { setBusy(false); }
  }

  async function logout() {
    try { await customerAuthAPI.logout(); } finally { setActive(null); setPdfUrl(""); setCheckout(null); setAssets([]); await load(); }
  }

  async function purchase(chapter) {
    setBusy(true);
    setError("");
    try {
      const response = await chaptersAPI.createCheckout(chapter.id, "eur");
      const payment = response.data;
      setCheckout({ chapter, clientSecret: payment.client_secret, stripe: loadStripe(payment.publishable_key) });
    } catch (requestError) { setError(requestError.message); }
    finally { setBusy(false); }
  }

  async function paymentComplete() {
    setCheckout(null);
    await new Promise((resolve) => setTimeout(resolve, 1200));
    await load();
  }

  const unlocked = chapters.filter(isPurchased).length;
  const title = (chapter) => chapter.title || `Chapter ${String(chapterNumber(chapter)).padStart(2, "0")}`;
  const content = active?.content_text || active?.content || active?.text || active?.body;
  const audioUrl = active?.audioUrl || active?.audio_url;

  return <main className="min-h-screen bg-[#f6f8f4] px-5 py-12 text-[#1e3428] sm:px-8">
    <div className="mx-auto max-w-6xl">
      <Link href="/shop" className="text-sm font-semibold text-[#2f6b4f] hover:underline">← Back to the collection</Link>
      <header className="mt-10 flex flex-wrap items-end justify-between gap-6 border-b border-[#c9d8cc] pb-10">
        <div><p className="text-sm font-semibold text-[#2f6b4f]">Nahiara and the Guardians of the Flowers · Tome I</p><h1 className="mt-3 text-4xl font-semibold tracking-tight sm:text-5xl">Your chapter library</h1></div>
        {user && <div className="text-right"><p className="text-sm text-[#496352]">{user.name || user.email} · {unlocked} purchased</p><button onClick={logout} className="mt-2 inline-flex items-center gap-2 text-sm font-semibold text-[#2f6b4f]"><LogOut size={15}/> Sign out</button></div>}
      </header>

      {error && <p role="alert" className="mt-6 rounded-lg bg-red-50 p-3 text-sm text-red-800">{error}</p>}
      {!user && !busy && <section className="mx-auto mt-10 max-w-md border border-[#c9d8cc] bg-white p-6">
        <h2 className="text-2xl font-semibold">{mode === "login" ? "Sign in to your library" : "Create your account"}</h2>
        <form onSubmit={authenticate} className="mt-6 grid gap-4">
          {mode === "register" && <label className="grid gap-1 text-sm font-medium">Name<input name="name" required className="rounded-lg border border-[#b9cabd] px-3 py-2" /></label>}
          <label className="grid gap-1 text-sm font-medium">Email<input name="email" type="email" autoComplete="email" required className="rounded-lg border border-[#b9cabd] px-3 py-2" /></label>
          <label className="grid gap-1 text-sm font-medium">Password<input name="password" type="password" autoComplete={mode === "login" ? "current-password" : "new-password"} minLength={8} required className="rounded-lg border border-[#b9cabd] px-3 py-2" /></label>
          <button disabled={busy} className="rounded-lg bg-[#2f6b4f] px-4 py-2.5 font-semibold text-white">{mode === "login" ? "Sign in" : "Register"}</button>
        </form>
        <button onClick={() => setMode(mode === "login" ? "register" : "login")} className="mt-4 text-sm font-semibold text-[#2f6b4f]">{mode === "login" ? "Create an account" : "Already have an account? Sign in"}</button>
      </section>}

      {user && <section className="mt-10 grid gap-10 lg:grid-cols-[.85fr_1.15fr]">
        <aside><h2 className="text-xl font-semibold">Chapters</h2><div className="mt-4 divide-y divide-[#d7e1d8] border-y border-[#d7e1d8]">{chapters.map((chapter) => {
          const purchased = isPurchased(chapter); const available = chapter.available_to_purchase; return <div key={chapterNumber(chapter)} className="flex items-center gap-3 px-3 py-3"><span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#e5ebe5] text-xs font-semibold">{purchased ? chapterNumber(chapter) : <LockKeyhole size={14}/>}</span><button disabled={!purchased || busy} onClick={() => openChapter(chapter)} className={`flex-1 text-left text-sm font-medium ${purchased ? "hover:underline" : "text-[#6d7c70]"}`}>{title(chapter)}</button>{purchased ? <span className="text-xs">Purchased</span> : available ? <button disabled={busy} onClick={() => purchase(chapter)} className="rounded-full bg-[#2f6b4f] px-3 py-1.5 text-xs font-semibold text-white">Buy €{chapter.price_eur}</button> : <span className="text-xs text-[#6d7c70]">Locked</span>}</div>;
        })}</div>{assets.length > 0 && <><h2 className="mt-8 text-xl font-semibold">Book extras</h2><div className="mt-4 divide-y divide-[#d7e1d8] border-y border-[#d7e1d8]">{assets.map((asset) => <button key={asset.slug} disabled={busy} onClick={() => openAsset(asset)} className="flex w-full items-center gap-3 px-3 py-3 text-left text-sm font-medium hover:bg-white"><BookOpen size={16}/>{asset.title}</button>)}</div></>}</aside>
        <article className="border border-[#c9d8cc] bg-white p-6 sm:p-8">
          {checkout ? <><p className="text-sm text-[#496352]">Secure payment. Access is granted only after Stripe confirms payment.</p><Elements stripe={checkout.stripe} options={{ clientSecret: checkout.clientSecret }}><ChapterPayment chapter={checkout.chapter} onPaid={paymentComplete} onCancel={() => setCheckout(null)}/></Elements></> : active ? <><div className="flex items-center gap-3 text-[#2f6b4f]"><BookOpen size={20}/><h2 className="font-semibold">{title(active)}</h2></div>{pdfUrl ? <iframe src={pdfUrl} title={title(active)} className="mt-6 h-[70vh] w-full border border-[#d7e1d8]"/> : content ? <div className="mt-8 whitespace-pre-wrap text-lg leading-8 text-[#304a38]">{content}</div> : <p className="mt-8 text-[#496352]">No reading file has been published for this chapter yet.</p>}{audioUrl && <div className="mt-8"><p className="mb-2 flex items-center gap-2 text-sm font-semibold"><Headphones size={17}/> Chapter soundtrack</p><audio controls preload="metadata" className="w-full" src={audioUrl}/></div>}</> : <p className="text-[#496352]">Choose a purchased chapter or buy the next available chapter.</p>}
        </article>
      </section>}
      {busy && <p role="status" className="mt-6 text-sm text-[#496352]">Loading…</p>}
    </div>
  </main>;
}
