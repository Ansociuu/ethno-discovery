"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { 
  Compass, 
  Sparkles, 
  MapPin, 
  Calendar, 
  Wallet, 
  Search,
  ChevronDown
} from "lucide-react";

// Terrain SVG component (unchanged)
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
    <section className="relative h-screen flex flex-col items-center justify-center overflow-hidden max-w-full p-0 m-0">
      {/* Background Orbs & Effects */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_20%_40%,rgba(255,60,172,0.15)_0%,transparent_60%),radial-gradient(ellipse_60%_80%_at_80%_60%,rgba(255,214,10,0.12)_0%,transparent_60%),linear-gradient(180deg,var(--midnight)_0%,var(--dark)_40%,rgba(20,13,31,0.95)_100%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.08)_1px,transparent_1px)] bg-[length:40px_40px]" />
        <TerrainSVG />
        <div className="animate-float absolute w-[400px] h-[400px] rounded-full bg-pink/10 blur-[80px] -top-[100px] -left-[100px]" />
        <div className="animate-float absolute w-[300px] h-[300px] rounded-full bg-amber/10 blur-[80px] -bottom-[50px] -right-[50px] [animation-delay:-4s]" />
      </div>

      {/* Content Container */}
      <div className="relative z-10 text-center max-w-[1000px] px-6 w-full animate-fade-up">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 backdrop-blur-xl px-5 py-2 rounded-full text-xs font-medium text-text mb-8">
          <div className="animate-pulse-dot w-1.5 h-1.5 rounded-full bg-pink" />
          Nền tảng du lịch văn hóa AI · Hà Giang - Sa Pa - Mộc Châu
        </div>

        {/* Heading */}
        <h1 className="font-serif text-[clamp(40px,8vw,80px)] font-black leading-[1.1] mb-6 tracking-tight">
          Khám Phá <span className="text-gradient-pink">Tâm Hồn</span><br />
          Vùng Cao <span className="text-gradient-amber">Việt Nam</span>
        </h1>

        <p className="text-lg md:text-xl text-white/60 font-light leading-relaxed mb-10 max-w-2xl mx-auto">
          Hành trình được cá nhân hóa bởi trí tuệ nhân tạo — nơi sương mù đại ngàn hòa quyện cùng bản sắc H&apos;Mông &amp; Dao.
        </p>

        {/* Main Actions */}
        <div className="flex flex-wrap items-center justify-center gap-4 mb-16">
          <Link href="/tours" className="btn-primary no-underline flex items-center gap-2 px-8">
            <Compass size={20} /> Khám Phá Tours
          </Link>
          <Link href="/ai-planner" className="btn-ghost no-underline flex items-center gap-2 px-8">
            <Sparkles size={20} className="text-amber" /> Lập Kế Hoạch AI
          </Link>
        </div>

        {/* Advanced Search Bar */}
        <form onSubmit={handleSearch} className="glass mx-auto max-w-[860px] p-2 rounded-[24px] flex flex-col md:flex-row items-stretch gap-2 shadow-2xl shadow-black/40">
          <div className="flex-1 flex items-center gap-4 px-4 py-3 border-b md:border-b-0 md:border-r border-white/10">
            <MapPin size={18} className="text-pink shrink-0" />
            <div className="text-left w-full">
              <span className="block text-[10px] font-bold text-pink uppercase tracking-widest mb-1">Điểm đến</span>
              <input 
                value={fields.destination} 
                onChange={e => setFields(f => ({ ...f, destination: e.target.value }))}
                placeholder="Sa Pa, Hà Giang..." 
                className="bg-transparent border-none outline-none text-white text-sm w-full font-medium placeholder:text-white/20"
              />
            </div>
          </div>

          <div className="flex-1 flex items-center gap-4 px-4 py-3 border-b md:border-b-0 md:border-r border-white/10">
            <Calendar size={18} className="text-pink shrink-0" />
            <div className="text-left w-full">
              <span className="block text-[10px] font-bold text-pink uppercase tracking-widest mb-1">Thời gian</span>
              <input 
                value={fields.days} 
                onChange={e => setFields(f => ({ ...f, days: e.target.value }))}
                placeholder="3 - 5 ngày" 
                className="bg-transparent border-none outline-none text-white text-sm w-full font-medium placeholder:text-white/20"
              />
            </div>
          </div>

          <div className="flex-1 flex items-center gap-4 px-4 py-3">
            <Wallet size={18} className="text-pink shrink-0" />
            <div className="text-left w-full">
              <span className="block text-[10px] font-bold text-pink uppercase tracking-widest mb-1">Ngân sách</span>
              <input 
                value={fields.budget} 
                onChange={e => setFields(f => ({ ...f, budget: e.target.value }))}
                placeholder="2tr - 5tr" 
                className="bg-transparent border-none outline-none text-white text-sm w-full font-medium placeholder:text-white/20"
              />
            </div>
          </div>

          <button type="submit" className="bg-gradient-to-r from-pink to-amber text-midnight font-bold px-8 py-4 rounded-2xl hover:scale-[1.02] transition-transform flex items-center justify-center gap-2 border-none cursor-pointer">
            <Search size={20} />
            AI Search
          </button>
        </form>
      </div>

      {/* Scroll Hint */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 opacity-30 flex flex-col items-center gap-3">
        <span className="text-[10px] uppercase tracking-[0.3em] font-bold">Cuộn xuống</span>
        <div className="w-px h-12 bg-gradient-to-b from-pink to-transparent animate-pulse" />
      </div>
    </section>
  );
}
