"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence, Variants } from "framer-motion";
import {
  Compass,
  Sparkles,
  MapPin,
  Calendar,
  Wallet,
  Search
} from "lucide-react";
import { searchApi } from "@/lib/api";

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

const SLIDES = [
  {
    image: "/images/hero-bg.png",
    badge: "Nền tảng du lịch văn hóa · Dân tộc H'Mông - Dao",
    titleLine1Part1: "Khám Phá ",
    titleLine1Part2: "Bản Sắc",
    titleLine2Part1: "Vùng Cao ",
    titleLine2Part2: "Việt Nam",
    description: "Hành trình được cá nhân hóa bởi trí tuệ nhân tạo — nơi sương mù đại ngàn hòa quyện cùng bản sắc H'Mông & Dao.",
    animation: "up"
  },
  {
    image: "/images/hero-bg-2.png",
    badge: "Cung đường huyền thoại · Mã Pí Lèng - Đồng Văn",
    titleLine1Part1: "Chinh Phục ",
    titleLine1Part2: "Đỉnh Cao",
    titleLine2Part1: "Đá Núi ",
    titleLine2Part2: "Hà Giang",
    description: "Trải nghiệm trọn vẹn vẻ hùng vĩ của Cao nguyên đá qua lăng kính độc bản và lịch trình AI tối ưu hóa.",
    animation: "left"
  },
  {
    image: "/images/hmong-village.png",
    badge: "Bản tình ca vùng cao · Đồi chè xanh mướt",
    titleLine1Part1: "Thức Giấc ",
    titleLine1Part2: "Giữa Đồi",
    titleLine2Part1: "Chè Xanh ",
    titleLine2Part2: "Mộc Châu",
    description: "Tìm lại sự bình yên trong tâm hồn giữa những nương chè bát ngát và bản làng thanh bình của người H'Mông & Dao.",
    animation: "scale"
  }
];

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.5, delayChildren: 0.4 } // Slower stagger
  }
};

const getVariants = (type: string): Record<string, Variants> => {
  // Lower stiffness = slower spring motion. Higher damping = less bounce
  switch (type) {
    case "left":
      return {
        badge: {
          hidden: { opacity: 0, x: -30, filter: "blur(5px)" },
          visible: { opacity: 1, x: 0, filter: "blur(0px)", transition: { type: "spring", stiffness: 40, damping: 20 } },
        },
        heading: {
          hidden: { opacity: 0, x: 60, filter: "blur(10px)" },
          visible: { opacity: 1, x: 0, filter: "blur(0px)", transition: { type: "spring", stiffness: 50, damping: 20 } },
        },
        desc: {
          hidden: { opacity: 0, y: 30, filter: "blur(5px)" },
          visible: { opacity: 1, y: 0, filter: "blur(0px)", transition: { type: "spring", stiffness: 45, damping: 20 } },
        }
      };
    case "scale":
      return {
        badge: {
          hidden: { opacity: 0, y: -20 },
          visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 40, damping: 20 } },
        },
        heading: {
          hidden: { opacity: 0, scale: 0.8, filter: "blur(10px)" },
          visible: { opacity: 1, scale: 1, filter: "blur(0px)", transition: { type: "spring", stiffness: 50, damping: 20 } },
        },
        desc: {
          hidden: { opacity: 0, scale: 0.95, y: 20 },
          visible: { opacity: 1, scale: 1, y: 0, transition: { type: "spring", stiffness: 45, damping: 20 } },
        }
      };
    case "up":
    default:
      return {
        badge: {
          hidden: { opacity: 0, y: -20, filter: "blur(5px)" },
          visible: { opacity: 1, y: 0, filter: "blur(0px)", transition: { type: "spring", stiffness: 40, damping: 20 } },
        },
        heading: {
          hidden: { opacity: 0, y: 50, filter: "blur(10px)" },
          visible: { opacity: 1, y: 0, filter: "blur(0px)", transition: { type: "spring", stiffness: 50, damping: 20 } },
        },
        desc: {
          hidden: { opacity: 0, y: 20, filter: "blur(5px)" },
          visible: { opacity: 1, y: 0, filter: "blur(0px)", transition: { type: "spring", stiffness: 45, damping: 20 } },
        }
      };
  }
};

const TypewriterText = ({ text }: { text: string }) => {
  const words = text.split(" ");
  return (
    <>
      {words.map((word, index) => (
        <motion.span
          key={index}
          initial={{ opacity: 0, filter: "blur(4px)" }}
          animate={{ opacity: 1, filter: "blur(0px)" }}
          transition={{
            duration: 0.4,
            delay: index * 0.1 + 1.2
          }}
          className="inline-block mr-[0.25em]"
        >
          {word}
        </motion.span>
      ))}
    </>
  );
};

