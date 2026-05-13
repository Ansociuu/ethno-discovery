"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { ChevronDown } from "lucide-react";

// Terrain SVG component
function TerrainSVG() {
  return (
    <svg
      style={{ position: "absolute", bottom: 0, left: 0, right: 0, width: "100%", height: "55%", opacity: 0.15, pointerEvents: "none" }}
      viewBox="0 0 1440 400"
      preserveAspectRatio="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M0 400 L0 280 Q120 200 240 260 Q360 320 480 180 Q540 110 600 140 Q660 170 720 80 Q780 0 840 60 Q900 120 960 100 Q1020 80 1080 160 Q1140 240 1200 200 Q1320 140 1440 220 L1440 400Z"
        fill="rgba(255,60,172,0.08)"
      />
      <path
        d="M0 400 L0 320 Q180 240 360 300 Q480 340 600 220 Q680 150 760 180 Q840 210 920 140 Q1000 70 1080 120 Q1160 170 1240 150 Q1360 120 1440 180 L1440 400Z"
        fill="rgba(255,214,10,0.06)"
      />
      <path
        d="M0 400 L0 360 Q200 300 400 350 Q600 400 800 300 Q960 220 1100 280 Q1240 340 1440 310 L1440 400Z"
        fill="rgba(255,255,255,0.03)"
      />
    </svg>
  );
}

