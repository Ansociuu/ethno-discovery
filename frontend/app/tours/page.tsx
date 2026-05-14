"use client";
import { useState, useEffect, Suspense } from "react";
import { useQuery } from "@tanstack/react-query";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { 
  Clock, 
  Users, 
  Star, 
  Search, 
  ChevronRight,
  Compass,
  MapPin,
  Sparkles,
  ArrowUpRight
} from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { toursApi } from "@/lib/api";

function ToursContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [duration, setDuration] = useState(searchParams.get("duration") || "");
  const [priceMax, setPriceMax] = useState(searchParams.get("priceMax") || "");
  const [sortBy, setSortBy] = useState(searchParams.get("sortBy") || "featured");
  const [page, setPage] = useState(Number(searchParams.get("page")) || 1);

  // Sync state to URL without reloading page
  useEffect(() => {
    const params = new URLSearchParams();
    if (search) params.set("search", search);
    if (duration) params.set("duration", duration);
    if (priceMax) params.set("priceMax", priceMax);
    if (sortBy !== "featured") params.set("sortBy", sortBy);
    if (page > 1) params.set("page", String(page));
    
    router.replace(`?${params.toString()}`, { scroll: false });
  }, [search, duration, priceMax, sortBy, page, router]);

  const { data, isLoading } = useQuery({
    queryKey: ["tours", { search, duration, priceMax, sortBy, page }],
    queryFn: () =>
      toursApi.getAll({
        search: search || undefined,
        duration: duration || undefined,
        priceMax: priceMax || undefined,
        sortBy,
        page,
        limit: 12,
      }).then(r => r.data),
  });

  const tours = data?.data || [];
  const pagination = data?.pagination;

  return (
    <>
      <Navbar />
      <main className="pt-[70px]">
        {/* Header */}
        <div className="bg-gradient-to-br from-amber/10 to-pink/5 border-b border-white/5 py-20 px-6 text-center animate-fade-up">
          <div className="inline-flex items-center gap-2 text-xs font-bold text-amber uppercase tracking-widest bg-amber/10 px-4 py-2 rounded-full mb-6">
            <Compass size={14} /> Tours Văn Hoá
          </div>
          <h1 className="font-serif text-[clamp(36px,5vw,64px)] font-black mb-4 leading-tight">
            Hành Trình <span className="text-gradient-amber">Đáng Nhớ</span>
          </h1>
          <p className="text-white/50 text-lg max-w-lg mx-auto">
            {pagination?.total || 0} trải nghiệm độc bản đang chờ bạn.
          </p>
        </div>

        <div className="max-w-7xl mx-auto px-6 py-12">
          {/* Advanced Filters */}
          <div className="flex flex-wrap items-center gap-4 mb-12">
            <div className="relative flex-1 min-w-[280px]">
              <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" />
              <input
                value={search}
                onChange={e => { setSearch(e.target.value); setPage(1); }}
                placeholder="Tìm kiếm tour..."
                className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-sm text-white outline-none focus:border-pink/50 transition-all"
              />
            </div>

            <div className="flex gap-4">
              <select value={duration} onChange={e => { setDuration(e.target.value); setPage(1); }} className="bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-sm text-white outline-none cursor-pointer focus:border-pink/50 appearance-none">
                <option value="">Thời gian</option>
                {[2, 3, 4, 5, 6, 7].map(d => <option key={d} value={d} className="bg-midnight">{d} ngày</option>)}
              </select>

              <select value={priceMax} onChange={e => { setPriceMax(e.target.value); setPage(1); }} className="bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-sm text-white outline-none cursor-pointer focus:border-pink/50 appearance-none">
                <option value="">Mức giá</option>
                <option value="2000000" className="bg-midnight">Dưới 2 triệu</option>
                <option value="5000000" className="bg-midnight">Dưới 5 triệu</option>
                <option value="10000000" className="bg-midnight">Dưới 10 triệu</option>
              </select>

              <select value={sortBy} onChange={e => setSortBy(e.target.value)} className="bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-sm text-white outline-none cursor-pointer focus:border-pink/50 appearance-none">
                <option value="featured" className="bg-midnight">Nổi bật</option>
                <option value="price_asc" className="bg-midnight">Giá thấp → cao</option>
                <option value="price_desc" className="bg-midnight">Giá cao → thấp</option>
              </select>
            </div>
          </div>

          {/* Tour Grid */}
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(6)].map((_, i) => <div key={i} className="skeleton h-[450px] rounded-[32px]" />)}
            </div>
          ) : tours.length === 0 ? (
            <div className="text-center py-24 animate-fade-up">
              <Compass size={64} className="mx-auto text-white/10 mb-6" />
              <h3 className="text-xl font-bold mb-2">Không có tour phù hợp</h3>
              <p className="text-white/40">Hãy thử tìm kiếm với từ khóa khác.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {tours.map((tour: any) => (
                <Link key={tour.id} href={`/tours/${tour.id}`} className="no-underline group">
                  <div className="glass rounded-[32px] overflow-hidden h-full border-white/10 hover:border-amber/30 hover:scale-[1.02] transition-all">
                    {/* Thumbnail */}
                    <div className="relative h-60 overflow-hidden">
                      <img 
                        src={tour.coverImage || '/placeholder.jpg'} 
                        alt={tour.title} 
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-midnight/80 via-transparent to-transparent" />
                      {tour.featured && (
                        <div className="absolute top-6 left-6">
                          <span className="bg-amber/20 backdrop-blur-md border border-amber/40 text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full text-amber flex items-center gap-1">
                            <Sparkles size={10} /> Nổi bật
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Content */}
                    <div className="p-8">
                      <div className="flex items-center gap-2 text-[10px] font-bold text-pink uppercase tracking-widest mb-3">
                        <MapPin size={12} /> {tour.destination?.nameVi}, {tour.destination?.province}
                      </div>
                      
                      <h3 className="font-serif text-xl font-bold text-white mb-4 leading-snug group-hover:text-amber transition-colors line-clamp-2">{tour.title}</h3>
                      
                      <div className="flex items-center gap-6 mb-8 text-white/40 text-xs font-bold">
                        <span className="flex items-center gap-1.5"><Clock size={14} className="text-amber" /> {tour.durationDays} ngày</span>
                        <span className="flex items-center gap-1.5"><Users size={14} className="text-amber" /> {tour.maxGroupSize} người</span>
                        {tour._count?.reviews > 0 && (
                          <span className="flex items-center gap-1.5"><Star size={14} className="text-amber fill-amber" /> {tour._count.reviews}</span>
                        )}
                      </div>

                      <div className="flex justify-between items-end pt-6 border-t border-white/5">
                        <div>
                          <div className="text-[10px] font-bold text-white/30 uppercase tracking-widest mb-1">Giá từ</div>
                          <div className="text-2xl font-black text-white">
                            {Number(tour.pricePerPerson).toLocaleString("vi-VN")}₫
                          </div>
                          <div className="text-[10px] text-white/30">/ người</div>
                        </div>
                        <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-white group-hover:bg-amber group-hover:text-midnight transition-all">
                          <ArrowUpRight size={20} />
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}

          {/* Pagination */}
          {pagination && pagination.totalPages > 1 && (
            <div className="flex justify-center gap-3 mt-16">
              {[...Array(pagination.totalPages)].map((_, i) => (
                <button 
                  key={i} 
                  onClick={() => setPage(i + 1)}
                  className={`w-12 h-12 rounded-2xl font-bold text-sm transition-all border ${
                    page === i + 1 ? "bg-amber border-amber text-midnight shadow-lg shadow-amber/20" : "bg-white/5 border-white/10 text-white/50 hover:bg-white/10"
                  }`}
                >
                  {i + 1}
                </button>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}

export default function ToursPage() {
  return (
    <Suspense fallback={<div className="pt-[70px] min-h-screen text-center flex items-center justify-center text-white/40">Loading...</div>}>
      <ToursContent />
    </Suspense>
  );
}
