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
  Calendar,
  Sparkles,
  Map,
  LogOut
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

  const navLinks = [
    { href: "/", label: "Trang Chủ", icon: Home },
    { href: "/destinations", label: "Điểm Đến", icon: Map },
    { href: "/tours", label: "Tours", icon: Compass },
    { href: "/homestays", label: "Homestays", icon: Home },
    { href: "/ai-planner", label: "AI Planner", icon: Sparkles },
  ];

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isScrolled ? "bg-midnight/80 backdrop-blur-md border-b border-glass-border py-3" : "bg-transparent py-5"
    }`}>
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 no-underline group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-pink to-amber flex items-center justify-center shadow-lg shadow-pink/20 group-hover:scale-110 transition-transform">
            <Leaf className="text-white w-6 h-6" />
          </div>
          <span className="font-serif text-2xl font-black text-white tracking-tight">
            Ethno<span className="text-gradient">Discovery</span>
          </span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link 
              key={link.href} 
              href={link.href}
              className={`text-sm font-medium transition-colors hover:text-pink flex items-center gap-2 no-underline ${
                pathname === link.href ? "text-pink" : "text-text"
              }`}
            >
              <link.icon size={16} />
              {link.label}
            </Link>
          ))}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-4">
          <Link href="/search" className="p-2 text-text hover:text-white transition-colors">
            <Search size={20} />
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
            <Link href="/login" className="btn-primary py-2 px-6 text-sm no-underline">
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
        <div className="fixed inset-0 top-[70px] bg-midnight z-40 p-6 flex flex-col gap-6 md:hidden">
          {navLinks.map((link) => (
            <Link 
              key={link.href} 
              href={link.href}
              onClick={() => setIsMobileMenuOpen(false)}
              className="text-2xl font-serif font-bold text-white no-underline flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-glass-border"
            >
              <link.icon size={24} className="text-pink" />
              {link.label}
            </Link>
          ))}
          {isAuthenticated ? (
            <Link href="/dashboard" className="btn-primary no-underline justify-center">
              Vào Dashboard
            </Link>
          ) : (
            <Link href="/login" className="btn-primary no-underline justify-center">
              Đăng Nhập
            </Link>
          )}
        </div>
      )}
    </nav>
  );
}
