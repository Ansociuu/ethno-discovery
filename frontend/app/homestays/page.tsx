"use client";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { Users, Star, Search, ChevronRight } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { homestaysApi } from "@/lib/api";

export default function HomestaysPage() {
  const [search, setSearch] = useState("");
  const [maxGuests, setMaxGuests] = useState("");
  const [priceMax, setPriceMax] = useState("");
  const [page, setPage] = useState(1);

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
      <main style={{ paddingTop: 70 }}>
        {/* Header */}
        <div style={{
          background: "linear-gradient(135deg, rgba(255,214,10,0.08) 0%, rgba(255,60,172,0.06) 100%)",
          borderBottom: "1px solid var(--glass-border)",
          padding: "60px 40px",
          textAlign: "center",
        }}>
          <span className="section-tag">🏠 Homestay Bản Địa</span>
          <h1 style={{ fontFamily: "var(--font-serif)", fontSize: "clamp(36px, 5vw, 64px)", fontWeight: 900, margin: "16px 0 12px" }}>
            Nghỉ Đêm <span className="text-gradient-amber">Bản Làng</span>
          </h1>
          <p style={{ color: "var(--text)", fontSize: 17, maxWidth: 500, margin: "0 auto" }}>
            {pagination?.total || 0} homestay chân thực tại vùng cao Tây Bắc
          </p>
        </div>

        <div style={{ maxWidth: 1280, margin: "0 auto", padding: "40px" }}>
          {/* Filters */}
          <div style={{ display: "flex", gap: 12, marginBottom: 40, flexWrap: "wrap", alignItems: "center" }}>
            <div style={{ position: "relative", flex: "1 1 260px" }}>
              <Search size={16} style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: "rgba(255,255,255,0.4)" }} />
              <input value={search} onChange={e => { setSearch(e.target.value); setPage(1); }} placeholder="Tìm homestay..." className="input" style={{ paddingLeft: 42 }} />
            </div>
            <select value={maxGuests} onChange={e => { setMaxGuests(e.target.value); setPage(1); }} className="input" style={{ width: "auto" }}>
              <option value="">Số khách</option>
              {[2, 4, 6, 8, 10].map(n => <option key={n} value={n} style={{ background: "var(--dark)" }}>Tối thiểu {n} khách</option>)}
            </select>
            <select value={priceMax} onChange={e => { setPriceMax(e.target.value); setPage(1); }} className="input" style={{ width: "auto" }}>
              <option value="">Giá/đêm</option>
              <option value="500000" style={{ background: "var(--dark)" }}>Dưới 500k</option>
              <option value="1000000" style={{ background: "var(--dark)" }}>Dưới 1 triệu</option>
              <option value="2000000" style={{ background: "var(--dark)" }}>Dưới 2 triệu</option>
            </select>
          </div>

          {/* Grid */}
          {isLoading ? (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 24 }}>
              {[...Array(6)].map((_, i) => <div key={i} className="skeleton" style={{ height: 380, borderRadius: 20 }} />)}
            </div>
          ) : (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 24 }}>
              {homestays.map((hs: any) => (
                <Link key={hs.id} href={`/homestays/${hs.id}`} style={{ textDecoration: "none" }}>
                  <div className="card"
                    onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = "translateY(-6px)"; (e.currentTarget as HTMLElement).style.boxShadow = "0 24px 60px rgba(0,0,0,0.5)"; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = ""; (e.currentTarget as HTMLElement).style.boxShadow = ""; }}>
                    <div style={{ position: "relative", height: 220, overflow: "hidden" }}>
                      {hs.coverImage
                        ? <img src={hs.coverImage} alt={hs.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                        : <div style={{ width: "100%", height: "100%", background: "linear-gradient(135deg, var(--midnight), var(--amber))" }} />
                      }
                      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,0.6) 0%, transparent 60%)" }} />
                      {hs.featured && <span className="badge badge-amber" style={{ position: "absolute", top: 12, left: 12 }}>⭐ Nổi bật</span>}
                    </div>
                    <div style={{ padding: 20 }}>
                      <p style={{ fontSize: 12, color: "var(--amber)", marginBottom: 8 }}>
                        📍 {hs.destination?.nameVi}, {hs.destination?.province}
                      </p>
                      <h3 style={{ fontFamily: "var(--font-serif)", fontSize: 18, fontWeight: 700, color: "#fff", marginBottom: 12, lineHeight: 1.3 }}>
                        {hs.name}
                      </h3>
                      <div style={{ display: "flex", gap: 16, marginBottom: 16, color: "rgba(255,255,255,0.6)", fontSize: 13 }}>
                        <span style={{ display: "flex", alignItems: "center", gap: 4 }}><Users size={14} /> {hs.maxGuests} khách</span>
                        {hs._count?.reviews > 0 && (
                          <span style={{ display: "flex", alignItems: "center", gap: 4 }}><Star size={14} style={{ color: "var(--amber)" }} /> {hs._count.reviews}</span>
                        )}
                      </div>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
                        <div>
                          <div style={{ fontSize: 22, fontWeight: 700, color: "var(--amber)" }}>
                            {Number(hs.pricePerNight).toLocaleString("vi-VN")}₫
                          </div>
                          <div style={{ fontSize: 12, color: "rgba(255,255,255,0.5)" }}>/đêm</div>
                        </div>
                        <button className="btn-primary" style={{ padding: "10px 20px", fontSize: 14 }}>Đặt phòng</button>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}

          {pagination && pagination.totalPages > 1 && (
            <div style={{ display: "flex", justifyContent: "center", gap: 8, marginTop: 48 }}>
              {[...Array(pagination.totalPages)].map((_, i) => (
                <button key={i} onClick={() => setPage(i + 1)} style={{
                  width: 40, height: 40, borderRadius: 10, border: "1px solid", cursor: "pointer", fontSize: 14,
                  background: page === i + 1 ? "var(--amber)" : "transparent",
                  borderColor: page === i + 1 ? "var(--amber)" : "var(--glass-border)", color: "#fff",
                }}>
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