export function HeroSection() {
  const router = useRouter();
  const [fields, setFields] = useState({ destination: "", days: "", vibe: "", budget: "" });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const q = [fields.destination, fields.vibe].filter(Boolean).join(" ");
    if (q) router.push(`/search?q=${encodeURIComponent(q)}`);
  };

  return (
    <section
      style={{
        position: "relative",
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
        maxWidth: "100%",
        padding: 0,
        margin: 0,
      }}
    >
      {/* Background */}
      <div style={{ position: "absolute", inset: 0, zIndex: 0 }}>
        {/* Gradient */}
        <div style={{
          position: "absolute", inset: 0,
          background: "radial-gradient(ellipse 80% 60% at 20% 40%, rgba(255,60,172,0.15) 0%, transparent 60%), radial-gradient(ellipse 60% 80% at 80% 60%, rgba(255,214,10,0.12) 0%, transparent 60%), linear-gradient(180deg, var(--midnight) 0%, var(--dark) 40%, rgba(20,13,31,0.95) 100%)",
        }} />
        {/* Dots grid */}
        <div style={{ position: "absolute", inset: 0, backgroundImage: "radial-gradient(rgba(255,255,255,0.08) 1px, transparent 1px)", backgroundSize: "40px 40px" }} />
        {/* Terrain SVG */}
        <TerrainSVG />
        {/* Floating Orbs */}
        <div className="animate-float" style={{ position: "absolute", width: 400, height: 400, borderRadius: "50%", background: "rgba(255,60,172,0.12)", filter: "blur(80px)", top: -100, left: -100, animationDelay: "0s" }} />
        <div className="animate-float" style={{ position: "absolute", width: 300, height: 300, borderRadius: "50%", background: "rgba(255,214,10,0.10)", filter: "blur(80px)", bottom: -50, right: -50, animationDelay: "-4s" }} />
        <div className="animate-float" style={{ position: "absolute", width: 200, height: 200, borderRadius: "50%", background: "rgba(255,214,10,0.08)", filter: "blur(80px)", top: "30%", right: "15%", animationDelay: "-2s" }} />
      </div>

      {/* Content */}
      <div style={{ position: "relative", zIndex: 2, textAlign: "center", maxWidth: 900, padding: "0 24px", width: "100%" }}>
        {/* Badge */}
        <div style={{
          display: "inline-flex", alignItems: "center", gap: 8,
          background: "var(--glass)", border: "1px solid var(--glass-border)",
          padding: "8px 20px", borderRadius: 30, fontSize: 13,
          color: "var(--text)", marginBottom: 28, backdropFilter: "blur(10px)",
        }}>
          <div className="animate-pulse-dot" style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--pink)" }} />
          AI-powered cultural travel · Est. 2024
        </div>

        {/* Title */}
        <h1 style={{ fontFamily: "var(--font-serif)", fontSize: "clamp(48px, 7vw, 88px)", fontWeight: 900, lineHeight: 1.05, marginBottom: 20 }}>
          <span style={{ display: "block", color: "var(--white)" }}>Discover The</span>
          <span className="text-gradient-pink">Soul</span>{" "}of{" "}
          <span className="text-gradient-amber">Northern</span>
          <br />Vietnam
        </h1>

        <p style={{ fontSize: 18, color: "rgba(255,255,255,0.55)", fontWeight: 300, lineHeight: 1.6, marginBottom: 40, maxWidth: 600, marginLeft: "auto", marginRight: "auto" }}>
          AI-powered journeys through H&apos;Mông &amp; Dao culture — where mountain mist meets ancient tradition.
        </p>

        {/* Buttons */}
        <div style={{ display: "flex", gap: 16, justifyContent: "center", marginBottom: 60, flexWrap: "wrap" }}>
          <Link href="/tours" className="btn-primary" style={{ fontSize: 16 }}>
            🌿 Explore Tours
          </Link>
          <Link href="/ai-planner" className="btn-ghost" style={{ fontSize: 16 }}>
            ✨ Plan with AI
          </Link>
        </div>

        {/* Search Bar — 4 fields */}
        <form onSubmit={handleSearch} style={{
          background: "rgba(255,255,255,0.07)", backdropFilter: "blur(24px)",
          border: "1px solid rgba(255,255,255,0.14)", borderRadius: 20,
          padding: "20px 24px", display: "flex", gap: 0, alignItems: "stretch",
          maxWidth: 820, width: "100%", margin: "0 auto",
        }}>
          {/* Field 1 */}
          <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 4, padding: "0 16px", borderRight: "1px solid rgba(255,255,255,0.1)" }}>
            <span style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.1em", color: "var(--pink)", textTransform: "uppercase" }}>📍 Đi đâu?</span>
            <input value={fields.destination} onChange={e => setFields(f => ({ ...f, destination: e.target.value }))}
              placeholder="Sa Pa, Hà Giang, Bắc Hà..."
              style={{ background: "transparent", border: "none", outline: "none", color: "#fff", fontSize: 14, fontFamily: "var(--font-dm)", width: "100%" }} />
          </div>
          {/* Field 2 */}
          <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 4, padding: "0 16px", borderRight: "1px solid rgba(255,255,255,0.1)" }}>
            <span style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.1em", color: "var(--pink)", textTransform: "uppercase" }}>📅 Bao nhiêu ngày?</span>
            <input value={fields.days} onChange={e => setFields(f => ({ ...f, days: e.target.value }))}
              placeholder="3 - 7 ngày"
              style={{ background: "transparent", border: "none", outline: "none", color: "#fff", fontSize: 14, fontFamily: "var(--font-dm)", width: "100%" }} />
          </div>
          {/* Field 3 */}
          <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 4, padding: "0 16px", borderRight: "1px solid rgba(255,255,255,0.1)" }}>
            <span style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.1em", color: "var(--pink)", textTransform: "uppercase" }}>🎯 Vibe?</span>
            <input value={fields.vibe} onChange={e => setFields(f => ({ ...f, vibe: e.target.value }))}
              placeholder="Văn hoá / Nghỉ dưỡng"
              style={{ background: "transparent", border: "none", outline: "none", color: "#fff", fontSize: 14, fontFamily: "var(--font-dm)", width: "100%" }} />
          </div>
          {/* Field 4 */}
          <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 4, padding: "0 16px" }}>
            <span style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.1em", color: "var(--pink)", textTransform: "uppercase" }}>💰 Ngân sách?</span>
            <input value={fields.budget} onChange={e => setFields(f => ({ ...f, budget: e.target.value }))}
              placeholder="$500 - $2000"
              style={{ background: "transparent", border: "none", outline: "none", color: "#fff", fontSize: 14, fontFamily: "var(--font-dm)", width: "100%" }} />
          </div>
          {/* Search btn */}
          <button type="submit" style={{
            background: "linear-gradient(135deg, var(--pink), var(--amber))", border: "none",
            padding: "12px 24px", borderRadius: 12, color: "#000", fontSize: 14,
            fontWeight: 700, cursor: "pointer", whiteSpace: "nowrap", marginLeft: 16,
            transition: "all 0.2s",
          }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = "scale(1.03)"; (e.currentTarget as HTMLElement).style.boxShadow = "0 8px 24px rgba(255,214,10,0.4)"; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = ""; (e.currentTarget as HTMLElement).style.boxShadow = ""; }}>
            🔍 AI Search
          </button>
        </form>
      </div>

      {/* Scroll indicator */}
      <div style={{ position: "absolute", bottom: 32, left: "50%", transform: "translateX(-50%)", zIndex: 2, display: "flex", flexDirection: "column", alignItems: "center", gap: 8, opacity: 0.5 }}>
        <div style={{ width: 1, height: 50, background: "linear-gradient(to bottom, transparent, rgba(255,255,255,0.5))", animation: "scroll-anim 2s ease-in-out infinite" }} />
      </div>
    </section>
  );
}
