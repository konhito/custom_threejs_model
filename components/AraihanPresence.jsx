"use client";

import { MessageCircle, X } from "lucide-react";
import { usePathname } from "next/navigation";
import { useState } from "react";
import AraihanChat from "./AraihanChat";

export default function AraihanPresence() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  if (pathname === "/chat" || pathname.startsWith("/admin")) return null;

  return <aside className="fixed bottom-5 right-4 z-[120] sm:bottom-6 sm:right-6" aria-label="Araihan, companion of the Nahiara Universe">
    {open && <div className="mb-3 w-[min(25rem,calc(100vw-2rem))] overflow-hidden rounded-2xl border border-emerald-950/20 bg-white shadow-[0_12px_32px_rgba(11,47,31,0.28)]">
      <div className="flex items-center justify-end bg-[#153527] px-2 pt-2">
        <button type="button" onClick={() => setOpen(false)} className="rounded-full p-2 text-emerald-50 transition hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white" aria-label="Close Araihan"><X size={18} /></button>
      </div>
      <AraihanChat compact />
    </div>}
    <button type="button" onClick={() => setOpen((value) => !value)} aria-expanded={open} aria-label={open ? "Close Araihan" : "Open Araihan"} className="group ml-auto flex items-center gap-3 rounded-full bg-[#153527] py-2 pl-3 pr-4 text-white shadow-[0_6px_16px_rgba(11,47,31,0.28)] transition hover:-translate-y-0.5 hover:bg-[#214b38] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#153527]">
      <span className="relative grid h-10 w-10 place-items-center rounded-full bg-[#f7c54a] text-[#153527]"><MessageCircle size={20} strokeWidth={2.25} /><span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-[#153527] bg-[#f7c54a]" /></span>
      <span className="text-sm font-semibold">Araihan</span>
    </button>
  </aside>;
}
