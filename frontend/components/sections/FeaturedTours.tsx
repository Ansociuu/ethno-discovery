"use client";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { Clock, Users, ChevronRight, Star } from "lucide-react";
import { toursApi } from "@/lib/api";

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

export function FeaturedTours() {
  const { data, isLoading } = useQuery({
    queryKey: ["tours", "featured"],
    queryFn: () => toursApi.getFeatured().then((r) => r.data.data as Tour[]),
  });

  const tours = data?.slice(0, 4) || [];

  return (
    <section style={{ padding: "100px 40px", maxWidth: 1280, margin: "0 auto" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 60, flexWrap: "wrap", gap: 20 }}>
        <div>
          <span className="section-tag">🗺 Tours Văn Hoá</span>
          <h2 style={{ fontFamily: "var(--font-serif)", fontSize: "clamp(32px, 4vw, 52px)", fontWeight: 700, lineHeight: 1.1, margin: "12px 0" }}>
            Hành Trình <span className="text-gradient-amber">Đáng Nhớ</span>
          </h2>
          <p style={{ color: "var(--text)", fontSize: 17, fontWeight: 300, maxWidth: 500, lineHeight: 1.7 }}>
            Những tour được thiết kế tỉ mỉ, kết hợp thiên nhiên hùng vĩ và văn hoá bản địa chân thực.
          </p>
        </div>
        <Link href="/tours" className="btn-ghost" style={{ padding: "12px 24px", fontSize: 14, whiteSpace: "nowrap" }}>
          Xem tất cả <ChevronRight size={16} />
        </Link>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 24 }}>
        {isLoading
          ? [...Array(4)].map((_, i) => (
              <div key={i} className="skeleton" style={{ height: 380, borderRadius: 20 }} />
            ))
          : tours.map((tour) => (
              <TourCard key={tour.id} tour={tour} />
            ))}
      </div>
    </section>
  );
}

function TourCard({ tour }: { tour: Tour }) {
  const price = Number(tour.pricePerPerson);

  return (
    <Link
      href={`/tours/${tour.id}`}
      style={{ textDecoration: "none" }}
    >
      <div className="card" style={{ height: "100%", display: "flex", flexDirection: "column" }}
        onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = "translateY(-6px)"; (e.currentTarget as HTMLElement).style.boxShadow = "0 24px 60px rgba(0,0,0,0.5)"; }}
        onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = ""; (e.currentTarget as HTMLElement).style.boxShadow = ""; }}>
        {/* Image */}
        <div style={{ position: "relative", height: 220, overflow: "hidden" }}>
          {tour.coverImage ? (
            <img src={tour.coverImage} alt={tour.title} style={{ width: "100%", height: "100%", objectFit: "cover", transition: "transform 0.5s" }}
              onMouseEnter={e => (e.currentTarget.style.transform = "scale(1.05)")}
              onMouseLeave={e => (e.currentTarget.style.transform = "")} />
          ) : (
            <div style={{ width: "100%", height: "100%", background: "linear-gradient(135deg, var(--midnight), var(--pink))" }} />
          )}
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,0.6) 0%, transparent 60%)" }} />
          {tour.featured && (
            <div className="badge badge-pink" style={{ position: "absolute", top: 12, left: 12 }}>✦ Nổi bật</div>
          )}
        </div>

        {/* Content */}
        <div style={{ padding: 20, flex: 1, display: "flex", flexDirection: "column" }}>
          <p style={{ fontSize: 12, color: "var(--pink)", marginBottom: 8, display: "flex", alignItems: "center", gap: 4 }}>
            📍 {tour.destination.nameVi}, {tour.destination.province}
          </p>
          <h3 style={{ fontFamily: "var(--font-serif)", fontSize: 18, fontWeight: 700, color: "#fff", marginBottom: 12, lineHeight: 1.3 }}>
            {tour.title}
          </h3>

          <div style={{ display: "flex", gap: 16, marginBottom: 16, color: "rgba(255,255,255,0.6)", fontSize: 13 }}>
            <span style={{ display: "flex", alignItems: "center", gap: 4 }}><Clock size={14} /> {tour.durationDays} ngày</span>
            <span style={{ display: "flex", alignItems: "center", gap: 4 }}><Users size={14} /> Tối đa {tour.maxGroupSize}</span>
            {tour._count.reviews > 0 && (
              <span style={{ display: "flex", alignItems: "center", gap: 4 }}><Star size={14} style={{ color: "var(--amber)" }} /> {tour._count.reviews} đánh giá</span>
            )}
          </div>

          <div style={{ marginTop: "auto", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <span style={{ fontSize: 12, color: "rgba(255,255,255,0.5)" }}>Từ</span>
              <div style={{ fontSize: 22, fontWeight: 700, color: "var(--amber)" }}>
                {price.toLocaleString("vi-VN")}₫
              </div>
              <span style={{ fontSize: 12, color: "rgba(255,255,255,0.5)" }}>/người</span>
            </div>
            <button className="btn-primary" style={{ padding: "10px 20px", fontSize: 14 }}>
              Đặt ngay
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
}
