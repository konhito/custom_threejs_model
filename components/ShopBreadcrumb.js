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
    return null;
  }

  return (
    <nav className="mb-6">
      <div className="flex items-center gap-1.5 flex-wrap px-1 py-2">
        {visibleItems.map((item, index) => (
          <div key={item.name} className="flex items-center gap-1.5">
            {index > 0 && (
              <ChevronRight className="w-3.5 h-3.5 text-gray-300" />
            )}
            {item.active ? (
              <div className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-900 text-white rounded-lg text-sm font-medium">
                <item.icon className="w-3.5 h-3.5" />
                <span>{item.name}</span>
              </div>
            ) : (
              <Link
                href={item.href}
                className="flex items-center gap-1.5 px-3 py-1.5 text-gray-500 hover:text-gray-800 rounded-lg text-sm font-medium transition-colors duration-200"
              >
                <item.icon className="w-3.5 h-3.5" />
                <span>{item.name}</span>
              </Link>
            )}
          </div>
        ))}
      </div>
    </nav>
  );
}
