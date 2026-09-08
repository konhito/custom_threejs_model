"use client";

import { Flower2, Globe2, ShoppingBag, Sparkles, BookOpen, Gamepad2 } from "lucide-react";
import { BentoCard, BentoGrid } from "@/components/ui/bento-grid";
import { useTranslation } from "../lib/useTranslation";

// Background components (same as before, no text to translate)
const ShopBackground = () => (
  <div className="absolute inset-0 bg-gradient-to-br from-emerald-50/50 via-teal-50/30 to-white overflow-hidden">
    <svg className="absolute inset-0 w-full h-full opacity-20" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <pattern id="shopPattern" x="0" y="0" width="90" height="90" patternUnits="userSpaceOnUse">
          <g transform="translate(45, 45)">
            <ellipse cx="0" cy="0" rx="10" ry="15" fill="#6ee7b7" opacity="0.3" transform="rotate(-30)" />
            <ellipse cx="0" cy="0" rx="10" ry="15" fill="#6ee7b7" opacity="0.3" transform="rotate(30)" />
            <ellipse cx="0" cy="0" rx="10" ry="15" fill="#10b981" opacity="0.4" transform="rotate(90)" />
            <circle cx="0" cy="0" r="4" fill="#047857" opacity="0.5" />
          </g>
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#shopPattern)" />
    </svg>
    <div className="absolute top-8 left-8 w-16 h-16 rounded-full bg-emerald-200/20 blur-xl group-hover:bg-emerald-300/30 transition-all duration-500" />
    <div className="absolute bottom-4 right-4 text-emerald-200/40 group-hover:text-emerald-300/60 transition-colors duration-300">
      <ShoppingBag size={100} strokeWidth={0.5} />
    </div>
  </div>
);

const CardGameBackground = () => (
  <div className="absolute inset-0 bg-gradient-to-br from-orange-50/50 via-amber-50/30 to-white overflow-hidden">
    <svg className="absolute inset-0 w-full h-full opacity-20" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <pattern id="cardGamePattern" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
          <rect x="10" y="10" width="30" height="40" rx="4" fill="#fcd34d" opacity="0.3" stroke="#fbbf24" strokeWidth="1" />
          <rect x="50" y="15" width="30" height="40" rx="4" fill="#fde68a" opacity="0.3" stroke="#f59e0b" strokeWidth="1" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#cardGamePattern)" />
    </svg>
    <div className="absolute top-12 left-16 w-20 h-28 bg-gradient-to-br from-amber-200/20 to-orange-200/20 rounded-lg rotate-12 shadow-lg group-hover:rotate-6 group-hover:scale-105 transition-all duration-500" />
    <div className="absolute bottom-4 right-4 text-orange-200/40 group-hover:text-orange-300/60 transition-colors duration-300">
      <Gamepad2 size={110} strokeWidth={0.5} />
    </div>
  </div>
);

const FlowersBackground = () => (
  <div className="absolute inset-0 bg-gradient-to-br from-pink-50/50 via-rose-50/30 to-white overflow-hidden">
    <svg className="absolute inset-0 w-full h-full opacity-20" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <pattern id="flowerPattern1" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
          <g transform="translate(50, 50)">
            <circle cx="0" cy="0" r="8" fill="#fda4af" opacity="0.3" />
            <circle cx="-6" cy="-4" r="6" fill="#fecdd3" opacity="0.4" />
            <circle cx="6" cy="-4" r="6" fill="#fecdd3" opacity="0.4" />
          </g>
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#flowerPattern1)" />
    </svg>
    <div className="absolute bottom-4 right-4 text-pink-200/40 group-hover:text-pink-300/60 transition-colors duration-300">
      <Flower2 size={120} strokeWidth={0.5} />
    </div>
  </div>
);

