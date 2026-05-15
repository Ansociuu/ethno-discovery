"use client";
import { useState, useRef } from "react";

export function VRExperienceSection() {
  const [location, setLocation] = useState<"sapa" | "fansipan">("sapa");
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const mapsUrls = {
    sapa: "https://www.google.com/maps/embed?pb=!4v1778805743777!6m8!1m7!1sCAoSFkNJSE0wb2dLRUlDQWdJRHEzZkdtSkE.!2m2!1d21.84939676829333!2d104.1029369273855!3f265.4742670258581!4f4.91017821091279!5f0.7820865974627469",
    fansipan: "https://www.google.com/maps/embed?pb=!4v1778806154492!6m8!1m7!1sCAoSFkNJSE0wb2dLRUlDQWdJRENyNEQ3Ymc.!2m2!1d22.30463441906802!2d103.7772983226993!3f106.2586155908621!4f-5.154682589122899!5f0.4000000000000002"
  };

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
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            src={mapsUrls[location]}
          />

          {/* Top right VR Badge */}
          <div style={{
            position: "absolute", top: 20, right: 20, pointerEvents: "none",
            background: "rgba(0,0,0,0.4)", border: "1px solid rgba(66, 133, 244, 0.3)",
            padding: "8px 16px", borderRadius: 30, fontSize: 13, fontWeight: 600,
            color: "#4285F4", display: "flex", alignItems: "center", gap: 8, zIndex: 1, backdropFilter: "blur(8px)",
          }}>
            <div className="animate-pulse-dot" style={{ width: 6, height: 6, borderRadius: "50%", background: "#4285F4" }} />
            Google Street View
          </div>

          {/* Bottom Controls Bar */}
          <div style={{
            position: "absolute", bottom: 20, left: "50%", transform: "translateX(-50%)",
            display: "flex", gap: 12, zIndex: 10, background: "rgba(0,0,0,0.5)", padding: "8px", borderRadius: 100, backdropFilter: "blur(12px)",
            border: "1px solid rgba(255,255,255,0.1)"
          }}>
            <button
              onClick={() => setLocation("sapa")}
              style={{
                background: location === "sapa" ? "var(--pink)" : "transparent",
                color: location === "sapa" ? "#fff" : "rgba(255,255,255,0.7)",
                padding: "10px 20px", borderRadius: 100, fontSize: 14, fontWeight: 600, cursor: "pointer", transition: "all 0.3s",
                display: "flex", alignItems: "center", gap: 8
              }}>
              <span>🌾</span> Võng Lúa (Móng Ngựa)
            </button>

            <button
              onClick={() => setLocation("fansipan")}
              style={{
                background: location === "fansipan" ? "var(--pink)" : "transparent",
                color: location === "fansipan" ? "#fff" : "rgba(255,255,255,0.7)",
                padding: "10px 20px", borderRadius: 100, fontSize: 14, fontWeight: 600, cursor: "pointer", transition: "all 0.3s",
                display: "flex", alignItems: "center", gap: 8
              }}>
              <span>🏔️</span> Đỉnh Fansipan
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

          {/* Tính năng (đã cập nhật để sát với thực tế) */}
          <div style={{ display: "flex", flexDirection: "column", gap: 16, marginBottom: 36 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{ width: 40, height: 40, borderRadius: 12, background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20 }}>
                🌐
              </div>
              <span style={{ fontSize: 16, color: "rgba(255,255,255,0.8)" }}>Toàn cảnh 360° chân thực từ Google Street View</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{ width: 40, height: 40, borderRadius: 12, background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20 }}>
                👆
              </div>
              <span style={{ fontSize: 16, color: "rgba(255,255,255,0.8)" }}>Tương tác trực quan — vuốt & xoay để khám phá</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{ width: 40, height: 40, borderRadius: 12, background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20 }}>
                📱
              </div>
              <span style={{ fontSize: 16, color: "rgba(255,255,255,0.8)" }}>Trải nghiệm mượt mà trên Mobile & Desktop</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{ width: 40, height: 40, borderRadius: 12, background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20 }}>
                📍
              </div>
              <span style={{ fontSize: 16, color: "rgba(255,255,255,0.8)" }}>Tích hợp bản đồ & tọa độ GPS chính xác</span>
            </div>
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
