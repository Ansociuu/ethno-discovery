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
    <section className="bg-midnight section-py px-container overflow-hidden">
      <div className="max-w-[1280px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-20 items-center">
        
        {/* Mobile Header (Visible only on mobile/tablet) */}
        <div className="lg:hidden flex flex-col items-center text-center mb-2">
          <span className="section-tag mb-3">VR / AR Experience</span>
          <h2 className="h2-fluid mb-4">
            Khám phá trước khi <em className="text-amber not-italic italic">đặt chân đến</em>
          </h2>
        </div>

        {/* Left: VR Visual */}
        <div className="lg:col-span-7 flex flex-col gap-5">
          <div className="relative rounded-[32px] overflow-hidden aspect-[4/3] bg-black/40 shadow-2xl border border-white/5 group">
            <iframe
              key={location}
              ref={iframeRef}
              width="100%"
              height="100%"
              className="border-none"
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              src={mapsUrls[location]}
            />

            {/* Top right VR Badge */}
            <div className="absolute top-4 right-4 pointer-events-none bg-black/40 border border-blue-500/30 px-3 py-1.5 rounded-full text-[10px] md:text-xs font-bold color-[#4285F4] flex items-center gap-2 z-10 backdrop-blur-md">
              <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
              Google Street View
            </div>

            {/* Desktop Controls (Overlay) */}
            <div className="hidden lg:flex absolute bottom-8 left-1/2 -translate-x-1/2 gap-3 z-30 bg-black/60 p-1.5 rounded-full backdrop-blur-xl border border-white/20 shadow-2xl">
              <VRButtons location={location} setLocation={setLocation} />
            </div>
          </div>

          {/* Mobile Controls (Below Iframe) */}
          <div className="lg:hidden flex justify-center bg-white/5 p-1.5 rounded-3xl border border-white/10">
            <VRButtons location={location} setLocation={setLocation} isMobile />
          </div>
        </div>

        {/* Right: Content */}
        <div className="lg:col-span-5 flex flex-col items-start">
          {/* Desktop Header (Hidden on mobile) */}
          <div className="hidden lg:block">
            <span className="section-tag mb-4">VR / AR Experience</span>
            <h2 className="h2-fluid mb-6">
              Khám phá trước khi <em className="text-amber not-italic italic">đặt chân đến</em>
            </h2>
          </div>

          <p className="p-fluid text-white/50 mb-8 lg:mb-10 text-center lg:text-left">
            Trải nghiệm tour 360° sống động — dạo quanh ruộng bậc thang, ghé thăm bản làng H&apos;Mông, tất cả ngay trên thiết bị của bạn.
          </p>

          {/* Features */}
          <div className="space-y-3 md:space-y-4 mb-8 lg:mb-10 w-full max-w-sm mx-auto lg:mx-0">
            {[
              { icon: "🌐", text: "Toàn cảnh 360° chân thực từ Google Street View" },
              { icon: "👆", text: "Tương tác trực quan — vuốt & xoay để khám phá" },
              { icon: "📱", text: "Trải nghiệm mượt mà trên Mobile & Desktop" },
              { icon: "📍", text: "Tích hợp bản đồ & tọa độ GPS chính xác" }
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-4">
                <div className="w-9 h-9 md:w-10 md:h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-lg md:text-xl shrink-0">
                  {item.icon}
                </div>
                <span className="text-[13px] md:text-sm lg:text-base text-white/80 font-light">{item.text}</span>
              </div>
            ))}
          </div>

          {/* VR Button */}
          <div className="w-full flex justify-center lg:justify-start">
            <button 
              className="btn-primary py-3.5 px-10 text-sm flex items-center gap-2 shadow-xl shadow-pink/20"
              onClick={() => {
                if (iframeRef.current && iframeRef.current.requestFullscreen) {
                  iframeRef.current.requestFullscreen();
                }
              }}
            >
              <span className="text-lg">🥽</span> Try VR Tour Free
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

function VRButtons({ location, setLocation, isMobile = false }: { location: string; setLocation: any; isMobile?: boolean }) {
  return (
    <div className={`grid grid-cols-2 gap-2 ${isMobile ? "w-full" : "w-[380px]"}`}>
      <button
        onClick={() => setLocation("sapa")}
        className={`flex items-center justify-center gap-2 px-4 py-2.5 md:py-3 rounded-full text-[11px] md:text-sm font-bold transition-all cursor-pointer ${
          location === "sapa" ? "bg-pink text-white shadow-lg shadow-pink/30" : "text-white/70 hover:bg-white/20 bg-white/5"
        }`}
      >
        <span className="text-sm md:text-base">🌾</span> Võng Lúa
      </button>

      <button
        onClick={() => setLocation("fansipan")}
        className={`flex items-center justify-center gap-2 px-4 py-2.5 md:py-3 rounded-full text-[11px] md:text-sm font-bold transition-all cursor-pointer ${
          location === "fansipan" ? "bg-pink text-white shadow-lg shadow-pink/30" : "text-white/70 hover:bg-white/20 bg-white/5"
        }`}
      >
        <span className="text-sm md:text-base">🏔️</span> Đỉnh Fansipan
      </button>
    </div>
  );
}
