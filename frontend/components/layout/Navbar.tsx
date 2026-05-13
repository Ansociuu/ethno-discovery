"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X, MapPin, Compass, Home, Sparkles } from "lucide-react";
import { useAuthStore } from "@/stores/auth.store";

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { user, isAuthenticated, logout } = useAuthStore();

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  return (
    <nav
      style={{
        position: "fixed",
        top: 0, left: 0, right: 0,
        zIndex: 1000,
        padding: "0 40px",
        height: 70,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        backdropFilter: "blur(24px)",
        background: scrolled ? "rgba(20,13,31,0.9)" : "var(--glass)",
        borderBottom: "1px solid var(--glass-border)",
        transition: "all 0.3s",
      }}
    >
      {/* Logo */}
      <Link href="/" style={{ textDecoration: "none" }}>
        <div style={{ fontFamily: "var(--font-serif)", fontSize: 22, fontWeight: 700, display: "flex", alignItems: "center", gap: 8 }}>
          🌿 <span className="text-gradient">EthnoDiscovery</span>
        </div>
      </Link>

      {/* Desktop Nav */}
      <ul style={{ display: "flex", gap: 32, listStyle: "none", margin: 0, padding: 0 }}
          className="hidden md:flex">
        <li><Link href="/destinations" style={{ color: "rgba(255,255,255,0.7)", textDecoration: "none", fontSize: 14, fontWeight: 500, transition: "color 0.2s" }}
          onMouseEnter={e => (e.currentTarget.style.color = "#fff")}
          onMouseLeave={e => (e.currentTarget.style.color = "rgba(255,255,255,0.7)")}>
          Điểm Đến
        </Link></li>
        <li><Link href="/tours" style={{ color: "rgba(255,255,255,0.7)", textDecoration: "none", fontSize: 14, fontWeight: 500 }}
          onMouseEnter={e => (e.currentTarget.style.color = "#fff")}
          onMouseLeave={e => (e.currentTarget.style.color = "rgba(255,255,255,0.7)")}>
          Tours
        </Link></li>
        <li><Link href="/homestays" style={{ color: "rgba(255,255,255,0.7)", textDecoration: "none", fontSize: 14, fontWeight: 500 }}
          onMouseEnter={e => (e.currentTarget.style.color = "#fff")}
          onMouseLeave={e => (e.currentTarget.style.color = "rgba(255,255,255,0.7)")}>
          Homestay
        </Link></li>
        <li><Link href="/ai-planner" style={{ color: "rgba(255,255,255,0.7)", textDecoration: "none", fontSize: 14, fontWeight: 500 }}
          onMouseEnter={e => (e.currentTarget.style.color = "#fff")}
          onMouseLeave={e => (e.currentTarget.style.color = "rgba(255,255,255,0.7)")}>
          AI Planner ✨
        </Link></li>
      </ul>

      {/* Right */}
      <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
        {isAuthenticated ? (
          <>
            <Link href="/dashboard" style={{ color: "rgba(255,255,255,0.7)", fontSize: 14, textDecoration: "none" }}>
              Xin chào, {user?.name?.split(" ")[0]}
            </Link>
            <button onClick={logout} className="btn-ghost" style={{ padding: "8px 20px", fontSize: 14 }}>
              Đăng xuất
            </button>
          </>
        ) : (
          <>
            <Link href="/login" style={{ color: "rgba(255,255,255,0.7)", fontSize: 14, textDecoration: "none" }}>
              Đăng nhập
            </Link>
            <Link href="/register" className="btn-primary" style={{ padding: "8px 20px", fontSize: 14 }}>
              Đăng ký
            </Link>
          </>
        )}

        {/* Mobile menu toggle */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          style={{ background: "none", border: "none", color: "#fff", cursor: "pointer", display: "none" }}
          className="block md:hidden"
        >
          {menuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div style={{
          position: "absolute", top: 70, left: 0, right: 0,
          background: "rgba(20,13,31,0.98)", backdropFilter: "blur(24px)",
          borderBottom: "1px solid var(--glass-border)", padding: "24px 40px",
          display: "flex", flexDirection: "column", gap: 20,
        }}>
          <Link href="/destinations" onClick={() => setMenuOpen(false)} style={{ color: "#fff", textDecoration: "none", fontSize: 16, display: "flex", alignItems: "center", gap: 12 }}>
            <MapPin size={18} style={{ color: "var(--pink)" }} /> Điểm Đến
          </Link>
          <Link href="/tours" onClick={() => setMenuOpen(false)} style={{ color: "#fff", textDecoration: "none", fontSize: 16, display: "flex", alignItems: "center", gap: 12 }}>
            <Compass size={18} style={{ color: "var(--amber)" }} /> Tours
          </Link>
          <Link href="/homestays" onClick={() => setMenuOpen(false)} style={{ color: "#fff", textDecoration: "none", fontSize: 16, display: "flex", alignItems: "center", gap: 12 }}>
            <Home size={18} style={{ color: "var(--pink)" }} /> Homestay
          </Link>
          <Link href="/ai-planner" onClick={() => setMenuOpen(false)} style={{ color: "#fff", textDecoration: "none", fontSize: 16, display: "flex", alignItems: "center", gap: 12 }}>
            <Sparkles size={18} style={{ color: "var(--amber)" }} /> AI Planner
          </Link>
        </div>
      )}
    </nav>
  );
}