export function HeroSection() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [type, setType] = useState("all");
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSugg, setShowSugg] = useState(false);
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlideIndex((prev) => (prev + 1) % SLIDES.length);
    }, 11000); // Increased slide duration to 11 seconds
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (query.length < 2) { setSuggestions([]); return; }
    const t = setTimeout(async () => {
      try {
        const res = await searchApi.suggestions(query);
        setSuggestions(res.data.data || []);
      } catch {}
    }, 300);
    return () => clearTimeout(t);
  }, [query]);

  const handleSearch = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!query && type === "all") return;
    router.push(`/search?q=${encodeURIComponent(query)}&type=${type}`);
  };

  const selectSuggestion = (s: string) => {
    setQuery(s);
    setShowSugg(false);
    router.push(`/search?q=${encodeURIComponent(s)}&type=${type}`);
  };

  const currentSlide = SLIDES[currentSlideIndex];
  const slideVariants = getVariants(currentSlide.animation);

  return (
    <section className="relative min-h-[100vh] flex flex-col items-center justify-center overflow-hidden max-w-full p-0 m-0 pt-20 pb-16">
      {/* Background Image Slideshow & Overlay */}
      <div className="absolute inset-0 z-0 bg-dark">
        <AnimatePresence mode="popLayout">
          <motion.div
            key={currentSlideIndex}
            // Ken Burns Effect: crossfade and continuous scale over the duration
            initial={{ opacity: 0, scale: currentSlideIndex % 2 === 0 ? 1 : 1.15 }}
            animate={{ opacity: 1, scale: currentSlideIndex % 2 === 0 ? 1.15 : 1 }}
            exit={{ opacity: 0 }}
            transition={{
              opacity: { duration: 1.5, ease: "easeInOut" },
              scale: { duration: 15, ease: "linear" }
            }}
            className="absolute inset-0 origin-center"
          >
            <Image
              src={currentSlide.image}
              alt="Vietnam Ethnic Landscapes"
              fill
              priority={currentSlideIndex === 0}
              quality={100}
              className="object-cover"
              sizes="100vw"
            />
          </motion.div>
        </AnimatePresence>

        {/* Gradient overlays for readability and luxury feel */}
        <div className="absolute inset-0 bg-gradient-to-b from-midnight/40 via-dark/60 to-midnight/90 z-10 pointer-events-none" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_20%_40%,rgba(255,60,172,0.15)_0%,transparent_60%),radial-gradient(ellipse_60%_80%_at_80%_60%,rgba(255,214,10,0.12)_0%,transparent_60%)] z-10 pointer-events-none" />
        <div className="absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.08)_1px,transparent_1px)] bg-[length:40px_40px] z-10 pointer-events-none" />

        <div className="z-10 absolute inset-0 pointer-events-none">
          <TerrainSVG />
        </div>

        {/* Animated Orbs */}
        <motion.div
          animate={{ y: [-20, 20, -20], scale: [1, 1.05, 1] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute w-[400px] h-[400px] rounded-full bg-pink/10 blur-[80px] -top-[100px] -left-[100px] z-10 pointer-events-none"
        />
        <motion.div
          animate={{ y: [20, -20, 20], scale: [1, 1.1, 1] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          className="absolute w-[300px] h-[300px] rounded-full bg-amber/10 blur-[80px] -bottom-[50px] -right-[50px] z-10 pointer-events-none"
        />
      </div>

      {/* Content Container */}
      <div className="relative z-20 text-center max-w-[1000px] px-6 w-full mt-auto mb-10">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlideIndex}
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit={{ opacity: 0, transition: { duration: 0.5 } }}
            className="w-full flex flex-col items-center"
          >
            {/* Badge */}
            <motion.div variants={slideVariants.badge} className="inline-flex items-center gap-2 bg-white/5 border border-white/10 backdrop-blur-xl px-5 py-2 rounded-full text-xs font-medium text-text mb-8">
              <div className="animate-pulse-dot w-1.5 h-1.5 rounded-full bg-pink" />
              {currentSlide.badge}
            </motion.div>

            {/* Heading */}
            <motion.h1 variants={slideVariants.heading} className="font-serif text-[clamp(32px,7vw,80px)] font-black leading-[1.1] mb-4 md:mb-6 tracking-tight">
              {currentSlide.titleLine1Part1}<span className="text-gradient-pink">{currentSlide.titleLine1Part2}</span><br />
              {currentSlide.titleLine2Part1}<span className="text-gradient-amber">{currentSlide.titleLine2Part2}</span>
            </motion.h1>

            <motion.p variants={slideVariants.desc} className="text-lg md:text-xl text-white/80 font-light leading-relaxed mb-10 max-w-2xl mx-auto text-shadow-sm min-h-[80px]">
              <TypewriterText text={currentSlide.description} />
            </motion.p>
          </motion.div>
        </AnimatePresence>

        {/* Main Actions (Static, doesn't change with slide) */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5, type: "spring" }} className="flex flex-wrap items-center justify-center gap-4 mb-16">
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Link href="/tours" className="btn-primary no-underline flex items-center gap-2 px-8">
              <Compass size={20} /> Khám Phá Tours
            </Link>
          </motion.div>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Link href="/ai-planner" className="btn-ghost no-underline flex items-center gap-2 px-8">
              <Sparkles size={20} className="text-amber" /> Lập Kế Hoạch AI
            </Link>
          </motion.div>
        </motion.div>

        {/* Advanced Search Bar (Standard) */}
        <motion.form
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, type: "spring", stiffness: 100 }}
          onSubmit={handleSearch}
          className="glass mx-auto max-w-[860px] p-2 rounded-[24px] flex flex-col md:flex-row items-stretch gap-2 shadow-2xl shadow-black/40 border border-white/20 bg-white/5 backdrop-blur-2xl relative overflow-visible z-50 mb-24 md:mb-16"
        >
          {/* Subtle moving gradient highlight behind search bar */}
          <motion.div
            animate={{ x: ["-100%", "200%"] }}
            transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent w-1/2 -skew-x-12 z-0 pointer-events-none rounded-[24px]"
          />

          <div className="relative z-10 flex-[2] flex items-center gap-4 px-4 py-3 border-b md:border-b-0 md:border-r border-white/10 group">
            <MapPin size={18} className="text-pink shrink-0 group-focus-within:animate-bounce" />
            <div className="text-left w-full relative">
              <span className="block text-[10px] font-bold text-pink uppercase tracking-widest mb-1">Điểm đến / Tên Tour</span>
              <input
                value={query}
                onChange={e => { setQuery(e.target.value); setShowSugg(true); }}
                onFocus={() => setShowSugg(true)}
                onBlur={() => setTimeout(() => setShowSugg(false), 200)}
                placeholder="Sa Pa, Hà Giang, Homestay..."
                className="bg-transparent border-none outline-none text-white text-sm w-full font-medium placeholder:text-white/40 focus:placeholder:text-white/20 transition-colors"
              />
              
              {/* Suggestions Dropdown */}
              <AnimatePresence>
                {showSugg && suggestions.length > 0 && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute top-[calc(100%+16px)] left-[-40px] right-0 bg-dark/95 backdrop-blur-xl border border-white/10 rounded-2xl p-2 shadow-2xl overflow-hidden z-[100]"
                  >
                    {suggestions.map((s, i) => (
                      <div 
                        key={i} 
                        onClick={() => selectSuggestion(s)}
                        className="px-4 py-3 hover:bg-white/10 rounded-xl cursor-pointer flex items-center gap-3 transition-colors text-white text-sm"
                      >
                        <Search size={14} className="text-pink opacity-70" />
                        {s}
                      </div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          <div className="relative z-10 flex-1 flex items-center gap-4 px-4 py-3 border-b md:border-b-0 md:border-r border-white/10 group">
            <Compass size={18} className="text-pink shrink-0 group-focus-within:animate-bounce" />
            <div className="text-left w-full">
              <span className="block text-[10px] font-bold text-pink uppercase tracking-widest mb-1">Loại hình</span>
              <select 
                value={type}
                onChange={e => setType(e.target.value)}
                className="bg-transparent border-none outline-none text-white text-sm w-full font-medium cursor-pointer appearance-none"
              >
                <option value="all" className="bg-dark text-white">Tất cả</option>
                <option value="destinations" className="bg-dark text-white">Điểm đến</option>
                <option value="tours" className="bg-dark text-white">Tours</option>
                <option value="homestays" className="bg-dark text-white">Homestays</option>
              </select>
            </div>
          </div>

          <div className="relative z-10 flex-1 flex items-center gap-4 px-4 py-3 group">
            <Calendar size={18} className="text-pink shrink-0 group-focus-within:animate-bounce" />
            <div className="text-left w-full">
              <span className="block text-[10px] font-bold text-pink uppercase tracking-widest mb-1">Ngày đi</span>
              <input
                type="date"
                className="bg-transparent border-none outline-none text-white text-sm w-full font-medium placeholder:text-white/40 focus:placeholder:text-white/20 transition-colors cursor-pointer"
                style={{ colorScheme: "dark" }}
              />
            </div>
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            className="relative z-10 bg-gradient-to-r from-pink to-amber text-midnight font-bold px-8 py-4 rounded-2xl flex items-center justify-center gap-2 border-none cursor-pointer shadow-lg shadow-pink/20 hover:shadow-pink/40 transition-shadow"
          >
            <Search size={20} />
            Tìm Kiếm
          </motion.button>
        </motion.form>
      </div>

      {/* Footer Area with Scroll Hint only */}
      <div className="relative z-20 mt-auto pb-6 flex flex-col items-center">
        {/* Scroll Hint */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.5, duration: 1 }}
          className="opacity-60 flex flex-col items-center gap-3 pointer-events-none"
        >
          <span className="text-[10px] uppercase tracking-[0.3em] font-bold text-white/80">Cuộn xuống</span>
          <div className="h-[30px] flex items-start justify-center">
            <motion.div
              animate={{ height: ["15px", "30px", "15px"] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              className="w-px bg-gradient-to-b from-pink to-transparent"
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
