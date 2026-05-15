"use client";
import { useState, useEffect, Suspense } from "react";
import { useQuery } from "@tanstack/react-query";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { 
  MapPin, 
  Mountain, 
  Search,
  Map,
  Compass,
  Home,
  Calendar
} from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { destinationsApi } from "@/lib/api";

const DIFFICULTIES = ["", "EASY", "MODERATE", "HARD", "EXPERT"];
const DIFFICULTY_LABELS: Record<string, string> = { "": "Tất cả", EASY: "Nghỉ dưỡng", MODERATE: "Trải nghiệm", HARD: "Chinh phục", EXPERT: "Mạo hiểm" };
const PROVINCES = ["", "Hà Giang", "Lào Cai", "Sơn La", "Lai Châu", "Điện Biên", "Yên Bái"];

function DestinationsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [difficulty, setDifficulty] = useState(searchParams.get("difficulty") || "");
  const [province, setProvince] = useState(searchParams.get("province") || "");
  const [page, setPage] = useState(Number(searchParams.get("page")) || 1);

  // Sync state to URL without reloading page
  useEffect(() => {
    const params = new URLSearchParams();
    if (search) params.set("search", search);
    if (difficulty) params.set("difficulty", difficulty);
    if (province) params.set("province", province);
    if (page > 1) params.set("page", String(page));
    
    router.replace(`?${params.toString()}`, { scroll: false });
  }, [search, difficulty, province, page, router]);

  const { data, isLoading } = useQuery({
    queryKey: ["destinations", { search, difficulty, province, page }],
    queryFn: () =>
      destinationsApi.getAll({ search: search || undefined, difficulty: difficulty || undefined, province: province || undefined, page, limit: 12 })
        .then(r => r.data),
  });

  const destinations = data?.data || [];
  const pagination = data?.pagination;

  return (
    <>
      <Navbar />
      <main className="pt-[70px]">
        {/* Page Header */}
        <div className="bg-gradient-to-br from-pink/10 to-amber/5 border-b border-white/5 py-20 px-6 text-center animate-fade-up">
          <div className="inline-flex items-center gap-2 text-xs font-bold text-pink uppercase tracking-widest bg-pink/10 px-4 py-2 rounded-full mb-6">
            <Mountain size={14} /> Điểm Đến
          </div>
          <h1 className="font-serif text-[clamp(36px,5vw,64px)] font-black mb-4 leading-tight">
            Khám Phá <span className="text-gradient-pink">Vùng Cao</span>
          </h1>
          <p className="text-white/50 text-lg max-w-lg mx-auto">
            {pagination?.total || 0} vùng đất kỳ vĩ đang chờ bạn chinh phục.
          </p>
        </div>

        <div className="max-w-7xl mx-auto px-6 py-12">
          {/* Advanced Filters Upgrade */}
          <div className="glass rounded-[32px] p-1.5 mb-16 border-white/10 shadow-2xl shadow-black/40 overflow-hidden">
            <div className="flex flex-col lg:flex-row lg:items-center gap-2">
              
              {/* Search Section */}
              <div className="flex-[2] relative group">
                <Search size={18} className="absolute left-6 top-1/2 -translate-y-1/2 text-pink transition-transform group-focus-within:scale-110" />
                <input
                  value={search}
                  onChange={e => { setSearch(e.target.value); setPage(1); }}
                  placeholder="Tìm kiếm địa danh (ví dụ: Sapa, Đồng Văn...)"
                  className="w-full bg-transparent border-none outline-none py-3.5 pl-16 pr-6 text-sm text-white font-medium placeholder:text-white/20"
                />
              </div>

              {/* Vertical Divider (Desktop) */}
              <div className="hidden lg:block w-px h-8 bg-white/10 mx-2" />

              {/* Province Section */}
              <div className="flex-1 relative group px-2">
                <div className="flex items-center gap-3 w-full bg-white/5 lg:bg-transparent rounded-2xl lg:rounded-none px-4 lg:px-2">
                  <MapPin size={16} className="text-amber" />
                  <select
                    value={province}
                    onChange={e => { setProvince(e.target.value); setPage(1); }}
                    className="flex-1 bg-transparent border-none outline-none py-3.5 text-sm text-white font-medium cursor-pointer appearance-none"
                  >
                    {PROVINCES.map(p => <option key={p} value={p} className="bg-dark text-white">{p || "Tất cả tỉnh"}</option>)}
                  </select>
                </div>
              </div>

              {/* Difficulty Section */}
              <div className="flex-[2] bg-white/5 lg:bg-white/10 lg:backdrop-blur-xl rounded-[24px] p-1.5 flex items-center gap-1 overflow-x-auto no-scrollbar">
                {DIFFICULTIES.map(d => (
                  <button
                    key={d}
                    onClick={() => { setDifficulty(d); setPage(1); }}
                    className={`whitespace-nowrap px-4 py-2.5 rounded-[18px] text-[10px] font-black uppercase tracking-widest transition-all duration-300 flex-1 min-w-fit ${
                      difficulty === d 
                        ? "bg-gradient-to-r from-pink to-amber text-midnight shadow-lg shadow-pink/20" 
                        : "text-white/40 hover:text-white hover:bg-white/5"
                    }`}
                  >
                    {DIFFICULTY_LABELS[d]}
                  </button>
                ))}
              </div>

            </div>
          </div>

          {/* Destination Grid */}
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(6)].map((_, i) => <div key={i} className="skeleton h-[400px] rounded-[32px]" />)}
            </div>
          ) : destinations.length === 0 ? (
            <div className="text-center py-24 animate-fade-up">
              <Map size={64} className="mx-auto text-white/10 mb-6" />
              <h3 className="text-xl font-bold mb-2">Không tìm thấy kết quả</h3>
              <p className="text-white/40">Hãy thử điều chỉnh lại bộ lọc tìm kiếm.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {destinations.map((dest: any) => (
                <Link key={dest.id} href={`/destinations/${dest.slug}`} className="no-underline group">
                  <div className="glass rounded-[32px] overflow-hidden h-full border-white/10 hover:border-pink/30 hover:scale-[1.02] transition-all">
                    {/* Thumbnail */}
                    <div className="relative h-64 overflow-hidden">
                      <img 
                        src={dest.coverImage || '/images/ha-giang-mountains.png'} 
                        alt={dest.nameVi} 
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-midnight via-transparent to-transparent" />
                      <div className="absolute top-6 right-6">
                        <span className="bg-white/10 backdrop-blur-md border border-white/20 text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full text-white">
                          {DIFFICULTY_LABELS[dest.difficulty]}
                        </span>
                      </div>
                    </div>

                    {/* Meta */}
                    <div className="p-8">
                      <div className="flex items-center gap-4 text-xs font-bold text-white/40 mb-4">
                        <span className="flex items-center gap-1.5"><MapPin size={14} className="text-pink" /> {dest.province}</span>
                        {dest.altitude && <span className="flex items-center gap-1.5"><Mountain size={14} className="text-pink" /> {dest.altitude}m</span>}
                      </div>
                      
                      <h3 className="font-serif text-2xl font-bold text-white mb-4 group-hover:text-pink transition-colors">{dest.nameVi}</h3>
                      
                      {dest.bestSeason && (
                        <div className="flex items-center gap-2 text-xs text-white/50 mb-6 bg-white/5 w-fit px-3 py-1.5 rounded-lg border border-white/5">
                          <Calendar size={14} className="text-amber" />
                          {dest.bestSeason}
                        </div>
                      )}

                      <div className="flex gap-3 pt-4 border-t border-white/5">
                        <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-wider text-pink">
                          <Compass size={14} /> {dest._count?.tours || 0} Tours
                        </div>
                        <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-wider text-amber">
                          <Home size={14} /> {dest._count?.homestays || 0} Homestays
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
                    page === i + 1 ? "bg-pink border-pink text-white shadow-lg shadow-pink/20" : "bg-white/5 border-white/10 text-white/50 hover:bg-white/10"
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

export default function DestinationsPage() {
  return (
    <Suspense fallback={<div className="pt-[70px] min-h-screen text-center flex items-center justify-center text-white/40">Loading...</div>}>
      <DestinationsContent />
    </Suspense>
  );
}
