"use client";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import {
  FaHome,
  FaInfoCircle,
  FaSeedling,
  FaBug,
  FaShieldAlt,
  FaGraduationCap,
  FaChartLine,
  FaArchive,
  FaBullseye,
  FaUsers,
  FaShoppingCart,
  FaBook,
  FaGlobe,
  FaCalculator
} from "react-icons/fa";
import { cartStorage } from "../lib/api";
import { FloatingDock } from "./ui/floating-dock";
import MobileSidebar from "./MobileSidebar";
import { useTranslation } from "../lib/useTranslation";

// Navigation items with translation keys
const getNavItems = (t) => [
  {
    name: t('nav.home'),
    path: "/",
    icon: FaHome,
    description: t('navDescriptions.home')
  },
  {
    name: t('nav.about'),
    path: "/about",
    icon: FaInfoCircle,
    description: t('navDescriptions.about')
  },
  {
    name: t('nav.flowers'),
    path: "/flowers",
    icon: FaSeedling,
    description: t('navDescriptions.flowers')
  },
  {
    name: t('nav.pollinators'),
    path: "/pollinators",
    icon: FaBug,
    description: t('navDescriptions.pollinators'),
    subItems: [
      { name: t('nav.gallery'), path: "/pollinators/gallery", description: t('navDescriptions.pollinators') }
    ]
  },
  {
    name: t('nav.guardians'),
    path: "/guardians",
    icon: FaShieldAlt,
    description: t('navDescriptions.guardians')
  },
  {
    name: t('nav.education'),
    path: "/education",
    icon: FaGraduationCap,
    description: t('navDescriptions.education')
  },
  {
    name: t('nav.impact'),
    path: "/impact",
    icon: FaChartLine,
    description: t('navDescriptions.impact')
  },
  {
    name: t('nav.archive'),
    path: "/living-archive",
    icon: FaArchive,
    description: t('navDescriptions.archive')
  },
  {
    name: t('nav.araihan'),
    path: "/araihan-measure",
    icon: FaBullseye,
    description: t('navDescriptions.araihan')
  },
  {
    name: t('nav.professionals'),
    path: "/professionals",
    icon: FaUsers,
    description: t('navDescriptions.professionals')
  }
];

export default function Navigation() {
  const [cartCount, setCartCount] = useState(0);
  const { t, isLoading } = useTranslation();

  // Use Next.js usePathname hook for proper pathname detection across all pages
  const pathname = usePathname() || "/";

  // Update cart count
  useEffect(() => {
    const updateCartCount = () => {
      const cart = cartStorage.get();
      const count = cart.reduce((sum, item) => sum + item.quantity, 0);
      setCartCount(count);
    };

    updateCartCount();
    // Update cart count when storage changes
    const interval = setInterval(updateCartCount, 1000);
    return () => clearInterval(interval);
  }, []);

  const normalizePath = (path) => {
    if (!path) return "/";
    if (path === "/") return "/";
    return path.replace(/\/+$/, "") || "/";
  };

  // Direct paths (no locale prefix)
  const cartHref = "/cart";
  const homeHref = "/";
  const isCartPage = normalizePath(pathname) === "/cart";
  const isShopJourney = ["/shop", "/cart", "/checkout", "/library"].includes(normalizePath(pathname));
  const isHomePage = normalizePath(pathname) === "/";
  const isLandingPage = normalizePath(pathname) === "/landing";

  // Get navigation items with translations
  const BASE_NAV_ITEMS = getNavItems(t);

  const navigationItems = BASE_NAV_ITEMS.map((item) => ({
    ...item,
    href: item.path,
    subItems: item.subItems?.map((sub) => ({
      ...sub,
      href: sub.path,
    })),
  }));
  const isPathActive = (target) => normalizePath(pathname) === normalizePath(target);

  // Don't render navigation on landing page
  if (isLandingPage) {
    return null;
  }

  return (
    <>
      {!isShopJourney && <><FloatingDock
        items={[
          ...navigationItems.map((item) => {
            const IconComponent = item.icon;
            return {
              title: item.name,
              icon: <IconComponent className="w-full h-full" />,
              href: item.href,
            };
          }),
          // Add book/shop button (show on all pages except cart)
          ...(!isCartPage ? [{
            title: t('nav.shop'),
            icon: <FaBook className="w-full h-full" />,
            href: "/shop",
          }] : []),
        ]}
        desktopClassName="fixed right-4 top-1/2 -translate-y-1/2 z-[9999] max-h-[85vh] overflow-y-auto overflow-x-visible scrollbar-thin"
        mobileClassName="hidden" // Hide the floating dock on mobile
      />

      <MobileSidebar /></>}
    </>
  );
}
