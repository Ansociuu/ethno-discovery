"use client";

export function VRExperienceSection() {
  return (
    <div className="fade-up" style={{ background: "var(--midnight)", margin: 0, maxWidth: "100%", padding: "100px 40px" }}>
      <div style={{ maxWidth: 1280, margin: "0 auto", display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: 80, alignItems: "center" }}>

        {/* Left: VR Visual */}
        <div style={{ position: "relative", borderRadius: 28, overflow: "hidden", aspectRatio: "4/3" }}>
          {/* Dark blue VR background */}
          <div style={{
            background: "linear-gradient(135deg, #0d2030, #1a4060, #0a1a2a)",
            width: "100%", height: "100%", position: "relative",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            {/* Rotating circles */}
            {[
              { size: "80%", color: "rgba(255,60,172,0.15)", duration: "20s", direction: "normal" },
              { size: "60%", color: "rgba(255,60,172,0.15)", duration: "15s", direction: "reverse" },
              { size: "40%", color: "rgba(255,214,10,0.10)", duration: "10s", direction: "normal" },
            ].map((circle, i) => (
              <div key={i} style={{
                position: "absolute",
                width: circle.size, height: circle.size,
                borderRadius: "50%",
                border: `1px solid ${circle.color}`,
                animation: `rotate ${circle.duration} linear infinite ${circle.direction === "reverse" ? "reverse" : ""}`,
              }} />
            ))}

            {/* VR Badge center */}
            <div style={{
              background: "rgba(255,214,10,0.15)", border: "1px solid rgba(255,214,10,0.3)",
              padding: "10px 20px", borderRadius: 30, fontSize: 14, fontWeight: 600,
              color: "var(--amber)", display: "flex", alignItems: "center", gap: 8, position: "relative", zIndex: 1,
            }}>
              <div className="animate-pulse-dot" style={{ width: 8, height: 8, borderRadius: "50%", background: "var(--pink)" }} />
              360° Live Preview
            </div>

            {/* Location label 1: bottom-left */}
            <div style={{
              position: "absolute", bottom: 24, left: 24,
              background: "rgba(0,0,0,0.7)", backdropFilter: "blur(12px)",
              border: "1px solid rgba(255,255,255,0.1)", padding: "10px 16px",
              borderRadius: 12, display: "flex", alignItems: "center", gap: 8, fontSize: 13,
            }}>
              <span>🏔️</span>
              <div>
                <div style={{ fontSize: 12, fontWeight: 600, color: "#fff" }}>Fansipan Peak</div>
                <div style={{ fontSize: 11, color: "rgba(255,255,255,0.45)" }}>3,143m · Lào Cai</div>
              </div>
            </div>

            {/* Location label 2: top-right */}
            <div style={{
              position: "absolute", top: 24, right: 24,
              background: "rgba(0,0,0,0.7)", backdropFilter: "blur(12px)",
              border: "1px solid rgba(255,255,255,0.1)", padding: "10px 16px",
              borderRadius: 12, display: "flex", alignItems: "center", gap: 8, fontSize: 13,
            }}>
              <span>🌾</span>
              <div>
                <div style={{ fontSize: 12, fontWeight: 600, color: "#fff" }}>Mù Cang Chải</div>
                <div style={{ fontSize: 11, color: "rgba(255,255,255,0.45)" }}>Harvest Season</div>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Content */}
        <div>
          <span className="section-tag">VR / AR Experience</span>
          <h2 style={{ fontFamily: "var(--font-serif)", fontSize: "clamp(28px, 3.5vw, 48px)", fontWeight: 700, lineHeight: 1.1, margin: "12px 0 16px" }}>
            Khám phá trước khi <em style={{ color: "var(--amber)", fontStyle: "italic" }}>đặt chân đến</em>
          </h2>
          <p style={{ color: "rgba(255,255,255,0.5)", fontSize: 16, lineHeight: 1.7, marginBottom: 28 }}>
            Trải nghiệm tour 360° sống động — dạo quanh ruộng bậc thang, ghé thăm bản làng H&apos;Mông, tất cả ngay trên thiết bị của bạn.
          </p>

          {/* Feature list */}
          <div style={{ display: "flex", flexDirection: "column", gap: 14, marginBottom: 36 }}>
            {[
              { icon: "🥽", text: "VR headset compatible (Meta Quest, Apple Vision Pro)" },
              { icon: "📱", text: "Mobile AR — point & explore bản làng" },
              { icon: "🎧", text: "Audio guide đa ngôn ngữ kèm theo" },
              { icon: "🗺️", text: "GPS map realtime trong chuyến đi" },
            ].map(feat => (
              <div key={feat.icon} style={{ display: "flex", alignItems: "center", gap: 12, fontSize: 14, color: "rgba(255,255,255,0.65)" }}>
                <div style={{ width: 32, height: 32, borderRadius: 10, background: "rgba(255,214,10,0.12)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, flexShrink: 0 }}>
                  {feat.icon}
                </div>
                {feat.text}
              </div>
            ))}
          </div>

          {/* VR Button */}
          <button style={{
            background: "transparent", border: "1px solid var(--pink)", color: "var(--pink)",
            padding: "14px 32px", borderRadius: 40, fontSize: 15, fontWeight: 600,
            cursor: "pointer", transition: "all 0.3s", display: "inline-flex", alignItems: "center", gap: 8,
          }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = "var(--pink)"; (e.currentTarget as HTMLElement).style.color = "#fff"; (e.currentTarget as HTMLElement).style.transform = "translateY(-2px)"; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = "transparent"; (e.currentTarget as HTMLElement).style.color = "var(--pink)"; (e.currentTarget as HTMLElement).style.transform = ""; }}>
            🥽 Try VR Tour Free
          </button>
        </div>
      </div>
    </div>
  );
}
