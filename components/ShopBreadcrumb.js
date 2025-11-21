"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Store, ShoppingCart, CreditCard, ChevronRight, Home } from "lucide-react";

export default function ShopBreadcrumb() {
  const pathname = usePathname();

  const breadcrumbItems = [
    {
      name: "Home",
      href: "/",
      icon: Home,
      active: pathname === "/"
    },
    {
      name: "Shop",
      href: "/shop",
      icon: Store,
      active: pathname === "/shop"
    },
    {
      name: "Cart",
      href: "/cart",
      icon: ShoppingCart,
      active: pathname === "/cart"
    },
    {
      name: "Checkout",
      href: "/checkout",
      icon: CreditCard,
      active: pathname === "/checkout"
    }
  ];

  // Determine which items to show based on current page
  let visibleItems = [];
  if (pathname === "/shop") {
    visibleItems = [breadcrumbItems[0], breadcrumbItems[1]];
  } else if (pathname === "/cart") {
    visibleItems = [breadcrumbItems[0], breadcrumbItems[1], breadcrumbItems[2]];
  } else if (pathname === "/checkout") {
    visibleItems = [breadcrumbItems[0], breadcrumbItems[1], breadcrumbItems[2], breadcrumbItems[3]];
  } else {
    return null; // Don't show on other pages
  }

  return (
    <nav className="mb-6 animate-fade-in">
      <div className="flex items-center gap-2 flex-wrap bg-white/80 backdrop-blur-sm px-4 py-3 rounded-xl border-2 border-amber-300 shadow-lg">
        {visibleItems.map((item, index) => (
          <div key={item.name} className="flex items-center gap-2">
            {index > 0 && (
              <ChevronRight className="w-4 h-4 text-gray-400" />
            )}
            {item.active ? (
              <div className="flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-red-500 to-green-600 text-white rounded-lg shadow-md">
                <item.icon className="w-4 h-4" />
                <span className="font-semibold text-sm">{item.name}</span>
              </div>
            ) : (
              <Link
                href={item.href}
                className="flex items-center gap-2 px-3 py-1.5 text-gray-700 hover:bg-gray-100 rounded-lg transition-all duration-200 hover:shadow-md"
              >
                <item.icon className="w-4 h-4" />
                <span className="font-medium text-sm">{item.name}</span>
              </Link>
            )}
          </div>
        ))}
      </div>
    </nav>
  );
}

