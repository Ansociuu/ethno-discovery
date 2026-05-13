"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Sparkles } from "lucide-react";

const AI_FEATURES = [
  { icon: "🧠", color: "rgba(255,60,172,0.15)", title: "Hiểu sở thích cá nhân", desc: "AI phân tích budget, thời gian, và vibe để gợi ý phù hợp nhất" },
  { icon: "🗺️", color: "rgba(255,214,10,0.15)", title: "Tối ưu lộ trình", desc: "Kết hợp điểm đến, phương tiện, và thời điểm lý tưởng" },
  { icon: "💬", color: "rgba(255,214,10,0.15)", title: "Chatbot 24/7 đa ngôn ngữ", desc: "Hỗ trợ VN · EN · JP · KR trong suốt hành trình" },
];

const TRAVEL_TYPES = ["Solo", "Couple", "Family", "Group"];
const VIBES = ["Văn hoá", "Adventure", "Chill", "Photography"];

export function AIPlannerTeaser() {
  return (
    <div className="fade-up" style={{ background: "var(--midnight)", margin: 0, maxWidth: "100%", padding: "100px 40px", position: "relative", overflow: "hidden" }}>
      {/* BG glow */}
      <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", width: 800, height: 600, background: "radial-gradient(ellipse, rgba(255,60,172,0.08) 0%, transparent 70%)", pointerEvents: "none" }} />

      <div style={{ maxWidth: 1280, margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 80, alignItems: "center", position: "relative", zIndex: 1 }}>
        {/* Left: AI Features */}
        <div>
          <span className="section-tag">AI Journey Planner</span>
          <h2 style={{ fontFamily: "var(--font-serif)", fontSize: "clamp(32px, 3.5vw, 48px)", fontWeight: 700, lineHeight: 1.1, margin: "12px 0 0" }}>
            Lịch trình hoàn hảo —{" "}
            <em style={{ color: "var(--amber)", fontStyle: "italic" }}>chỉ trong 30 giây</em>
          </h2>
          <p style={{ color: "var(--text)", fontSize: 16, lineHeight: 1.7, marginTop: 12, marginBottom: 0, maxWidth: 500 }}>
            AI hiểu văn hoá, địa lý, và sở thích của bạn để tạo hành trình độc nhất.
          </p>

          {/* Feature list */}
          <div style={{ marginTop: 32, display: "flex", flexDirection: "column", gap: 16 }}>
            {AI_FEATURES.map(feat => (
              <div key={feat.title} style={{ display: "flex", alignItems: "flex-start", gap: 14, padding: 16, background: "var(--glass)", border: "1px solid var(--glass-border)", borderRadius: 14, backdropFilter: "blur(8px)" }}>
                <div style={{ width: 40, height: 40, borderRadius: 12, background: feat.color, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, flexShrink: 0 }}>
                  {feat.icon}
                </div>
                <div>
                  <h4 style={{ fontSize: 15, fontWeight: 600, marginBottom: 2, color: "#fff" }}>{feat.title}</h4>
                  <p style={{ fontSize: 13, color: "rgba(255,255,255,0.45)", lineHeight: 1.5, margin: 0 }}>{feat.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Interactive Form Card */}
        <div style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 24, padding: 32, backdropFilter: "blur(16px)" }}>
          <div style={{ fontSize: 18, fontWeight: 600, marginBottom: 8, display: "flex", alignItems: "center", gap: 8, color: "#fff" }}>
            <span style={{ color: "var(--amber)" }}>✨</span> Generate My Trip
          </div>
          <p style={{ fontSize: 14, color: "rgba(255,255,255,0.45)", marginBottom: 28 }}>Trả lời vài câu — AI sẽ làm phần còn lại.</p>

          {/* Travel type */}
          <div style={{ marginBottom: 20 }}>
            <span style={{ fontSize: 12, fontWeight: 600, letterSpacing: "0.08em", color: "rgba(255,255,255,0.5)", textTransform: "uppercase", display: "block", marginBottom: 8 }}>
              🎯 Bạn đi với ai?
            </span>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {TRAVEL_TYPES.map((t, i) => (
                <span key={t} style={{
                  background: i === 0 ? "rgba(255,60,172,0.15)" : "var(--glass)",
                  border: `1px solid ${i === 0 ? "rgba(255,60,172,0.4)" : "var(--glass-border)"}`,
                  color: i === 0 ? "var(--pink)" : "rgba(255,255,255,0.6)",
                  padding: "8px 16px", borderRadius: 20, fontSize: 13, cursor: "pointer",
                  transition: "all 0.2s", whiteSpace: "nowrap",
                }}>
                  {t}
                </span>
              ))}
            </div>
          </div>

          {/* Vibe */}
          <div style={{ marginBottom: 20 }}>
            <span style={{ fontSize: 12, fontWeight: 600, letterSpacing: "0.08em", color: "rgba(255,255,255,0.5)", textTransform: "uppercase", display: "block", marginBottom: 8 }}>
              🌈 Vibe chuyến đi?
            </span>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {VIBES.map((v, i) => (
                <span key={v} style={{
                  background: i === 0 ? "rgba(255,214,10,0.15)" : "var(--glass)",
                  border: `1px solid ${i === 0 ? "rgba(255,214,10,0.4)" : "var(--glass-border)"}`,
                  color: i === 0 ? "var(--amber)" : "rgba(255,255,255,0.6)",
                  padding: "8px 16px", borderRadius: 20, fontSize: 13, cursor: "pointer",
                  transition: "all 0.2s", whiteSpace: "nowrap",
                }}>
                  {v}
                </span>
              ))}
            </div>
          </div>

          {/* Days slider */}
          <div style={{ marginBottom: 20 }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
              <span style={{ fontSize: 12, fontWeight: 600, letterSpacing: "0.08em", color: "rgba(255,255,255,0.5)", textTransform: "uppercase" }}>📅 Số ngày</span>
              <span style={{ fontSize: 14, fontWeight: 600, color: "var(--pink)" }}>5 ngày</span>
            </div>
            <input type="range" min={2} max={14} defaultValue={5} style={{
              width: "100%", WebkitAppearance: "none", height: 4, borderRadius: 2,
              background: "rgba(255,255,255,0.1)", outline: "none",
            }} />
          </div>

          {/* Budget slider */}
          <div style={{ marginBottom: 28 }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
              <span style={{ fontSize: 12, fontWeight: 600, letterSpacing: "0.08em", color: "rgba(255,255,255,0.5)", textTransform: "uppercase" }}>💰 Budget (USD)</span>
              <span style={{ fontSize: 14, fontWeight: 600, color: "var(--pink)" }}>$800</span>
            </div>
            <input type="range" min={200} max={3000} defaultValue={800} step={100} style={{
              width: "100%", WebkitAppearance: "none", height: 4, borderRadius: 2,
              background: "rgba(255,255,255,0.1)", outline: "none",
            }} />
          </div>

          {/* Generate button */}
          <Link href="/ai-planner" style={{
            width: "100%", background: "linear-gradient(135deg, var(--pink), var(--amber))",
            border: "none", padding: "16px", borderRadius: 14, color: "#000",
            fontSize: 16, fontWeight: 700, cursor: "pointer", display: "flex",
            alignItems: "center", justifyContent: "center", gap: 8, letterSpacing: "0.02em",
            textDecoration: "none", transition: "all 0.3s",
          }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = "translateY(-2px)"; (e.currentTarget as HTMLElement).style.boxShadow = "0 12px 40px rgba(255,60,172,0.4)"; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = ""; (e.currentTarget as HTMLElement).style.boxShadow = ""; }}>
            ✨ Generate My Perfect Trip ↗
          </Link>
        </div>
      </div>
    </div>
  );
}