const GlobeBackground = () => (
  <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 via-cyan-50/30 to-white overflow-hidden">
    <svg className="absolute inset-0 w-full h-full opacity-15" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <pattern id="globePattern" x="0" y="0" width="80" height="80" patternUnits="userSpaceOnUse">
          <circle cx="40" cy="40" r="20" fill="none" stroke="#67e8f9" strokeWidth="1" opacity="0.4" />
          <circle cx="40" cy="40" r="15" fill="none" stroke="#22d3ee" strokeWidth="1" opacity="0.3" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#globePattern)" />
    </svg>
    <div className="absolute bottom-4 right-4 text-cyan-200/40 group-hover:text-cyan-300/60 transition-colors duration-300">
      <Globe2 size={100} strokeWidth={0.5} />
    </div>
  </div>
);

const PollinatorsBackground = () => (
  <div className="absolute inset-0 bg-gradient-to-br from-amber-50/50 via-yellow-50/30 to-white overflow-hidden">
    <svg className="absolute inset-0 w-full h-full opacity-20" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <pattern id="pollinatorPattern" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
          <circle cx="50" cy="50" r="6" fill="#fde047" opacity="0.4" />
          <path d="M50,50 Q30,40 20,50" stroke="#fbbf24" strokeWidth="2" fill="none" opacity="0.3" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#pollinatorPattern)" />
    </svg>
    <div className="absolute bottom-4 right-4 text-yellow-200/40 group-hover:text-yellow-300/60 transition-colors duration-300">
      <Sparkles size={110} strokeWidth={0.5} />
    </div>
  </div>
);

const ArchiveBackground = () => (
  <div className="absolute inset-0 bg-gradient-to-br from-purple-50/50 via-violet-50/30 to-white overflow-hidden">
    <svg className="absolute inset-0 w-full h-full opacity-15" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <pattern id="archivePattern" x="0" y="0" width="110" height="110" patternUnits="userSpaceOnUse">
          <g transform="translate(55, 55)">
            <circle cx="0" cy="0" r="7" fill="#c4b5fd" opacity="0.4" />
          </g>
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#archivePattern)" />
    </svg>
    <div className="absolute bottom-4 right-4 text-purple-200/40 group-hover:text-purple-300/60 transition-colors duration-300">
      <BookOpen size={110} strokeWidth={0.5} />
    </div>
  </div>
);

export function BentoDemo() {
  const { t } = useTranslation();

  const features = [
    {
      Icon: ShoppingBag,
      name: t('home.shopName'),
      description: t('home.shopDesc'),
      href: "/shop",
      cta: t('home.shopCta'),
      className: "col-span-3 lg:col-span-1",
      background: <ShopBackground />,
    },
    {
      Icon: Gamepad2,
      name: t('home.cardGameName'),
      description: t('home.cardGameDesc'),
      href: "/game",
      cta: t('home.cardGameCta'),
      className: "col-span-3 lg:col-span-2",
      background: <CardGameBackground />,
    },
    {
      Icon: Flower2,
      name: t('nav.flowers'),
      description: t('navDescriptions.flowers'),
      href: "/flowers",
      cta: t('home.exploreCta'),
      className: "col-span-3 lg:col-span-2",
      background: <FlowersBackground />,
    },
    {
      Icon: Globe2,
      name: t('home.archiveName'),
      description: t('home.archiveDesc'),
      href: "/globe",
      cta: t('home.archiveCta'),
      className: "col-span-3 lg:col-span-1",
      background: <GlobeBackground />,
    },
    {
      Icon: Sparkles,
      name: t('nav.pollinators'),
      description: t('navDescriptions.pollinators'),
      href: "/pollinators",
      cta: t('common.learnMore'),
      className: "col-span-3 lg:col-span-2",
      background: <PollinatorsBackground />,
    },
    {
      Icon: BookOpen,
      name: t('nav.archive'),
      description: t('navDescriptions.archive'),
      href: "/living-archive",
      cta: t('common.readMore'),
      className: "col-span-3 lg:col-span-1",
      background: <ArchiveBackground />,
    },
  ];

  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 bg-transparent">
      <div className="max-w-7xl mx-auto">
        <BentoGrid>
          {features.map((feature, idx) => (
            <BentoCard key={idx} {...feature} />
          ))}
        </BentoGrid>
      </div>
    </div>
  );
}
