"use client";

import { MessageCircle, X } from "lucide-react";
import { usePathname } from "next/navigation";
import { useState } from "react";
import AraihanChat from "./AraihanChat";

export default function AraihanPresence() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  if (["/chat", "/shop", "/cart", "/checkout", "/library", "/game"].includes(pathname) || pathname.startsWith("/experience-lab") || pathname.startsWith("/admin")) return null;

  return <aside className="fixed bottom-4 right-4 z-[120] sm:bottom-5 sm:right-20" aria-label="Araihan, companion of the Nahiara Universe">
    {open && <div className="mb-2 w-[min(21rem,calc(100vw-2rem))] overflow-hidden rounded-2xl bg-white shadow-[0_8px_18px_rgba(11,47,31,0.28)]">
      <AraihanChat compact onClose={() => setOpen(false)} />
    </div>}
    <button type="button" onClick={() => setOpen((value) => !value)} aria-expanded={open} aria-label={open ? "Close Araihan" : "Open Araihan"} className="group relative ml-auto grid h-11 w-11 place-items-center rounded-full bg-[#153527] text-white shadow-[0_4px_10px_rgba(11,47,31,0.3)] transition hover:-translate-y-0.5 hover:bg-[#214b38] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#153527]">
      <MessageCircle size={19} strokeWidth={2.2} />
      <span className="absolute bottom-1 right-1 h-2.5 w-2.5 rounded-full border-2 border-[#153527] bg-[#f7c54a]" />
      <span className="sr-only">Araihan</span>
    </button>
  </aside>;
}
