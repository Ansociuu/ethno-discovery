"use client";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { destinationsApi } from "@/lib/api";
import { motion } from "framer-motion";

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
    <svg className="absolute bottom-0 left-0 w-full h-[60%] opacity-25 pointer-events-none" viewBox="0 0 400 200" preserveAspectRatio="none">
      <path d="M0 200 L0 120 Q50 80 100 100 Q150 120 200 60 Q230 30 260 50 Q290 70 320 40 Q360 10 400 50 L400 200Z" fill="rgba(255,255,255,0.08)" />
      <path d="M0 200 L0 150 Q80 110 160 140 Q240 170 320 120 Q360 100 400 130 L400 200Z" fill="rgba(255,255,255,0.05)" />
    </svg>
  );
  if (variant === "tall") return (
    <svg className="absolute bottom-0 left-0 w-full h-[60%] opacity-25 pointer-events-none" viewBox="0 0 200 300" preserveAspectRatio="none">
      <path d="M0 300 L0 180 Q50 130 100 160 Q150 190 200 120 L200 300Z" fill="rgba(255,255,255,0.08)" />
      <path d="M0 300 L0 230 Q80 200 160 220 Q180 228 200 210 L200 300Z" fill="rgba(255,255,255,0.05)" />
    </svg>
  );
  return (
    <svg className="absolute bottom-0 left-0 w-full h-[60%] opacity-25 pointer-events-none" viewBox="0 0 200 200" preserveAspectRatio="none">
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

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15 }
  }
};

const cardVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100, damping: 20 } }
};

export function FeaturedDestinations() {
  const { data, isLoading } = useQuery({
    queryKey: ["destinations", "featured"],
    queryFn: () => destinationsApi.getFeatured().then((r) => r.data.data as Destination[]),
  });

  const destinations = data || [];

  return (
    <section className="py-[100px] px-6 md:px-10 max-w-[1280px] mx-auto overflow-hidden">
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        className="mb-4"
      >
        <span className="section-tag">Popular Destinations</span>
      </motion.div>
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ delay: 0.1 }}
        className="flex flex-col md:flex-row justify-between items-start md:items-end mb-14 gap-6"
      >
        <div>
          <h2 className="font-serif text-[clamp(32px,4vw,52px)] font-bold leading-[1.1] mb-3">
            Vùng cao <em className="text-pink not-italic relative inline-block">huyền ảo<span className="absolute -bottom-2 left-0 w-full h-1 bg-pink/30 rounded-full blur-[2px]"></span></em>
          </h2>
          <p className="text-text text-[17px] font-light max-w-[500px] leading-relaxed">
            Từng bản làng là một câu chuyện chờ bạn khám phá.
          </p>
        </div>
        <Link href="/destinations" className="btn-ghost py-3 px-6 text-sm whitespace-nowrap group">
          Xem tất cả <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
        </Link>
      </motion.div>

      {/* Bento Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 auto-rows-[200px]">
          {[...Array(4)].map((_, i) => (
            <div 
              key={i} 
              className={`skeleton rounded-3xl ${i === 0 ? "md:col-span-2 md:row-span-2" : "col-span-1"}`} 
              style={{ height: "100%" }} 
            />
          ))}
        </div>
      ) : (
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 auto-rows-[200px] md:auto-rows-[220px] gap-4 lg:gap-6 bento-grid-mobile"
        >
          {destinations.map((dest, i) => {
            const isLarge = i === 0;  // span 2 cols + 2 rows
            const isTall = i === 3;   // span 1 col + 2 rows
            const variant = isLarge ? "large" : isTall ? "tall" : "small";

            return (
              <motion.div
                key={dest.id}
                variants={cardVariants}
                whileHover={{ y: -8, scale: 1.02 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className={`relative rounded-3xl overflow-hidden cursor-pointer shadow-lg shadow-black/30 group ${isLarge ? "md:col-span-2 md:row-span-2" : "col-span-1"} ${isTall ? "md:row-span-2" : ""}`}
              >
                <Link href={`/destinations/${dest.slug}`} className="absolute inset-0 z-20" aria-label={dest.nameVi} />
                
                {/* Background image or gradient */}
                <div className="absolute inset-0" style={{ background: FALLBACK_GRADIENTS[i % FALLBACK_GRADIENTS.length] }}>
                  {dest.coverImage && (
                    <img 
                      src={dest.coverImage} 
                      alt={dest.nameVi} 
                      className="w-full h-full object-cover absolute inset-0 transition-transform duration-700 group-hover:scale-110" 
                    />
                  )}
                </div>

                {/* Terrain SVG */}
                <CardTerrain variant={variant} />

                {/* Dark overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent group-hover:from-black/95 transition-colors" />

                {/* Badge */}
                {i === 0 && (
                  <div className="absolute top-4 right-4 bg-pink/90 backdrop-blur-md px-3 py-1.5 rounded-full text-xs font-bold text-white shadow-lg shadow-pink/30 z-10">
                    🏆 #1 Pick
                  </div>
                )}
                {i === 3 && (
                  <div className="absolute top-4 right-4 bg-amber/90 backdrop-blur-md px-3 py-1.5 rounded-full text-xs font-bold text-black shadow-lg shadow-amber/30 z-10">
                    🌾 Harvest Season
                  </div>
                )}

                {/* Card Info */}
                <div className="absolute bottom-0 left-0 right-0 p-5 md:p-6 z-10 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                  <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center text-xl mb-3 border border-white/10 group-hover:bg-white/30 transition-colors">
                    {CARD_ICONS[i]}
                  </div>
                  <div className={`font-serif font-bold text-white mb-1 group-hover:text-amber transition-colors ${isLarge ? "text-3xl" : "text-xl md:text-2xl"}`}>
                    {dest.nameVi}
                  </div>
                  <div className="text-xs text-white/70 mb-3 font-medium tracking-wide">
                    {dest.province}
                  </div>
                  
                  <div className="flex items-center gap-3 flex-wrap opacity-80 group-hover:opacity-100 transition-opacity">
                    <span className="flex items-center gap-1 text-xs font-medium bg-black/40 px-2 py-1 rounded-md backdrop-blur-sm border border-white/5">
                      <span className="text-amber">★</span> 4.{8 + i % 2} ({200 + i * 312})
                    </span>
                    <span className="text-xs text-white/70">
                      from <strong className="text-amber text-[15px]">{(65 + i * 25).toLocaleString()}$</strong>/người
                    </span>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      )}
    </section>
  );
}
