"use client";

import { Flower2, Globe2, ShoppingBag, Sparkles, BookOpen, Gamepad2 } from "lucide-react";
import { BentoCard, BentoGrid } from "@/components/ui/bento-grid";
import { useTranslation } from "../lib/useTranslation";

export function BentoDemo() {
  const { t } = useTranslation();

  const features = [
    { Icon: ShoppingBag, name: t("home.shopName"), description: t("home.shopDesc"), href: "/shop", cta: t("home.shopCta"), className: "lg:col-span-1" },
    { Icon: Gamepad2, name: t("home.cardGameName"), description: t("home.cardGameDesc"), href: "/game", cta: t("home.cardGameCta"), className: "lg:col-span-2", featured: true },
    { Icon: Flower2, name: t("nav.flowers"), description: t("navDescriptions.flowers"), href: "/flowers", cta: t("home.exploreCta"), className: "lg:col-span-2" },
    { Icon: Globe2, name: t("home.archiveName"), description: t("home.archiveDesc"), href: "/globe", cta: t("home.archiveCta"), className: "lg:col-span-1" },
    { Icon: Sparkles, name: t("nav.pollinators"), description: t("navDescriptions.pollinators"), href: "/pollinators", cta: t("common.learnMore"), className: "lg:col-span-2" },
    { Icon: BookOpen, name: t("nav.archive"), description: t("navDescriptions.archive"), href: "/living-archive", cta: t("common.readMore"), className: "lg:col-span-1" },
  ];

  return (
    <div className="w-full px-4 sm:px-6 lg:px-8">
      <BentoGrid className="mx-auto max-w-7xl">
        {features.map((feature) => <BentoCard key={feature.href} {...feature} />)}
      </BentoGrid>
    </div>
  );
}
