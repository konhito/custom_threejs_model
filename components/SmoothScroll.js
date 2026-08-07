"use client";

import { useEffect } from "react";
import Lenis from "lenis";

export default function SmoothScroll() {
  useEffect(() => {
    const lenis = new Lenis({
      anchors: true,
      autoRaf: true,
      lerp: 0.1,
      prevent: (node) => Boolean(node.closest?.("[data-lenis-prevent], [role='dialog']")),
    });

    return () => lenis.destroy();
  }, []);

  return null;
}
