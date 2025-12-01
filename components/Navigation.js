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
  FaShoppingCart
} from "react-icons/fa";
import { cartStorage } from "../lib/api";
import { FloatingDock } from "./ui/floating-dock";
import MobileSidebar from "./MobileSidebar";

const BASE_NAV_ITEMS = [
  {
    name: "Home",
    path: "/",
    icon: FaHome,
    description: "Return to the main globe view"
  },
  {
    name: "What is AquaMundi?",
    path: "/about",
    icon: FaInfoCircle,
    description: "Mission and purpose"
  },
  {
    name: "National Flowers",
    path: "/flowers",
    icon: FaSeedling,
    description: "Selection criteria and explanation"
  },
  {
    name: "Pollinators",
    path: "/pollinators",
    icon: FaBug,
    description: "Introduction and gallery",
    subItems: [
      { name: "Gallery", path: "/pollinators/gallery", description: "Explore pollinator species" }
    ]
  },
  {
    name: "Guardians",
    path: "/guardians",
    icon: FaShieldAlt,
    description: "Symbolic presentation"
  },
  {
    name: "Education & Community",
    path: "/education",
    icon: FaGraduationCap,
    description: "Learning resources and community"
  },
  {
    name: "Impact & Transparency",
    path: "/impact",
    icon: FaChartLine,
    description: "Our impact and transparency"
  },
  {
    name: "The Living Archive",
    path: "/living-archive",
    icon: FaArchive,
    description: "Core content of the NAHIARA universe"
  },
  {
    name: "Araihan Measure",
    path: "/araihan-measure",
    icon: FaBullseye,
    description: "Araihan Measure initiative"
  },
  {
    name: "Professionals",
    path: "/professionals",
    icon: FaUsers,
    description: "Exclusive access for industry professionals"
  }
];

export default function Navigation() {
  const [cartCount, setCartCount] = useState(0);
  
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
  const isHomePage = normalizePath(pathname) === "/";

  const navigationItems = BASE_NAV_ITEMS.map((item) => ({
    ...item,
    href: item.path,
    subItems: item.subItems?.map((sub) => ({
      ...sub,
      href: sub.path,
    })),
  }));
  const isPathActive = (target) => normalizePath(pathname) === normalizePath(target);

  return (
    <>
      {/* Desktop Navigation - Floating Dock */}
      <FloatingDock
        items={[
          ...navigationItems.map((item) => {
            const IconComponent = item.icon;
            return {
              title: item.name,
              icon: <IconComponent className="w-full h-full" />,
              href: item.href,
            };
          }),
          // Add cart button if not on cart or home page
          ...(!isCartPage && !isHomePage ? [{
            title: `Cart (${cartCount} ${cartCount === 1 ? 'item' : 'items'})`,
            icon: <FaShoppingCart className="w-full h-full" />,
            href: cartHref,
          }] : []),
        ]}
        desktopClassName="fixed right-4 top-1/2 -translate-y-1/2 z-[9999] max-h-[85vh] overflow-y-auto overflow-x-visible scrollbar-thin"
        mobileClassName="hidden" // Hide the floating dock on mobile
      />

      {/* Mobile Navigation - Sidebar */}
      <MobileSidebar />
    </>
  );
}
