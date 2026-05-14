"use client";
import { useState, useEffect, Suspense } from "react";
import { useQuery } from "@tanstack/react-query";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { 
  Users, 
  Star, 
  Search, 
  ChevronRight,
  Home,
  MapPin,
  ArrowUpRight,
  Sparkles
} from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { homestaysApi } from "@/lib/api";

function HomestaysContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [maxGuests, setMaxGuests] = useState(searchParams.get("maxGuests") || "");
  const [priceMax, setPriceMax] = useState(searchParams.get("priceMax") || "");
  const [page, setPage] = useState(Number(searchParams.get("page")) || 1);

  // Sync state to URL without reloading page
  useEffect(() => {
    const params = new URLSearchParams();
    if (search) params.set("search", search);
    if (maxGuests) params.set("maxGuests", maxGuests);
    if (priceMax) params.set("priceMax", priceMax);
    if (page > 1) params.set("page", String(page));
    
    router.replace(`?${params.toString()}`, { scroll: false });
  }, [search, maxGuests, priceMax, page, router]);

  const { data, isLoading } = useQuery({
    queryKey: ["homestays", { search, maxGuests, priceMax, page }],
    queryFn: () =>
      homestaysApi.getAll({
        search: search || undefined,
        maxGuests: maxGuests || undefined,
        priceMax: priceMax || undefined,
        page,
        limit: 12,
      }).then(r => r.data),
  });

  const homestays = data?.data || [];
  const pagination = data?.pagination;

  return (
    <>
      <Navbar />
      <main className="pt-[70px]">
        {/* Header */}
        <div className="bg-gradient-to-br from-amber/10 to-pink/5 border-b border-white/5 py-20 px-6 text-center animate-fade-up">
          <div className="inline-flex items-center gap-2 text-xs font-bold text-amber uppercase tracking-widest bg-amber/10 px-4 py-2 rounded-full mb-6">
            <Home size={14} /> Homestay Bản Địa
          </div>
          <h1 className="font-serif text-[clamp(36px,5vw,64px)] font-black mb-4 leading-tight">
            Nghỉ Đêm <span className="text-gradient-amber">Bản Làng</span>
          </h1>
          <p className="text-white/50 text-lg max-w-lg mx-auto">
            {pagination?.total || 0} homestay chân thực mang hơi thở núi rừng.
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
                placeholder="Tìm tên homestay hoặc khu vực..." 
                className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-sm text-white outline-none focus:border-amber/50 transition-all"
              />
            </div>

            <div className="flex gap-4">
              <select value={maxGuests} onChange={e => { setMaxGuests(e.target.value); setPage(1); }} className="bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-sm text-white outline-none cursor-pointer focus:border-amber/50 appearance-none">
                <option value="">Số khách</option>
                {[2, 4, 6, 8, 10].map(n => <option key={n} value={n} className="bg-midnight">Tối thiểu {n} khách</option>)}
              </select>

              <select value={priceMax} onChange={e => { setPriceMax(e.target.value); setPage(1); }} className="bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-sm text-white outline-none cursor-pointer focus:border-amber/50 appearance-none">
                <option value="">Giá/đêm</option>
                <option value="500000" className="bg-midnight">Dưới 500k</option>
                <option value="1000000" className="bg-midnight">Dưới 1 triệu</option>
                <option value="2000000" className="bg-midnight">Dưới 2 triệu</option>
              </select>
            </div>
          </div>

          {/* Homestay Grid */}
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(6)].map((_, i) => <div key={i} className="skeleton h-[400px] rounded-[32px]" />)}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {homestays.map((hs: any) => (
                <Link key={hs.id} href={`/homestays/${hs.id}`} className="no-underline group">
                  <div className="glass rounded-[32px] overflow-hidden h-full border-white/10 hover:border-amber/30 hover:scale-[1.02] transition-all">
                    {/* Thumbnail */}
                    <div className="relative h-60 overflow-hidden">
                      <img 
                        src={hs.coverImage || '/placeholder.jpg'} 
                        alt={hs.name} 
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-midnight/80 via-transparent to-transparent" />
                      {hs.featured && (
                        <div className="absolute top-6 left-6">
                          <span className="bg-amber/20 backdrop-blur-md border border-amber/40 text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full text-amber flex items-center gap-1">
                            <Sparkles size={10} /> Ưu tiên
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Content */}
                    <div className="p-8">
                      <div className="flex items-center gap-2 text-[10px] font-bold text-amber uppercase tracking-widest mb-3">
                        <MapPin size={12} /> {hs.destination?.nameVi}, {hs.destination?.province}
                      </div>
                      
                      <h3 className="font-serif text-xl font-bold text-white mb-4 leading-snug group-hover:text-amber transition-colors line-clamp-1">{hs.name}</h3>
                      
                      <div className="flex items-center gap-6 mb-8 text-white/40 text-xs font-bold">
                        <span className="flex items-center gap-1.5"><Users size={14} className="text-amber" /> {hs.maxGuests} khách</span>
                        {hs._count?.reviews > 0 && (
                          <span className="flex items-center gap-1.5"><Star size={14} className="text-amber fill-amber" /> {hs._count.reviews}</span>
                        )}
                      </div>

                      <div className="flex justify-between items-end pt-6 border-t border-white/5">
                        <div>
                          <div className="text-[10px] font-bold text-white/30 uppercase tracking-widest mb-1">Giá từ</div>
                          <div className="text-2xl font-black text-white">
                            {Number(hs.pricePerNight).toLocaleString("vi-VN")}₫
                          </div>
                          <div className="text-[10px] text-white/30">/ đêm</div>
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

export default function HomestaysPage() {
  return (
    <Suspense fallback={<div className="pt-[70px] min-h-screen text-center flex items-center justify-center text-white/40">Loading...</div>}>
      <HomestaysContent />
    </Suspense>
  );
}
