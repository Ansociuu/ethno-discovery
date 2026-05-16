"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Leaf,
  Search,
  User,
  Menu,
  X,
  Compass,
  Home,
  Sparkles,
  Map,
  LogOut,
  BedDouble
} from "lucide-react";
import { useAuthStore } from "@/stores/auth.store";

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const { user, isAuthenticated, logout } = useAuthStore();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isMobileMenuOpen]);

  const navLinks = [
    { href: "/", label: "Trang Chủ", icon: Home },
    { href: "/destinations", label: "Điểm Đến", icon: Map },
    { href: "/tours", label: "Tours", icon: Compass },
    { href: "/homestays", label: "Homestays", icon: BedDouble },
    { href: "/ai-planner", label: "AI Planner", icon: Sparkles },
  ];

  return (
    <>
      <nav className={`fixed top-0 left-0 right-0 transition-all duration-300 ${isMobileMenuOpen ? "z-[99999]" : "z-[100]"
        } ${isScrolled ? "bg-midnight/80 backdrop-blur-md border-b border-glass-border py-3" : "bg-transparent py-5"
        }`}>
        <div className="max-w-7xl mx-auto px-container flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-1.5 md:gap-2 no-underline group shrink-0">
            <div className="w-8 h-8 md:w-10 md:h-10 rounded-lg md:rounded-xl bg-gradient-to-br from-pink to-amber flex items-center justify-center shadow-lg shadow-pink/20 group-hover:scale-110 transition-transform">
              <Leaf className="text-white w-5 h-5 md:w-6 md:h-6" />
            </div>
            <span className="font-serif text-lg md:text-2xl font-black text-white tracking-tight">
              Ethno<span className="text-gradient">Discovery</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`relative py-1 text-sm font-medium transition-colors hover:text-pink flex items-center gap-2 no-underline group ${pathname === link.href ? "text-pink" : "text-text"
                  }`}
              >
                <link.icon size={16} />
                {link.label}
                <span className={`absolute -bottom-1 left-0 h-[2px] bg-gradient-to-r from-pink to-amber transition-all duration-300 ${pathname === link.href ? "w-full" : "w-0 group-hover:w-full"
                  }`} />
              </Link>
            ))}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-1 md:gap-4">
            <Link href="/search" className="p-2 text-text hover:text-white transition-colors">
              <Search size={18} className="md:w-5 md:h-5" />
            </Link>

            {isAuthenticated ? (
              <div className="hidden md:flex items-center gap-4">
                <Link href="/dashboard" className="flex items-center gap-2 text-sm font-medium text-white no-underline bg-white/5 px-4 py-2 rounded-full border border-glass-border hover:bg-white/10 transition-all">
                  <User size={16} className="text-pink" />
                  {user?.name?.split(' ')[0]}
                </Link>
                {user?.role === 'ADMIN' && (
                  <Link href="/admin" className="text-xs font-bold text-amber border border-amber/30 px-3 py-1 rounded-md hover:bg-amber/10 no-underline">
                    ADMIN
                  </Link>
                )}
                <button onClick={logout} className="p-2 text-text hover:text-pink transition-colors bg-transparent border-none cursor-pointer">
                  <LogOut size={20} />
                </button>
              </div>
            ) : (
              <Link href="/login" className="btn-primary py-1.5 px-2 sm:px-3 md:py-2 md:px-6 text-[10px] sm:text-xs md:text-sm no-underline whitespace-nowrap">
                Đăng Nhập
              </Link>
            )}

            {/* Mobile Toggle */}
            <button
              className="md:hidden p-2 text-white bg-transparent border-none cursor-pointer"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu Overlay */}
        {isMobileMenuOpen && (
          <div className="fixed inset-0 bg-[#0A0A0F] z-[99998] flex flex-col md:hidden animate-fade-in w-screen h-screen overflow-hidden">
            {/* Mobile Header - Sticky */}
            <div className="flex items-center justify-between px-container py-5 border-b border-white/5 bg-[#0A0A0F] shrink-0">
              <Link href="/" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-2 no-underline">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-pink to-amber flex items-center justify-center">
                  <Leaf className="text-white w-5 h-5" />
                </div>
                <span className="font-serif text-lg font-black text-white">EthnoDiscovery</span>
              </Link>
              <button
                className="p-2 text-white bg-white/5 rounded-full"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <X size={24} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-4 bg-[#0A0A0F]">
              <p className="text-[10px] font-bold text-pink uppercase tracking-[0.3em] mb-2 px-2">Điều hướng</p>
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`text-xl font-serif font-bold no-underline flex items-center gap-4 p-4 rounded-2xl border transition-all ${pathname === link.href
                    ? "bg-pink/10 border-pink/30 text-white shadow-lg shadow-pink/5"
                    : "bg-white/5 border-white/5 text-white/70"
                    }`}
                >
                  <link.icon size={20} className={pathname === link.href ? "text-pink" : "text-white/40"} />
                  {link.label}
                </Link>
              ))}

              <div className="mt-6 pt-6 border-t border-white/5 flex flex-col gap-4 pb-20">
                <p className="text-[10px] font-bold text-amber uppercase tracking-[0.3em] mb-2 px-2">Tài khoản</p>
                {isAuthenticated ? (
                  <>
                    <Link
                      href="/dashboard"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-white/5 no-underline text-white font-bold"
                    >
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-pink to-amber flex items-center justify-center text-sm">
                        {user?.name?.[0]}
                      </div>
                      <div>
                        <div className="text-sm">{user?.name}</div>
                        <div className="text-[10px] text-white/40 font-normal uppercase tracking-wider">Xem hồ sơ của bạn</div>
                      </div>
                    </Link>
                    <button
                      onClick={() => { logout(); setIsMobileMenuOpen(false); }}
                      className="flex items-center justify-center gap-3 w-full py-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 font-bold text-lg active:scale-95 transition-all mt-4 mb-10"
                    >
                      <LogOut size={20} /> Đăng Xuất
                    </button>
                  </>
                ) : (
                  <Link
                    href="/login"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="btn-primary no-underline justify-center py-4 text-lg mb-10"
                  >
                    Đăng Nhập
                  </Link>
                )}
              </div>
            </div>
          </div>
        )}
      </nav>
    </>
  );
}
