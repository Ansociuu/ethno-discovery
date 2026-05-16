"use client";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { ChevronRight, MapPin } from "lucide-react";
import { homestaysApi } from "@/lib/api";
import { motion, Variants } from "framer-motion";

interface Homestay {
  id: number;
  name: string;
  coverImage?: string;
  pricePerNight: string | number;
  maxGuests: number;
  featured: boolean;
  amenities?: string[];
  destination?: { nameVi: string; province: string };
}

const FALLBACK_GRADIENTS = [
  "linear-gradient(160deg, var(--dark), var(--pink))",
  "linear-gradient(160deg, var(--midnight), var(--amber))",
  "linear-gradient(160deg, var(--bg3), var(--pink))",
];

const TAGS = [
  { label: "⭐ Superhost", bg: "bg-amber/90", color: "text-black" },
  { label: "🌟 Featured",  bg: "bg-amber/90", color: "text-black" },
  { label: "🏡 Authentic", bg: "bg-pink/90", color: "text-white" },
];

// Mountain terrain SVG decoration
function HomestayTerrain() {
  return (
    <svg className="absolute bottom-0 left-0 w-full h-1/2 opacity-20 pointer-events-none" viewBox="0 0 300 150" preserveAspectRatio="none">
      <path d="M0 150 L0 80 Q40 50 80 70 Q120 90 150 40 Q180 0 210 30 Q240 60 300 20 L300 150Z" fill="rgba(255,255,255,0.3)" />
    </svg>
  );
}

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15 }
  }
};

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100, damping: 20 } }
};

export function FeaturedHomestays() {
  const { data, isLoading } = useQuery({
    queryKey: ["homestays", "featured"],
    queryFn: () => homestaysApi.getFeatured().then(r => r.data.data as Homestay[]),
  });

  const homestays = data?.slice(0, 3) || [];

  return (
    <section className="section-py px-container max-w-[1280px] mx-auto overflow-hidden">
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        className="flex flex-col md:flex-row justify-between items-start md:items-end mb-14 gap-6"
      >
        <div>
          <span className="section-tag mb-4">Stay with Locals</span>
          <h2 className="h2-fluid mb-3">
            Homestay <em className="text-amber not-italic relative inline-block">sang trọng<span className="absolute -bottom-2 left-0 w-full h-1 bg-amber/30 rounded-full blur-[2px]"></span></em>
          </h2>
          <p className="p-fluid text-text font-light max-w-[500px]">
            Ngủ trong lòng bản làng — thức dậy giữa sương mây.
          </p>
        </div>
        <Link href="/homestays" className="btn-ghost py-3 px-6 text-sm whitespace-nowrap group">
          Xem tất cả <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
        </Link>
      </motion.div>

      {/* Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[...Array(3)].map((_, i) => <div key={i} className="skeleton h-[380px] rounded-[20px]" />)}
        </div>
      ) : (
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          {homestays.map((hs, i) => (
            <motion.div key={hs.id} variants={cardVariants} className="h-full">
              <Link href={`/homestays/${hs.id}`} className="block h-full group outline-none">
                <div className="bg-white/5 border border-white/10 rounded-[20px] overflow-hidden transition-all duration-300 group-hover:scale-[1.02] group-hover:border-pink/40 group-hover:shadow-[0_24px_60px_rgba(255,60,172,0.15)] group-focus-visible:ring-2 ring-pink h-full flex flex-col">
                  
                  {/* Image area */}
                  <div className="h-[220px] relative overflow-hidden">
                    {hs.coverImage ? (
                      <img 
                        src={hs.coverImage} 
                        alt={hs.name} 
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                      />
                    ) : (
                      <div className="w-full h-full" style={{ background: FALLBACK_GRADIENTS[i % FALLBACK_GRADIENTS.length] }} />
                    )}
                    <HomestayTerrain />
                    
                    {/* Dark overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-midnight via-black/20 to-transparent opacity-80 group-hover:opacity-100 transition-opacity" />
                    
                    {/* Tag */}
                    <div className={`absolute top-4 left-4 ${TAGS[i % TAGS.length].bg} ${TAGS[i % TAGS.length].color} text-[11px] font-bold px-3 py-1.5 rounded-full tracking-wide shadow-lg`}>
                      {TAGS[i % TAGS.length].label}
                    </div>
                  </div>

                  {/* Body */}
                  <div className="p-6 flex-1 flex flex-col relative bg-gradient-to-b from-transparent to-midnight/50">
                    <h3 className="font-serif text-[20px] font-bold mb-2 text-white group-hover:text-amber transition-colors line-clamp-1">
                      {hs.name}
                    </h3>
                    
                    <div className="text-[13px] text-white/50 mb-4 flex items-center gap-1.5 font-medium">
                      <MapPin size={14} className="text-pink" /> 
                      {hs.destination?.nameVi}, {hs.destination?.province}
                    </div>

                    {/* Amenities */}
                    <div className="flex gap-2 mb-6 flex-wrap">
                      {(() => {
                        let amenities: string[] = [];
                        if (Array.isArray(hs.amenities)) amenities = hs.amenities;
                        else if (typeof hs.amenities === "string") {
                          try { amenities = JSON.parse(hs.amenities); } catch { amenities = []; }
                        }
                        const fallback = ["🔥 Fireplace", "🏔️ Mountain view", "🍳 Breakfast"];
                        return (amenities.length > 0 ? amenities : fallback).slice(0, 3).map((a: string) => (
                          <span key={a} className="text-[12px] text-white/60 bg-white/5 border border-white/5 px-2.5 py-1 rounded-md backdrop-blur-sm">
                            {a}
                          </span>
                        ));
                      })()}
                    </div>

                    {/* Footer */}
                    <div className="mt-auto pt-4 border-t border-white/10 flex items-center justify-between">
                      <div>
                        <span className="text-[22px] font-bold text-amber">
                          {Number(hs.pricePerNight).toLocaleString("vi-VN")}₫
                        </span>
                        <span className="text-[13px] text-white/40 font-medium ml-1">/đêm</span>
                      </div>
                      <div className="border border-pink/40 text-pink px-4 py-2 rounded-full text-[13px] font-bold group-hover:bg-pink group-hover:text-white transition-colors">
                        Book Now
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      )}
    </section>
  );
}
