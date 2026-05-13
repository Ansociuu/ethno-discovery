"use client";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { destinationsApi } from "@/lib/api";

interface Destination {
  id: number;
  nameVi: string;
  slug: string;
  province: string;
  coverImage?: string;
  difficulty: string;
  bestSeason?: string;
  altitude?: number;
  _count: { tours: number; homestays: number };
}

// Terrain SVG per card
function CardTerrain({ variant }: { variant: "large" | "tall" | "small" }) {
  if (variant === "large") return (
    <svg style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: "60%", opacity: 0.25, pointerEvents: "none" }} viewBox="0 0 400 200" preserveAspectRatio="none">
      <path d="M0 200 L0 120 Q50 80 100 100 Q150 120 200 60 Q230 30 260 50 Q290 70 320 40 Q360 10 400 50 L400 200Z" fill="rgba(255,255,255,0.08)" />
      <path d="M0 200 L0 150 Q80 110 160 140 Q240 170 320 120 Q360 100 400 130 L400 200Z" fill="rgba(255,255,255,0.05)" />
    </svg>
  );
  if (variant === "tall") return (
    <svg style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: "60%", opacity: 0.25, pointerEvents: "none" }} viewBox="0 0 200 300" preserveAspectRatio="none">
      <path d="M0 300 L0 180 Q50 130 100 160 Q150 190 200 120 L200 300Z" fill="rgba(255,255,255,0.08)" />
      <path d="M0 300 L0 230 Q80 200 160 220 Q180 228 200 210 L200 300Z" fill="rgba(255,255,255,0.05)" />
    </svg>
  );
  return (
    <svg style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: "60%", opacity: 0.25, pointerEvents: "none" }} viewBox="0 0 200 200" preserveAspectRatio="none">
      <path d="M0 200 L0 100 Q50 60 100 80 Q150 100 200 50 L200 200Z" fill="rgba(255,255,255,0.08)" />
    </svg>
  );
}

const FALLBACK_GRADIENTS = [
  "linear-gradient(135deg, #140D1F 0%, #FF3CAC 100%)",
  "linear-gradient(135deg, #1A1028 0%, #FFD60A 100%)",
  "linear-gradient(135deg, #24163A 0%, #FF3CAC 100%)",
  "linear-gradient(135deg, #140D1F 0%, #a855f7 100%)",
  "linear-gradient(135deg, #1A1028 0%, #FFD60A 100%)",
];

const CARD_ICONS = ["🏔️", "🪨", "🎪", "🌾", "🌺"];

export function FeaturedDestinations() {
  const { data, isLoading } = useQuery({
    queryKey: ["destinations", "featured"],
    queryFn: () => destinationsApi.getFeatured().then((r) => r.data.data as Destination[]),
  });

  const destinations = data || [];

  return (
    <section className="fade-up" style={{ padding: "100px 40px", maxWidth: 1280, margin: "0 auto" }}>
      {/* Header */}
      <div style={{ marginBottom: 16 }}>
        <span className="section-tag">Popular Destinations</span>
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 60, flexWrap: "wrap", gap: 20 }}>
        <div>
          <h2 style={{ fontFamily: "var(--font-serif)", fontSize: "clamp(32px, 4vw, 52px)", fontWeight: 700, lineHeight: 1.1, marginBottom: 12 }}>
            Vùng cao <em style={{ color: "var(--pink)", fontStyle: "italic" }}>huyền ảo</em>
          </h2>
          <p style={{ color: "var(--text)", fontSize: 17, fontWeight: 300, maxWidth: 500, lineHeight: 1.7 }}>
            Từng bản làng là một câu chuyện chờ bạn khám phá.
          </p>
        </div>
        <Link href="/destinations" className="btn-ghost" style={{ padding: "12px 24px", fontSize: 14, whiteSpace: "nowrap" }}>
          Xem tất cả <ChevronRight size={16} />
        </Link>
      </div>

      {/* Bento Grid — 4 cols, matches HTML exactly */}
      {isLoading ? (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16 }}>
          {[...Array(4)].map((_, i) => <div key={i} className="skeleton" style={{ height: i === 0 ? 420 : 200, borderRadius: 20, gridColumn: i === 0 ? "span 2" : "span 1" }} />)}
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gridAutoRows: "200px", gap: 16 }}>
          {destinations.map((dest, i) => {
            const isLarge = i === 0;  // span 2 cols + 2 rows
            const isTall = i === 3;   // span 1 col + 2 rows
            const variant = isLarge ? "large" : isTall ? "tall" : "small";

            return (
              <Link
                key={dest.id}
                href={`/destinations/${dest.slug}`}
                style={{
                  position: "relative",
                  borderRadius: 20,
                  overflow: "hidden",
                  cursor: "pointer",
                  textDecoration: "none",
                  display: "block",
                  gridColumn: isLarge ? "span 2" : "span 1",
                  gridRow: isLarge || isTall ? "span 2" : "span 1",
                  transition: "transform 0.35s, box-shadow 0.35s",
                }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLElement).style.transform = "translateY(-6px)";
                  (e.currentTarget as HTMLElement).style.boxShadow = "0 24px 60px rgba(0,0,0,0.5)";
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLElement).style.transform = "";
                  (e.currentTarget as HTMLElement).style.boxShadow = "";
                }}
              >
                {/* Background image or gradient */}
                <div style={{ position: "absolute", inset: 0, background: FALLBACK_GRADIENTS[i % FALLBACK_GRADIENTS.length] }}>
                  {dest.coverImage && (
                    <img src={dest.coverImage} alt={dest.nameVi} style={{ width: "100%", height: "100%", objectFit: "cover", position: "absolute", inset: 0 }} />
                  )}
                </div>

                {/* Terrain SVG */}
                <CardTerrain variant={variant} />

                {/* Dark overlay */}
                <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.2) 50%, transparent 100%)" }} />

                {/* Badge */}
                {i === 0 && (
                  <div style={{ position: "absolute", top: 16, right: 16, background: "rgba(255,60,172,0.9)", backdropFilter: "blur(8px)", padding: "4px 12px", borderRadius: 20, fontSize: 12, fontWeight: 600, color: "#fff" }}>
                    🏆 #1 Pick
                  </div>
                )}
                {i === 3 && (
                  <div style={{ position: "absolute", top: 16, right: 16, background: "rgba(251,191,36,0.9)", padding: "4px 12px", borderRadius: 20, fontSize: 12, fontWeight: 600, color: "#000" }}>
                    🌾 Harvest Season
                  </div>
                )}

                {/* Card Info */}
                <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: 24 }}>
                  <div style={{ width: 32, height: 32, borderRadius: 10, background: "rgba(255,255,255,0.15)", backdropFilter: "blur(8px)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, marginBottom: 10 }}>
                    {CARD_ICONS[i]}
                  </div>
                  <div style={{ fontFamily: "var(--font-serif)", fontSize: isLarge ? 32 : 22, fontWeight: 700, marginBottom: 4, color: "#fff" }}>
                    {dest.nameVi}
                  </div>
                  <div style={{ fontSize: 13, color: "rgba(255,255,255,0.6)", marginBottom: 12 }}>
                    {dest.province}
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
                    <span style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 13, fontWeight: 500 }}>
                      <span style={{ color: "var(--amber)" }}>★</span> 4.{8 + i % 2} ({200 + i * 312})
                    </span>
                    <span style={{ fontSize: 13, color: "rgba(255,255,255,0.55)" }}>
                      from <strong style={{ color: "var(--amber)", fontSize: 15 }}>{(65 + i * 25).toLocaleString()}$</strong>/person
                    </span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </section>
  );
}
