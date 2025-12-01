"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "motion/react";
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
  FaTimes,
  FaBars,
  FaChevronRight
} from "react-icons/fa";
import { cartStorage } from "../lib/api";

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

export default function MobileSidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [pathname, setPathname] = useState("/");
  const [expandedItem, setExpandedItem] = useState(null);

  useEffect(() => {
    setPathname(window.location.pathname);
  }, []);

  // Update cart count
  useEffect(() => {
    const updateCartCount = () => {
      const cart = cartStorage.get();
      const count = cart.reduce((sum, item) => sum + item.quantity, 0);
      setCartCount(count);
    };

    updateCartCount();
    const interval = setInterval(updateCartCount, 1000);
    return () => clearInterval(interval);
  }, []);

  // Close sidebar when route changes
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  // Prevent body scroll when sidebar is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const normalizePath = (path) => {
    if (!path) return "/";
    if (path === "/") return "/";
    return path.replace(/\/+$/, "") || "/";
  };

  const isPathActive = (target) => normalizePath(pathname) === normalizePath(target);
  const isCartPage = normalizePath(pathname) === "/cart";
  const isHomePage = normalizePath(pathname) === "/";

  return (
    <>
      {/* Mobile Menu Button - Only visible on mobile */}
      <button
        onClick={() => setIsOpen(true)}
        className="lg:hidden fixed top-4 right-4 z-[9998] flex items-center justify-center w-12 h-12 rounded-full bg-white/90 backdrop-blur-xl border border-gray-200/60 shadow-lg hover:shadow-xl transition-all"
        aria-label="Open menu"
      >
        <FaBars className="w-5 h-5 text-gray-700" />
      </button>

      {/* Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="lg:hidden fixed inset-0 bg-black/50 backdrop-blur-sm z-[9998]"
            onClick={() => setIsOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="lg:hidden fixed top-0 right-0 h-full w-[85%] max-w-sm bg-white z-[9999] shadow-2xl overflow-hidden flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-purple-50">
              <h2 
                className="text-2xl font-bold text-gray-800"
                style={{ fontFamily: '"Cormorant Garamond", serif' }}
              >
                AquaMundi
              </h2>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 rounded-full hover:bg-white/50 transition-colors"
                aria-label="Close menu"
              >
                <FaTimes className="w-6 h-6 text-gray-600" />
              </button>
            </div>

            {/* Navigation Items */}
            <nav className="flex-1 overflow-y-auto px-4 py-6 space-y-2">
              {BASE_NAV_ITEMS.map((item, index) => {
                const IconComponent = item.icon;
                const isActive = isPathActive(item.path);
                const hasSubItems = item.subItems && item.subItems.length > 0;
                const isExpanded = expandedItem === item.name;

                return (
                  <div key={item.name}>
                    <motion.div
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      {hasSubItems ? (
                        <button
                          onClick={() => setExpandedItem(isExpanded ? null : item.name)}
                          className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all ${
                            isActive
                              ? "bg-blue-50 text-blue-600"
                              : "text-gray-700 hover:bg-gray-50"
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <IconComponent className="w-5 h-5" />
                            <span className="font-medium text-sm">{item.name}</span>
                          </div>
                          <motion.div
                            animate={{ rotate: isExpanded ? 90 : 0 }}
                            transition={{ duration: 0.2 }}
                          >
                            <FaChevronRight className="w-4 h-4" />
                          </motion.div>
                        </button>
                      ) : (
                        <Link
                          href={item.path}
                          className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                            isActive
                              ? "bg-blue-50 text-blue-600"
                              : "text-gray-700 hover:bg-gray-50"
                          }`}
                        >
                          <IconComponent className="w-5 h-5" />
                          <span className="font-medium text-sm">{item.name}</span>
                        </Link>
                      )}
                    </motion.div>

                    {/* Sub Items */}
                    <AnimatePresence>
                      {hasSubItems && isExpanded && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.2 }}
                          className="overflow-hidden ml-8 mt-1 space-y-1"
                        >
                          {item.subItems.map((subItem) => (
                            <Link
                              key={subItem.path}
                              href={subItem.path}
                              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm transition-all ${
                                isPathActive(subItem.path)
                                  ? "bg-blue-50 text-blue-600"
                                  : "text-gray-600 hover:bg-gray-50"
                              }`}
                            >
                              {subItem.name}
                            </Link>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </nav>

            {/* Footer - Cart Button */}
            {!isCartPage && !isHomePage && (
              <div className="px-4 py-4 border-t border-gray-200 bg-gray-50">
                <Link
                  href="/cart"
                  className="flex items-center justify-between px-4 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg hover:shadow-xl transition-all"
                >
                  <div className="flex items-center gap-3">
                    <FaShoppingCart className="w-5 h-5" />
                    <span className="font-medium">View Cart</span>
                  </div>
                  {cartCount > 0 && (
                    <span className="px-3 py-1 rounded-full bg-white/20 backdrop-blur-sm text-sm font-semibold">
                      {cartCount}
                    </span>
                  )}
                </Link>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

