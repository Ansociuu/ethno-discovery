"use client";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { MapPin, Mountain, Filter, ChevronDown, Search } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { destinationsApi } from "@/lib/api";

const DIFFICULTIES = ["", "EASY", "MODERATE", "HARD", "EXPERT"];
const DIFFICULTY_LABELS: Record<string, string> = { "": "Tất cả", EASY: "Dễ", MODERATE: "Trung bình", HARD: "Khó", EXPERT: "Chuyên nghiệp" };
const PROVINCES = ["", "Hà Giang", "Lào Cai", "Sơn La", "Lai Châu", "Điện Biên", "Yên Bái"];

export default function DestinationsPage() {
  const [search, setSearch] = useState("");
  const [difficulty, setDifficulty] = useState("");
  const [province, setProvince] = useState("");
  const [page, setPage] = useState(1);

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
      <main style={{ paddingTop: 70 }}>
        {/* Page Header */}
        <div style={{
          background: "linear-gradient(135deg, rgba(255,60,172,0.1) 0%, rgba(255,214,10,0.06) 100%)",
          borderBottom: "1px solid var(--glass-border)",
          padding: "60px 40px",
          textAlign: "center",
        }}>
          <span className="section-tag">🏔 Điểm Đến</span>
          <h1 style={{ fontFamily: "var(--font-serif)", fontSize: "clamp(36px, 5vw, 64px)", fontWeight: 900, margin: "16px 0 12px", lineHeight: 1.1 }}>
            Khám Phá <span className="text-gradient-pink">Tây Bắc</span>
          </h1>
          <p style={{ color: "var(--text)", fontSize: 17, maxWidth: 500, margin: "0 auto" }}>
            {pagination?.total || 0} điểm đến đang chờ bạn khám phá
          </p>
        </div>

        <div style={{ maxWidth: 1280, margin: "0 auto", padding: "40px 40px" }}>
          {/* Filters */}
          <div style={{ display: "flex", gap: 12, marginBottom: 40, flexWrap: "wrap", alignItems: "center" }}>
            {/* Search */}
            <div style={{ position: "relative", flex: "1 1 260px" }}>
              <Search size={16} style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: "rgba(255,255,255,0.4)" }} />
              <input
                value={search}
                onChange={e => { setSearch(e.target.value); setPage(1); }}
                placeholder="Tìm kiếm điểm đến..."
                className="input"
                style={{ paddingLeft: 42 }}
              />
            </div>

            {/* Province */}
            <select
              value={province}
              onChange={e => { setProvince(e.target.value); setPage(1); }}
              className="input"
              style={{ width: "auto", cursor: "pointer" }}
            >
              {PROVINCES.map(p => <option key={p} value={p} style={{ background: "var(--dark)" }}>{p || "Tất cả tỉnh"}</option>)}
            </select>

            {/* Difficulty */}
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              {DIFFICULTIES.map(d => (
                <button
                  key={d}
                  onClick={() => { setDifficulty(d); setPage(1); }}
                  style={{
                    padding: "8px 16px", borderRadius: 20, fontSize: 13, fontWeight: 500,
                    cursor: "pointer", border: "1px solid",
                    background: difficulty === d ? "var(--pink)" : "transparent",
                    borderColor: difficulty === d ? "var(--pink)" : "var(--glass-border)",
                    color: difficulty === d ? "#fff" : "rgba(255,255,255,0.7)",
                    transition: "all 0.2s",
                  }}
                >
                  {DIFFICULTY_LABELS[d]}
                </button>
              ))}
            </div>
          </div>

          {/* Grid */}
          {isLoading ? (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 24 }}>
              {[...Array(6)].map((_, i) => <div key={i} className="skeleton" style={{ height: 360, borderRadius: 20 }} />)}
            </div>
          ) : destinations.length === 0 ? (
            <div style={{ textAlign: "center", padding: "80px 0", color: "var(--text)" }}>
              <div style={{ fontSize: 48, marginBottom: 16 }}>🏔</div>
              <p>Không tìm thấy điểm đến phù hợp</p>
            </div>
          ) : (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 24 }}>
              {destinations.map((dest: any) => (
                <Link key={dest.id} href={`/destinations/${dest.slug}`} style={{ textDecoration: "none" }}>
                  <div className="card" style={{ height: "100%" }}
                    onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = "translateY(-6px)"; (e.currentTarget as HTMLElement).style.boxShadow = "0 24px 60px rgba(0,0,0,0.5)"; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = ""; (e.currentTarget as HTMLElement).style.boxShadow = ""; }}>
                    {/* Image */}
                    <div style={{ position: "relative", height: 220, overflow: "hidden" }}>
                      {dest.coverImage
                        ? <img src={dest.coverImage} alt={dest.nameVi} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                        : <div style={{ width: "100%", height: "100%", background: "linear-gradient(135deg, var(--midnight), var(--pink))" }} />
                      }
                      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 60%)" }} />
                      <span className="badge badge-pink" style={{ position: "absolute", top: 12, right: 12 }}>
                        {DIFFICULTY_LABELS[dest.difficulty] || dest.difficulty}
                      </span>
                    </div>

                    {/* Info */}
                    <div style={{ padding: 20 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 8, color: "var(--text)", fontSize: 13 }}>
                        <MapPin size={14} style={{ color: "var(--pink)" }} /> {dest.province}
                        {dest.altitude && <><Mountain size={13} style={{ marginLeft: 8 }} /> {dest.altitude.toLocaleString()}m</>}
                      </div>
                      <h3 style={{ fontFamily: "var(--font-serif)", fontSize: 22, fontWeight: 700, color: "#fff", marginBottom: 12 }}>{dest.nameVi}</h3>
                      {dest.bestSeason && <p style={{ fontSize: 13, color: "var(--text)", marginBottom: 12 }}>🗓 {dest.bestSeason}</p>}
                      <div style={{ display: "flex", gap: 8 }}>
                        <span className="badge badge-pink">{dest._count?.tours || 0} tours</span>
                        <span className="badge badge-amber">{dest._count?.homestays || 0} homestays</span>
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
                  cursor: "pointer", fontSize: 14, fontWeight: 500, transition: "all 0.2s",
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
