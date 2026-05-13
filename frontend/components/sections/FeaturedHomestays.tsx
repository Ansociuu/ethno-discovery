"use client";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { ChevronRight, Users } from "lucide-react";
import { homestaysApi } from "@/lib/api";

interface Homestay {
  id: number;
  name: string;
  coverImage?: string;
  pricePerNight: string | number;
  maxGuests: number;
  featured: boolean;
  amenities?: string[];
  destination?: { nameVi: string; province: string };
}

const FALLBACK_GRADIENTS = [
  "linear-gradient(160deg, var(--dark), var(--pink))",
  "linear-gradient(160deg, var(--midnight), var(--amber))",
  "linear-gradient(160deg, var(--bg3), var(--pink))",
];

const TAGS = [
  { label: "⭐ Superhost", bg: "rgba(251,191,36,0.9)", color: "#000" },
  { label: "🌟 Featured",  bg: "rgba(255,214,10,0.9)",  color: "#000" },
  { label: "🏡 Authentic", bg: "rgba(255,60,172,0.9)",  color: "#fff" },
];

// Mountain terrain SVG decoration
function HomestayTerrain() {
  return (
    <svg style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: "50%", opacity: 0.2, pointerEvents: "none" }} viewBox="0 0 300 150" preserveAspectRatio="none">
      <path d="M0 150 L0 80 Q40 50 80 70 Q120 90 150 40 Q180 0 210 30 Q240 60 300 20 L300 150Z" fill="rgba(255,255,255,0.3)" />
    </svg>
  );
}

export function FeaturedHomestays() {
  const { data, isLoading } = useQuery({
    queryKey: ["homestays", "featured"],
    queryFn: () => homestaysApi.getFeatured().then(r => r.data.data as Homestay[]),
  });

  const homestays = data?.slice(0, 3) || [];

  return (
    <section className="fade-up" style={{ padding: "100px 40px", maxWidth: 1280, margin: "0 auto" }}>
      {/* Header */}
      <span className="section-tag">Stay with Locals</span>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 60, marginTop: 0, flexWrap: "wrap", gap: 20 }}>
        <div>
          <h2 style={{ fontFamily: "var(--font-serif)", fontSize: "clamp(32px, 4vw, 52px)", fontWeight: 700, lineHeight: 1.1, marginBottom: 12, marginTop: 12 }}>
            Homestay <em style={{ color: "var(--amber)", fontStyle: "italic" }}>sang trọng</em>
          </h2>
          <p style={{ color: "var(--text)", fontSize: 17, fontWeight: 300, maxWidth: 500, lineHeight: 1.7 }}>
            Ngủ trong lòng bản làng — thức dậy giữa sương mây.
          </p>
        </div>
        <Link href="/homestays" className="btn-ghost" style={{ padding: "12px 24px", fontSize: 14, whiteSpace: "nowrap" }}>
          Xem tất cả <ChevronRight size={16} />
        </Link>
      </div>

      {/* 3-column grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20 }}>
        {isLoading
          ? [...Array(3)].map((_, i) => <div key={i} className="skeleton" style={{ height: 380, borderRadius: 20 }} />)
          : homestays.map((hs, i) => (
              <Link key={hs.id} href={`/homestays/${hs.id}`} style={{ textDecoration: "none" }}>
                <div style={{
                  background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)",
                  borderRadius: 20, overflow: "hidden", transition: "all 0.3s", cursor: "pointer",
                }}
                  onMouseEnter={e => {
                    (e.currentTarget as HTMLElement).style.transform = "translateY(-8px)";
                    (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,60,172,0.3)";
                    (e.currentTarget as HTMLElement).style.boxShadow = "0 24px 60px rgba(255,60,172,0.1)";
                  }}
                  onMouseLeave={e => {
                    (e.currentTarget as HTMLElement).style.transform = "";
                    (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.08)";
                    (e.currentTarget as HTMLElement).style.boxShadow = "";
                  }}>
                  {/* Image area */}
                  <div style={{ height: 220, position: "relative", overflow: "hidden" }}>
                    {hs.coverImage
                      ? <img src={hs.coverImage} alt={hs.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                      : <div style={{ width: "100%", height: "100%", background: FALLBACK_GRADIENTS[i % FALLBACK_GRADIENTS.length] }} />
                    }
                    <HomestayTerrain />
                    {/* Dark overlay */}
                    <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,0.5) 0%, transparent 60%)" }} />
                    {/* Tag */}
                    <div style={{
                      position: "absolute", top: 14, left: 14,
                      background: TAGS[i % TAGS.length].bg, color: TAGS[i % TAGS.length].color,
                      fontSize: 11, fontWeight: 700, padding: "4px 10px", borderRadius: 10, letterSpacing: "0.04em",
                    }}>
                      {TAGS[i % TAGS.length].label}
                    </div>
                  </div>

                  {/* Body */}
                  <div style={{ padding: 20 }}>
                    <div style={{ fontFamily: "var(--font-serif)", fontSize: 20, fontWeight: 700, marginBottom: 6, color: "#fff" }}>{hs.name}</div>
                    <div style={{ fontSize: 13, color: "rgba(255,255,255,0.45)", marginBottom: 14, display: "flex", alignItems: "center", gap: 4 }}>
                      📍 {hs.destination?.nameVi}, {hs.destination?.province}
                    </div>

                    {/* Amenities */}
                    <div style={{ display: "flex", gap: 8, marginBottom: 16, flexWrap: "wrap" }}>
                      {(() => {
                        let amenities: string[] = [];
                        if (Array.isArray(hs.amenities)) amenities = hs.amenities;
                        else if (typeof hs.amenities === "string") {
                          try { amenities = JSON.parse(hs.amenities); } catch { amenities = []; }
                        }
                        const fallback = ["🔥 Fireplace", "🏔️ Mountain view", "🍳 Breakfast"];
                        return (amenities.length > 0 ? amenities : fallback).slice(0, 3).map((a: string) => (
                          <span key={a} style={{ fontSize: 12, color: "rgba(255,255,255,0.55)", background: "rgba(255,255,255,0.06)", padding: "4px 10px", borderRadius: 8 }}>
                            {a}
                          </span>
                        ));
                      })()}
                    </div>

                    {/* Footer */}
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", borderTop: "1px solid rgba(255,255,255,0.07)", paddingTop: 16 }}>
                      <div>
                        <span style={{ fontSize: 22, fontWeight: 700, color: "var(--amber)" }}>
                          {Number(hs.pricePerNight).toLocaleString("vi-VN")}₫
                        </span>
                        <span style={{ fontSize: 13, fontWeight: 400, color: "rgba(255,255,255,0.4)" }}>/đêm</span>
                      </div>
                      <button style={{
                        background: "transparent", border: "1px solid rgba(255,60,172,0.4)",
                        color: "var(--pink)", padding: "8px 18px", borderRadius: 20,
                        fontSize: 13, fontWeight: 600, cursor: "pointer", transition: "all 0.2s",
                      }}
                        onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = "var(--pink)"; (e.currentTarget as HTMLElement).style.color = "#fff"; }}
                        onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = "transparent"; (e.currentTarget as HTMLElement).style.color = "var(--pink)"; }}>
                        Book Now
                      </button>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
      </div>
    </section>
  );
}
