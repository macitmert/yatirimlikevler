"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

export default function Header() {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const menuItems = [
    { href: "/", label: "Ana Sayfa" },
    { href: "/hakkimizda", label: "Hakkımızda" },
    { href: "/hizmetlerimiz", label: "Hizmetlerimiz" },
    { href: "/sss", label: "S.S.S" },
    { href: "/evini-sat", label: "Evini Sat" },
    { href: "/iletisim", label: "İletişim" },
  ];

  return (
    <header className="bg-white shadow-sm border-b border-[#C40001]/10 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 py-2 sm:py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 sm:gap-3" onClick={() => setIsMenuOpen(false)}>
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-[#C40001] rounded-full flex items-center justify-center overflow-hidden flex-shrink-0">
              <img src="/logo.png" alt="Yatırımlık Evler" className="w-6 h-6 sm:w-8 sm:h-8 object-contain" />
            </div>
            <h1 className="text-base sm:text-xl font-bold text-[#C40001] uppercase">YATIRIMLIK EVLER</h1>
          </Link>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 text-[#C40001] focus:outline-none"
            aria-label="Menu"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>

          {/* Desktop Navigation Menu */}
          <nav className="hidden md:flex items-center gap-2 lg:gap-3">
            {menuItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? "bg-[#C40001] text-white"
                      : "text-zinc-700 hover:bg-[#C40001]/10 hover:text-[#C40001]"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Mobile Navigation Menu */}
        {isMenuOpen && (
          <nav className="md:hidden mt-3 pb-2 border-t border-[#C40001]/10 pt-3">
            <div className="flex flex-col gap-2">
              {menuItems.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setIsMenuOpen(false)}
                    className={`px-4 py-3 rounded-lg text-base font-medium transition-all duration-200 ${
                      isActive
                        ? "bg-[#C40001] text-white"
                        : "text-zinc-700 bg-gray-50 active:bg-[#C40001]/10"
                    }`}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </div>
          </nav>
        )}
      </div>
    </header>
  );
}

