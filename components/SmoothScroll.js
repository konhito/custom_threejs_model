"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import Lenis from "lenis";

export default function SmoothScroll() {
  const pathname = usePathname();
  const lenisRef = useRef(null);

  useEffect(() => {
    const lenis = new Lenis({
      anchors: true,
      autoRaf: true,
      lerp: 0.1,
      prevent: (node) => Boolean(node.closest?.("[data-lenis-prevent], [role='dialog']")),
    });
    lenisRef.current = lenis;

    const publishScrollState = () => {
      window.dispatchEvent(
        new CustomEvent("aquamundi:lenis-scroll", {
          detail: { progress: lenis.progress, scroll: lenis.scroll, velocity: lenis.velocity },
        }),
      );
    };
    lenis.on("scroll", publishScrollState);
    publishScrollState();

    const resetHomeScroll = () => {
      if (window.location.pathname !== "/") return;
      lenis.scrollTo(0, { immediate: true, force: true });
      window.scrollTo(0, 0);
    };

    window.addEventListener("pageshow", resetHomeScroll);

    return () => {
      window.removeEventListener("pageshow", resetHomeScroll);
      lenis.off("scroll", publishScrollState);
      lenisRef.current = null;
      lenis.destroy();
    };
  }, []);

  useEffect(() => {
    if (pathname !== "/") return;
    lenisRef.current?.scrollTo(0, { immediate: true, force: true });
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}
