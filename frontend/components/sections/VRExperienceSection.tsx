"use client";
import { useState, useRef } from "react";

export function VRExperienceSection() {
  const [location, setLocation] = useState<"atacama" | "cerrotoco">("atacama");
  const iframeRef = useRef<HTMLIFrameElement>(null);

  return (
    <div className="fade-up" style={{ background: "var(--midnight)", margin: 0, maxWidth: "100%", padding: "100px 40px" }}>
      <div style={{ maxWidth: 1280, margin: "0 auto", display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: 80, alignItems: "center" }}>

        {/* Left: VR Visual */}
        <div style={{ position: "relative", borderRadius: 28, overflow: "hidden", aspectRatio: "4/3", background: "#0a1a2a" }}>
          
          <iframe 
            key={location} // Force iframe reload when location changes
            ref={iframeRef}
            width="100%" 
            height="100%" 
            style={{ border: "none" }}
            allow="fullscreen"
            src={`/vr/viewer.html?location=${location}`}
          />

            {/* Top right VR Badge */}
            <div style={{
              position: "absolute", top: 20, right: 20, pointerEvents: "none",
              background: "rgba(0,0,0,0.4)", border: "1px solid rgba(255,214,10,0.3)",
              padding: "8px 16px", borderRadius: 30, fontSize: 13, fontWeight: 600,
              color: "rgba(255,214,10,0.9)", display: "flex", alignItems: "center", gap: 8, zIndex: 1, backdropFilter: "blur(8px)",
            }}>
              <div className="animate-pulse-dot" style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--pink)" }} />
              Có Thể Tương Tác
            </div>

            {/* Bottom Controls Bar */}
            <div style={{
              position: "absolute", bottom: 20, left: "50%", transform: "translateX(-50%)",
              display: "flex", gap: 12, zIndex: 10, background: "rgba(0,0,0,0.5)", padding: "8px", borderRadius: 100, backdropFilter: "blur(12px)",
              border: "1px solid rgba(255,255,255,0.1)"
            }}>
              <button 
                onClick={() => setLocation("atacama")}
                style={{
                  background: location === "atacama" ? "var(--pink)" : "transparent",
                  color: location === "atacama" ? "#fff" : "rgba(255,255,255,0.7)",
                  padding: "10px 20px", borderRadius: 100, fontSize: 14, fontWeight: 600, cursor: "pointer", transition: "all 0.3s",
                  display: "flex", alignItems: "center", gap: 8
                }}>
                <span>🏜️</span> Thung lũng Atacama
              </button>

              <button 
                onClick={() => setLocation("cerrotoco")}
                style={{
                  background: location === "cerrotoco" ? "var(--pink)" : "transparent",
                  color: location === "cerrotoco" ? "#fff" : "rgba(255,255,255,0.7)",
                  padding: "10px 20px", borderRadius: 100, fontSize: 14, fontWeight: 600, cursor: "pointer", transition: "all 0.3s",
                  display: "flex", alignItems: "center", gap: 8
                }}>
                <span>🏔️</span> Đỉnh Cerro Toco
              </button>
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
            onClick={() => {
              if (iframeRef.current && iframeRef.current.requestFullscreen) {
                iframeRef.current.requestFullscreen();
              }
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
