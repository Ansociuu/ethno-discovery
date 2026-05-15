"use client";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { Clock, Users, ChevronRight, Star } from "lucide-react";
import { toursApi } from "@/lib/api";
import { motion, Variants } from "framer-motion";

interface Tour {
  id: number;
  title: string;
  slug: string;
  durationDays: number;
  pricePerPerson: string | number;
  coverImage?: string;
  maxGroupSize: number;
  featured: boolean;
  destination: { nameVi: string; province: string };
  _count: { reviews: number };
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

export function FeaturedTours() {
  const { data, isLoading } = useQuery({
    queryKey: ["tours", "featured"],
    queryFn: () => toursApi.getFeatured().then((r) => r.data.data as Tour[]),
  });

  const tours = data?.slice(0, 4) || [];

  return (
    <section className="py-[100px] px-6 md:px-10 max-w-[1280px] mx-auto overflow-hidden">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        className="flex flex-col md:flex-row justify-between items-start md:items-end mb-14 gap-6"
      >
        <div>
          <span className="section-tag mb-4">🗺 Tours Văn Hoá</span>
          <h2 className="font-serif text-[clamp(32px,4vw,52px)] font-bold leading-[1.1] mb-3">
            Hành Trình <span className="text-gradient-amber">Đáng Nhớ</span>
          </h2>
          <p className="text-text text-[17px] font-light max-w-[500px] leading-relaxed">
            Những tour được thiết kế tỉ mỉ, kết hợp thiên nhiên hùng vĩ và văn hoá bản địa chân thực.
          </p>
        </div>
        <Link href="/tours" className="btn-ghost py-3 px-6 text-sm whitespace-nowrap group">
          Xem tất cả <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
        </Link>
      </motion.div>

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="skeleton h-[380px] rounded-[20px]" />
          ))}
        </div>
      ) : (
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {tours.map((tour) => (
            <TourCard key={tour.id} tour={tour} />
          ))}
        </motion.div>
      )}
    </section>
  );
}

function TourCard({ tour }: { tour: Tour }) {
  const price = Number(tour.pricePerPerson);

  return (
    <motion.div variants={cardVariants} className="h-full">
      <Link href={`/tours/${tour.id}`} className="block h-full group outline-none">
        <div className="card h-full flex flex-col group-focus-visible:ring-2 ring-pink">
          
          {/* Image */}
          <div className="relative h-[220px] overflow-hidden rounded-t-[20px]">
            {tour.coverImage ? (
              <img 
                src={tour.coverImage} 
                alt={tour.title} 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-midnight to-pink" />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80 group-hover:opacity-100 transition-opacity" />
            
            {tour.featured && (
              <div className="absolute top-3 left-3 badge badge-pink shadow-lg shadow-pink/20">
                ✦ Nổi bật
              </div>
            )}
          </div>

          {/* Content */}
          <div className="p-5 flex-1 flex flex-col bg-glass relative">
            <p className="text-xs text-pink mb-2 flex items-center gap-1 font-medium">
              📍 {tour.destination.nameVi}, {tour.destination.province}
            </p>
            <h3 className="font-serif text-[18px] font-bold text-white mb-3 leading-snug group-hover:text-amber transition-colors line-clamp-2">
              {tour.title}
            </h3>

            <div className="flex flex-wrap gap-x-4 gap-y-2 mb-4 text-[13px] text-white/60">
              <span className="flex items-center gap-1.5"><Clock size={14} className="text-white/40" /> {tour.durationDays} ngày</span>
              <span className="flex items-center gap-1.5"><Users size={14} className="text-white/40" /> Tối đa {tour.maxGroupSize}</span>
              {tour._count.reviews > 0 && (
                <span className="flex items-center gap-1.5"><Star size={14} className="text-amber" fill="currentColor" /> {tour._count.reviews} đánh giá</span>
              )}
            </div>

            <div className="mt-auto pt-4 border-t border-white/5 flex justify-between items-center">
              <div>
                <span className="text-[11px] text-white/50 uppercase tracking-wider block mb-0.5">Từ</span>
                <div className="text-[20px] font-bold text-amber">
                  {price.toLocaleString("vi-VN")}₫
                </div>
                <span className="text-[11px] text-white/50 block -mt-1">/người</span>
              </div>
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="btn-primary py-2.5 px-5 text-sm shadow-lg shadow-pink/20"
              >
                Đặt ngay
              </motion.button>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
