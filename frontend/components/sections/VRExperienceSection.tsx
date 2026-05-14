"use client";
import { useState, useEffect, useRef } from "react";

export function VRExperienceSection() {
  const [location, setLocation] = useState<"sapa" | "fansipan">("sapa");
  const [baseUrl, setBaseUrl] = useState("");
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setBaseUrl(window.location.origin);
    }
  }, []);

  const images = {
    sapa: "/vr/sapa.png",
    fansipan: "/vr/fansipan.png"
  };

  return (
    <div className="fade-up" style={{ background: "var(--midnight)", margin: 0, maxWidth: "100%", padding: "100px 40px" }}>
      <div style={{ maxWidth: 1280, margin: "0 auto", display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: 80, alignItems: "center" }}>

        {/* Left: VR Visual */}
        <div style={{ position: "relative", borderRadius: 28, overflow: "hidden", aspectRatio: "4/3", background: "#0a1a2a" }}>
          
          {baseUrl ? (
            <iframe 
              ref={iframeRef}
              width="100%" 
              height="100%" 
              style={{ border: "none" }}
              allow="fullscreen"
              src={`https://cdn.pannellum.org/2.5/pannellum.htm#panorama=${encodeURIComponent(baseUrl + images[location])}&autoLoad=true&pitch=10&yaw=180&hfov=110`}
            />
          ) : (
            <div className="w-full h-full bg-white/5 animate-pulse flex items-center justify-center text-white/40">Đang khởi tạo VR 360...</div>
          )}

            {/* VR Badge center */}
            <div style={{
              position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", pointerEvents: "none",
              background: "rgba(0,0,0,0.3)", border: "1px solid rgba(255,214,10,0.2)",
              padding: "10px 20px", borderRadius: 30, fontSize: 14, fontWeight: 600,
              color: "rgba(255,214,10,0.7)", display: "flex", alignItems: "center", gap: 8, zIndex: 1, backdropFilter: "blur(4px)",
              opacity: 0.8
            }}>
              <div className="animate-pulse-dot" style={{ width: 8, height: 8, borderRadius: "50%", background: "var(--pink)" }} />
              Kéo để xoay 360°
            </div>

            {/* Location label 1: bottom-left */}
            <button 
              onClick={() => setLocation("fansipan")}
              style={{
                position: "absolute", bottom: 24, left: 24,
                background: location === "fansipan" ? "rgba(255,60,172,0.2)" : "rgba(0,0,0,0.6)", backdropFilter: "blur(12px)",
                border: `1px solid ${location === "fansipan" ? "rgba(255,60,172,0.5)" : "rgba(255,255,255,0.1)"}`, padding: "10px 16px",
                borderRadius: 12, display: "flex", alignItems: "center", gap: 8, fontSize: 13, cursor: "pointer", transition: "all 0.3s",
                zIndex: 10
              }}>
              <span>🏔️</span>
              <div style={{ textAlign: "left" }}>
                <div style={{ fontSize: 12, fontWeight: 600, color: location === "fansipan" ? "var(--pink)" : "#fff" }}>Fansipan Peak</div>
                <div style={{ fontSize: 11, color: "rgba(255,255,255,0.45)" }}>3,143m · Lào Cai</div>
              </div>
            </button>

            {/* Location label 2: top-right */}
            <button 
              onClick={() => setLocation("sapa")}
              style={{
                position: "absolute", top: 24, right: 24,
                background: location === "sapa" ? "rgba(255,214,10,0.2)" : "rgba(0,0,0,0.6)", backdropFilter: "blur(12px)",
                border: `1px solid ${location === "sapa" ? "rgba(255,214,10,0.5)" : "rgba(255,255,255,0.1)"}`, padding: "10px 16px",
                borderRadius: 12, display: "flex", alignItems: "center", gap: 8, fontSize: 13, cursor: "pointer", transition: "all 0.3s",
                zIndex: 10
              }}>
              <span>🌾</span>
              <div style={{ textAlign: "left" }}>
                <div style={{ fontSize: 12, fontWeight: 600, color: location === "sapa" ? "var(--amber)" : "#fff" }}>Mù Cang Chải</div>
                <div style={{ fontSize: 11, color: "rgba(255,255,255,0.45)" }}>Harvest Season</div>
              </div>
            </button>
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
