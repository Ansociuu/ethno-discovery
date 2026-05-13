"use client";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { Clock, Users, Star, Search, Filter, ChevronRight } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { toursApi } from "@/lib/api";

export default function ToursPage() {
  const [search, setSearch] = useState("");
  const [duration, setDuration] = useState("");
  const [priceMax, setPriceMax] = useState("");
  const [sortBy, setSortBy] = useState("featured");
  const [page, setPage] = useState(1);

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
      <main style={{ paddingTop: 70 }}>
        {/* Header */}
        <div style={{
          background: "linear-gradient(135deg, rgba(255,214,10,0.08) 0%, rgba(255,60,172,0.08) 100%)",
          borderBottom: "1px solid var(--glass-border)",
          padding: "60px 40px",
          textAlign: "center",
        }}>
          <span className="section-tag">🗺 Tours Văn Hoá</span>
          <h1 style={{ fontFamily: "var(--font-serif)", fontSize: "clamp(36px, 5vw, 64px)", fontWeight: 900, margin: "16px 0 12px", lineHeight: 1.1 }}>
            Hành Trình <span className="text-gradient-amber">Đáng Nhớ</span>
          </h1>
          <p style={{ color: "var(--text)", fontSize: 17, maxWidth: 500, margin: "0 auto" }}>
            {pagination?.total || 0} tours đang chờ bạn khám phá
          </p>
        </div>

        <div style={{ maxWidth: 1280, margin: "0 auto", padding: "40px" }}>
          {/* Filters */}
          <div style={{ display: "flex", gap: 12, marginBottom: 40, flexWrap: "wrap", alignItems: "center" }}>
            <div style={{ position: "relative", flex: "1 1 260px" }}>
              <Search size={16} style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: "rgba(255,255,255,0.4)" }} />
              <input
                value={search}
                onChange={e => { setSearch(e.target.value); setPage(1); }}
                placeholder="Tìm kiếm tour..."
                className="input"
                style={{ paddingLeft: 42 }}
              />
            </div>

            <select value={duration} onChange={e => { setDuration(e.target.value); setPage(1); }} className="input" style={{ width: "auto" }}>
              <option value="">Thời gian</option>
              {[2, 3, 4, 5, 6, 7].map(d => <option key={d} value={d} style={{ background: "var(--dark)" }}>{d} ngày</option>)}
            </select>

            <select value={priceMax} onChange={e => { setPriceMax(e.target.value); setPage(1); }} className="input" style={{ width: "auto" }}>
              <option value="">Mức giá</option>
              <option value="2000000" style={{ background: "var(--dark)" }}>Dưới 2 triệu</option>
              <option value="5000000" style={{ background: "var(--dark)" }}>Dưới 5 triệu</option>
              <option value="10000000" style={{ background: "var(--dark)" }}>Dưới 10 triệu</option>
            </select>

            <select value={sortBy} onChange={e => setSortBy(e.target.value)} className="input" style={{ width: "auto" }}>
              <option value="featured" style={{ background: "var(--dark)" }}>Nổi bật</option>
              <option value="price_asc" style={{ background: "var(--dark)" }}>Giá thấp → cao</option>
              <option value="price_desc" style={{ background: "var(--dark)" }}>Giá cao → thấp</option>
            </select>
          </div>

          {/* Grid */}
          {isLoading ? (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 24 }}>
              {[...Array(6)].map((_, i) => <div key={i} className="skeleton" style={{ height: 400, borderRadius: 20 }} />)}
            </div>
          ) : tours.length === 0 ? (
            <div style={{ textAlign: "center", padding: "80px 0", color: "var(--text)" }}>
              <div style={{ fontSize: 48, marginBottom: 16 }}>🗺</div>
              <p>Không tìm thấy tour phù hợp</p>
            </div>
          ) : (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 24 }}>
              {tours.map((tour: any) => (
                <Link key={tour.id} href={`/tours/${tour.id}`} style={{ textDecoration: "none" }}>
                  <div className="card"
                    onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = "translateY(-6px)"; (e.currentTarget as HTMLElement).style.boxShadow = "0 24px 60px rgba(0,0,0,0.5)"; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = ""; (e.currentTarget as HTMLElement).style.boxShadow = ""; }}>
                    <div style={{ position: "relative", height: 220, overflow: "hidden" }}>
                      {tour.coverImage
                        ? <img src={tour.coverImage} alt={tour.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                        : <div style={{ width: "100%", height: "100%", background: "linear-gradient(135deg, var(--midnight), var(--amber))" }} />
                      }
                      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,0.6) 0%, transparent 60%)" }} />
                      {tour.featured && <span className="badge badge-pink" style={{ position: "absolute", top: 12, left: 12 }}>✦ Nổi bật</span>}
                    </div>
                    <div style={{ padding: 20 }}>
                      <p style={{ fontSize: 12, color: "var(--pink)", marginBottom: 8 }}>
                        📍 {tour.destination?.nameVi}, {tour.destination?.province}
                      </p>
                      <h3 style={{ fontFamily: "var(--font-serif)", fontSize: 18, fontWeight: 700, color: "#fff", marginBottom: 12, lineHeight: 1.3 }}>
                        {tour.title}
                      </h3>
                      <div style={{ display: "flex", gap: 16, marginBottom: 16, color: "rgba(255,255,255,0.6)", fontSize: 13 }}>
                        <span style={{ display: "flex", alignItems: "center", gap: 4 }}><Clock size={14} /> {tour.durationDays} ngày</span>
                        <span style={{ display: "flex", alignItems: "center", gap: 4 }}><Users size={14} /> {tour.maxGroupSize} người</span>
                        {tour._count?.reviews > 0 && (
                          <span style={{ display: "flex", alignItems: "center", gap: 4 }}><Star size={14} style={{ color: "var(--amber)" }} /> {tour._count.reviews}</span>
                        )}
                      </div>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
                        <div>
                          <div style={{ fontSize: 13, color: "rgba(255,255,255,0.5)" }}>Từ</div>
                          <div style={{ fontSize: 22, fontWeight: 700, color: "var(--amber)" }}>
                            {Number(tour.pricePerPerson).toLocaleString("vi-VN")}₫
                          </div>
                          <div style={{ fontSize: 12, color: "rgba(255,255,255,0.5)" }}>/người</div>
                        </div>
                        <button className="btn-primary" style={{ padding: "10px 20px", fontSize: 14 }}>Đặt ngay</button>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}

          {/* Pagination */}
          {pagination && pagination.totalPages > 1 && (
            <div style={{ display: "flex", justifyContent: "center", gap: 8, marginTop: 48 }}>
              {[...Array(pagination.totalPages)].map((_, i) => (
                <button key={i} onClick={() => setPage(i + 1)} style={{
                  width: 40, height: 40, borderRadius: 10, border: "1px solid",
                  cursor: "pointer", fontSize: 14, fontWeight: 500,
                  background: page === i + 1 ? "var(--pink)" : "transparent",
                  borderColor: page === i + 1 ? "var(--pink)" : "var(--glass-border)",
                  color: "#fff",
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
