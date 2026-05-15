"use client";
import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { Search, MapPin, X } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { MobileTabBar } from "@/components/layout/MobileTabBar";
import { searchApi } from "@/lib/api";

type Tab = "all" | "destinations" | "tours" | "homestays";

export default function SearchPageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const initialQ = searchParams.get("q") || "";
  const initialTypeRaw = searchParams.get("type");
  const initialType = (initialTypeRaw && ["all", "destinations", "tours", "homestays"].includes(initialTypeRaw))
    ? (initialTypeRaw as Tab)
    : "all";

  const [query, setQuery] = useState(initialQ);
  const [activeTab, setActiveTab] = useState<Tab>(initialType);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSugg, setShowSugg] = useState(false);

  const { data, isLoading } = useQuery({
    queryKey: ["search", query],
    queryFn: () => searchApi.search({
      q: query,
      limit: 20
    }).then(r => r.data),
    enabled: query.length >= 2,
  });

  const { data: trending } = useQuery({
    queryKey: ["trending"],
    queryFn: () => searchApi.trending().then(r => r.data),
    enabled: query.length < 2,
  });

  useEffect(() => {
    if (query.length < 2) { setSuggestions([]); return; }
    const t = setTimeout(async () => {
      try {
        const res = await searchApi.suggestions(query);
        setSuggestions(res.data.data || []);
      } catch { }
    }, 300);
    return () => clearTimeout(t);
  }, [query]);

  const handleSearch = (q: string) => {
    setQuery(q);
    setShowSugg(false);
    router.replace(`/search?q=${encodeURIComponent(q)}`);
  };

  const results = data?.data || {};
  const allResults = [
    ...(results.destinations || []).map((d: any) => ({ ...d, _type: "destination" })),
    ...(results.tours || []).map((t: any) => ({ ...t, _type: "tour" })),
    ...(results.homestays || []).map((h: any) => ({ ...h, _type: "homestay" })),
  ];

  const displayedResults = activeTab === "all"
    ? allResults
    : allResults.filter(item => item._type === activeTab.replace(/s$/, ""));

  const totalCount = data?.total || allResults.length;

  const getItemLink = (item: any) => {
    if (item._type === "destination") return `/destinations/${item.slug}`;
    if (item._type === "tour") return `/tours/${item.id}`;
    return `/homestays/${item.id}`;
  };

  const getItemTitle = (item: any) => item.nameVi || item.title || item.name;
  const getItemPrice = (item: any) => item.pricePerPerson || item.pricePerNight;

  const TYPE_LABELS: Record<string, { label: string; color: string; icon: string }> = {
    destination: { label: "Điểm Đến", color: "var(--pink)", icon: "🏔" },
    tour: { label: "Tour", color: "var(--amber)", icon: "🗺" },
    homestay: { label: "Homestay", color: "#10b981", icon: "🏠" },
  };

  const TABS: { key: Tab; label: string }[] = [
    { key: "all", label: `Tất cả${totalCount ? ` (${totalCount})` : ""}` },
    { key: "destinations", label: `Điểm đến${results.destinations ? ` (${results.destinations.length})` : ""}` },
    { key: "tours", label: `Tours${results.tours ? ` (${results.tours.length})` : ""}` },
    { key: "homestays", label: `Homestays${results.homestays ? ` (${results.homestays.length})` : ""}` },
  ];

  return (
    <>
      <Navbar />
      <main style={{ paddingTop: 70, minHeight: "100vh" }}>
        {/* Header */}
        <div style={{ background: "var(--midnight)", borderBottom: "1px solid var(--glass-border)", padding: "48px 40px 0" }}>
          <div style={{ maxWidth: 800, margin: "0 auto" }}>
            {/* Search Input */}
            <div style={{ position: "relative", marginBottom: 32 }}>
              <Search size={22} style={{ position: "absolute", left: 20, top: "50%", transform: "translateY(-50%)", color: "var(--pink)", zIndex: 1 }} />
              <input
                value={query}
                onChange={e => { setQuery(e.target.value); setShowSugg(true); }}
                onFocus={() => setShowSugg(true)}
                onBlur={() => setTimeout(() => setShowSugg(false), 200)}
                onKeyDown={e => { if (e.key === "Enter") handleSearch(query); if (e.key === "Escape") setShowSugg(false); }}
                placeholder="Tìm điểm đến, tour, homestay..."
                style={{
                  width: "100%", padding: "18px 52px 18px 56px",
                  background: "rgba(255,255,255,0.06)", border: "2px solid var(--glass-border)",
                  borderRadius: 16, color: "#fff", fontSize: 18, outline: "none",
                  fontFamily: "var(--font-dm)", transition: "border-color 0.2s", boxSizing: "border-box",
                }}
              />
              {query && (
                <button onClick={() => { setQuery(""); setSuggestions([]); }}
                  style={{ position: "absolute", right: 16, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "rgba(255,255,255,0.5)" }}>
                  <X size={20} />
                </button>
              )}

              {/* Suggestions */}
              {showSugg && suggestions.length > 0 && (
                <div style={{ position: "absolute", top: "calc(100% + 8px)", left: 0, right: 0, background: "rgba(20,13,31,0.98)", backdropFilter: "blur(20px)", border: "1px solid var(--glass-border)", borderRadius: 16, padding: 8, zIndex: 100, boxShadow: "0 20px 60px rgba(0,0,0,0.5)" }}>
                  {suggestions.map((s) => (
                    <button key={s} onClick={() => handleSearch(s)}
                      style={{ width: "100%", padding: "10px 16px", background: "none", border: "none", borderRadius: 10, cursor: "pointer", textAlign: "left", color: "rgba(255,255,255,0.8)", fontSize: 15, display: "flex", alignItems: "center", gap: 10 }}
                      onMouseEnter={e => (e.currentTarget.style.background = "rgba(255,60,172,0.1)")}
                      onMouseLeave={e => (e.currentTarget.style.background = "none")}>
                      <Search size={14} style={{ color: "var(--pink)" }} /> {s}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {query.length >= 2 && (
              <div style={{ display: "flex", gap: 4 }}>
                {TABS.map(tab => (
                  <button key={tab.key} onClick={() => setActiveTab(tab.key)} style={{
                    padding: "10px 20px", border: "none", cursor: "pointer", fontSize: 14, fontWeight: 500, borderRadius: "10px 10px 0 0",
                    background: activeTab === tab.key ? "var(--dark)" : "transparent",
                    color: activeTab === tab.key ? "#fff" : "rgba(255,255,255,0.5)",
                    transition: "all 0.2s",
                  }}>
                    {tab.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        <div style={{ maxWidth: 1280, margin: "0 auto", padding: "48px 40px" }}>
          {/* Trending/Quick links when no query */}
          {query.length < 2 && (
            <div>
              <h2 style={{ fontFamily: "var(--font-serif)", fontSize: 28, fontWeight: 700, marginBottom: 24 }}>🔥 Đang Hot</h2>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 12, marginBottom: 48 }}>
                {(trending?.data?.length > 0 ? trending.data : ["Sa Pa", "Hà Giang", "Bắc Hà", "Mù Cang Chải", "Điện Biên", "Lai Châu"]).map((t: string) => (
                  <button key={t} onClick={() => handleSearch(t)} style={{ padding: "10px 20px", borderRadius: 20, border: "1px solid var(--glass-border)", background: "var(--glass)", color: "rgba(255,255,255,0.75)", fontSize: 14, cursor: "pointer", transition: "all 0.2s" }}
                    onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = "var(--pink)"; (e.currentTarget as HTMLElement).style.color = "var(--pink)"; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = "var(--glass-border)"; (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.75)"; }}>
                    🔍 {t}
                  </button>
                ))}
              </div>

              <h2 style={{ fontFamily: "var(--font-serif)", fontSize: 28, fontWeight: 700, marginBottom: 24 }}>Khám Phá</h2>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 16 }}>
                {[
                  { title: "Tours Vùng Cao", sub: "Hành trình văn hoá", href: "/tours", icon: "🗺", color: "var(--pink)" },
                  { title: "Homestay Bản Địa", sub: "Nghỉ đêm bản làng", href: "/homestays", icon: "🏠", color: "var(--amber)" },
                  { title: "Điểm Đến", sub: "Khám phá địa danh", href: "/destinations", icon: "🏔", color: "var(--pink)" },
                  { title: "AI Planner", sub: "Lịch trình thông minh", href: "/ai-planner", icon: "✨", color: "var(--amber)" },
                ].map(cat => (
                  <Link key={cat.href} href={cat.href} style={{ textDecoration: "none" }}>
                    <div className="glass" style={{ borderRadius: 20, padding: 24, transition: "transform 0.2s" }}
                      onMouseEnter={e => (e.currentTarget.style.transform = "translateY(-4px)")}
                      onMouseLeave={e => (e.currentTarget.style.transform = "")}>
                      <div style={{ fontSize: 36, marginBottom: 12 }}>{cat.icon}</div>
                      <div style={{ fontFamily: "var(--font-serif)", fontSize: 18, fontWeight: 600, color: "#fff", marginBottom: 4 }}>{cat.title}</div>
                      <div style={{ fontSize: 13, color: "var(--text)" }}>{cat.sub}</div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Loading */}
          {isLoading && (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 20 }}>
              {[...Array(6)].map((_, i) => <div key={i} className="skeleton" style={{ height: 220, borderRadius: 16 }} />)}
            </div>
          )}

          {/* Results */}
          {!isLoading && query.length >= 2 && (
            <div>
              <p style={{ color: "var(--text)", fontSize: 15, marginBottom: 28 }}>
                {displayedResults.length > 0 ? `Tìm thấy ${displayedResults.length} kết quả cho "${query}"` : `Không tìm thấy kết quả cho "${query}"`}
              </p>

              {displayedResults.length === 0 ? (
                <div style={{ textAlign: "center", padding: "80px 0" }}>
                  <div style={{ fontSize: 60, marginBottom: 20 }}>🔍</div>
                  <h3 style={{ fontFamily: "var(--font-serif)", fontSize: 24, marginBottom: 12 }}>Không tìm thấy kết quả</h3>
                  <p style={{ color: "var(--text)", marginBottom: 32 }}>Thử từ khóa khác như "Sapa", "Hà Giang", "tour văn hoá"</p>
                  <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
                    {["Sa Pa", "Hà Giang", "Mù Cang Chải"].map(s => (
                      <button key={s} onClick={() => handleSearch(s)} className="btn-ghost" style={{ padding: "10px 20px", fontSize: 14 }}>{s}</button>
                    ))}
                  </div>
                </div>
              ) : (
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 20 }}>
                  {displayedResults.map((item: any) => {
                    const type = TYPE_LABELS[item._type];
                    const price = getItemPrice(item);
                    return (
                      <Link key={`${item._type}-${item.id}`} href={getItemLink(item)} style={{ textDecoration: "none" }}>
                        <div className="card"
                          onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = "translateY(-6px)"; }}
                          onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = ""; }}>
                          <div style={{ height: 180, position: "relative", overflow: "hidden" }}>
                            {item.coverImage
                              ? <img src={item.coverImage} alt={getItemTitle(item)} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                              : <div style={{ width: "100%", height: "100%", background: "linear-gradient(135deg, var(--midnight), var(--pink))", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 40 }}>{type.icon}</div>
                            }
                            <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,0.5), transparent 60%)" }} />
                            <span className="badge" style={{ position: "absolute", top: 12, left: 12, background: `${type.color}22`, color: type.color, border: `1px solid ${type.color}44` }}>
                              {type.icon} {type.label}
                            </span>
                          </div>
                          <div style={{ padding: 18 }}>
                            <h3 style={{ fontFamily: "var(--font-serif)", fontSize: 17, fontWeight: 700, color: "#fff", marginBottom: 6 }}>{getItemTitle(item)}</h3>
                            {(item.province || item.destination?.province) && (
                              <div style={{ fontSize: 13, color: "var(--text)", marginBottom: 10, display: "flex", alignItems: "center", gap: 4 }}>
                                <MapPin size={12} /> {item.province || item.destination?.province}
                              </div>
                            )}
                            {price && (
                              <div style={{ fontSize: 16, fontWeight: 700, color: "var(--amber)" }}>
                                {Number(price).toLocaleString("vi-VN")}₫
                                <span style={{ fontSize: 12, color: "var(--text)", fontWeight: 400 }}>{item._type === "homestay" ? "/đêm" : "/người"}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>
      </main>
      <Footer />
      <MobileTabBar />
    </>
  );
}
