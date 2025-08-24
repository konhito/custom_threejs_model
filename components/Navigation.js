"use client";
import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, Globe, Heart, Zap, Shield, BookOpen, TrendingUp, Info } from "lucide-react";

const navigationItems = [
  {
    name: "Home",
    href: "/",
    icon: Globe,
    description: "Return to the main globe view"
  },
  {
    name: "What is AquaMundi?",
    href: "/about",
    icon: Info,
    description: "Mission and purpose"
  },
  {
    name: "National Flowers",
    href: "/flowers",
    icon: Heart,
    description: "Selection criteria and explanation"
  },
  {
    name: "Pollinators",
    href: "/pollinators",
    icon: Zap,
    description: "Introduction and gallery",
    subItems: [
      { name: "Gallery", href: "/pollinators/gallery", description: "Explore pollinator species" }
    ]
  },
  {
    name: "Guardians",
    href: "/guardians",
    icon: Shield,
    description: "Symbolic presentation"
  },
  {
    name: "Education & Community",
    href: "/education",
    icon: BookOpen,
    description: "Learning resources and community"
  },
  {
    name: "Impact & Transparency",
    href: "/impact",
    icon: TrendingUp,
    description: "Our impact and transparency"
  },
  {
    name: "The Living Archive",
    href: "/living-archive",
    icon: BookOpen,
    description: "Core content of the NAHIARA universe"
  }
];

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  return (
    <>
      {/* Mobile menu button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-4 left-4 z-[9999] p-3 bg-black/30 backdrop-blur-sm rounded-full border border-white/40 hover:bg-black/50 transition-all duration-200 lg:hidden shadow-lg hover:shadow-xl"
      >
        {isOpen ? <X className="w-6 h-6 text-white" /> : <Menu className="w-6 h-6 text-white" />}
      </button>

      {/* Mobile Navigation */}
      <div className={`fixed inset-0 z-40 lg:hidden transition-all duration-300 ${
        isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
      }`}>
        <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setIsOpen(false)} />
        <div className="absolute left-0 top-0 h-full w-80 max-w-[85vw] bg-white/95 backdrop-blur-xl border-r border-white/20 shadow-2xl">
          <div className="p-6">
            <div className="flex items-center space-x-3 mb-8">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                <Globe className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-xl font-bold text-gray-800">AquaMundi</h2>
            </div>
            
            <nav className="space-y-2">
              {navigationItems.map((item) => {
                const isActive = pathname === item.href || (item.subItems && item.subItems.some(sub => pathname === sub.href));
                return (
                  <div key={item.name}>
                    <Link
                      href={item.href}
                      onClick={() => setIsOpen(false)}
                      className={`flex items-center space-x-3 p-3 rounded-xl transition-all duration-200 ${
                        isActive
                          ? "bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-300/50 shadow-md"
                          : "hover:bg-gray-100/80 hover:shadow-sm"
                      }`}
                    >
                      <item.icon className={`w-5 h-5 ${
                        isActive ? "text-blue-600" : "text-gray-600"
                      }`} />
                      <div className="flex-1">
                        <div className={`font-medium ${
                          isActive ? "text-blue-800" : "text-gray-800"
                        }`}>
                          {item.name}
                        </div>
                        <div className="text-xs text-gray-500">{item.description}</div>
                      </div>
                    </Link>
                    
                    {/* Sub-items */}
                    {item.subItems && (
                      <div className="ml-6 space-y-1">
                        {item.subItems.map((subItem) => {
                          const isSubActive = pathname === subItem.href;
                          return (
                            <Link
                              key={subItem.name}
                              href={subItem.href}
                              onClick={() => setIsOpen(false)}
                              className={`flex items-center space-x-3 p-2 rounded-lg transition-all duration-200 ${
                                isSubActive
                                  ? "bg-gradient-to-r from-blue-400/20 to-purple-400/20 border border-blue-200/50 shadow-sm"
                                  : "hover:bg-gray-50/80"
                              }`}
                            >
                              <div className="w-2 h-2 rounded-full bg-gray-400"></div>
                              <div className="flex-1">
                                <div className={`text-sm font-medium ${
                                  isSubActive ? "text-blue-700" : "text-gray-700"
                                }`}>
                                  {subItem.name}
                                </div>
                                <div className="text-xs text-gray-500">{subItem.description}</div>
                              </div>
                            </Link>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </nav>
          </div>
        </div>
      </div>

      {/* Desktop Navigation */}
      <div className="hidden lg:block fixed left-6 top-1/2 transform -translate-y-1/2 z-[9999] animate-fade-in">
        <nav className="bg-gradient-to-b from-black/30 to-black/20 backdrop-blur-xl rounded-2xl border border-white/40 p-4 space-y-2 shadow-2xl hover:bg-gradient-to-b hover:from-black/40 hover:to-black/30 transition-all duration-300 nav-glow">
          {navigationItems.map((item) => {
            const isActive = pathname === item.href || (item.subItems && item.subItems.some(sub => pathname === sub.href));
            return (
              <div key={item.name} className="relative group">
                <Link
                  href={item.href}
                  className={`flex items-center justify-center w-12 h-12 rounded-xl transition-all duration-200 ${
                    isActive
                      ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg scale-110"
                      : "text-white hover:bg-white/20 hover:scale-105"
                  }`}
                  title={item.name}
                >
                  <item.icon className="w-5 h-5" />
                </Link>
                
                {/* Tooltip */}
                <div className="absolute left-full ml-3 px-3 py-2 bg-black/90 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-[10000] min-w-[200px]">
                  <div className="font-semibold mb-1">{item.name}</div>
                  <div className="text-xs text-gray-300 mb-2">{item.description}</div>
                  
                  {/* Sub-items in tooltip */}
                  {item.subItems && (
                    <div className="space-y-1 pt-2 border-t border-gray-600">
                      {item.subItems.map((subItem) => (
                        <div key={subItem.name} className="text-xs">
                          <Link 
                            href={subItem.href}
                            className="text-blue-300 hover:text-blue-200 transition-colors duration-200"
                          >
                            {subItem.name}
                          </Link>
                          <div className="text-gray-400 text-xs">{subItem.description}</div>
                        </div>
                      ))}
                    </div>
                  )}
                  
                  <div className="absolute left-0 top-1/2 transform -translate-x-1 -translate-y-1/2 w-2 h-2 bg-black/90 rotate-45"></div>
                </div>
              </div>
            );
          })}
        </nav>
      </div>
    </>
  );
}
