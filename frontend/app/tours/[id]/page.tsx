"use client";
import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Clock, Users, Star, MapPin, ChevronRight, Heart, Share2, Calendar } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { toursApi, bookingsApi } from "@/lib/api";
import { useAuthStore } from "@/stores/auth.store";

export default function TourDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();

  const [guests, setGuests] = useState(2);
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");

  const { data, isLoading } = useQuery({
    queryKey: ["tour", id],
    queryFn: () => toursApi.getById(Number(id)).then(r => r.data.data),
  });

  const bookMutation = useMutation({
    mutationFn: () => bookingsApi.create({
      bookableType: "tour",
      tourId: Number(id),
      checkIn: checkIn || new Date().toISOString(),
      checkOut: checkOut || new Date(Date.now() + (data?.durationDays || 3) * 86400000).toISOString(),
      guests,
    }),
    onSuccess: (res) => {
      const bookingId = res.data.data.id;
      router.push(`/bookings/${bookingId}/payment`);
    },
    onError: () => {
      if (!isAuthenticated) router.push("/login");
    },
  });

  if (isLoading) {
    return (
      <>
        <Navbar />
        <div style={{ paddingTop: 70 }}>
          <div className="skeleton" style={{ height: 500 }} />
        </div>
      </>
    );
  }

  if (!data) return null;
  const tour = data;
  const price = Number(tour.pricePerPerson);
  const total = price * guests;

  return (
    <>
      <Navbar />
      <main style={{ paddingTop: 70 }}>
        {/* Hero */}
        <div style={{ position: "relative", height: 520, overflow: "hidden" }}>
          {tour.coverImage
            ? <img src={tour.coverImage} alt={tour.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            : <div style={{ width: "100%", height: "100%", background: "linear-gradient(135deg, var(--midnight), var(--amber))" }} />
          }
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(20,13,31,1) 0%, rgba(0,0,0,0.3) 70%, transparent 100%)" }} />
          <div style={{ position: "absolute", bottom: 48, left: 0, right: 0, maxWidth: 1280, margin: "0 auto", padding: "0 40px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12, fontSize: 13, color: "rgba(255,255,255,0.6)" }}>
              <Link href="/" style={{ color: "inherit", textDecoration: "none" }}>Trang chủ</Link>
              <ChevronRight size={14} />
              <Link href="/tours" style={{ color: "inherit", textDecoration: "none" }}>Tours</Link>
              <ChevronRight size={14} />
              <span style={{ color: "#fff" }}>{tour.title}</span>
            </div>
            {tour.featured && <span className="badge badge-pink" style={{ marginBottom: 12 }}>✦ Tour Nổi Bật</span>}
            <h1 style={{ fontFamily: "var(--font-serif)", fontSize: "clamp(32px, 4vw, 56px)", fontWeight: 900, marginBottom: 16, lineHeight: 1.1 }}>
              {tour.title}
            </h1>
            <div style={{ display: "flex", gap: 20, flexWrap: "wrap" }}>
              <span style={{ display: "flex", alignItems: "center", gap: 6, color: "rgba(255,255,255,0.7)" }}>
                <MapPin size={16} style={{ color: "var(--pink)" }} />
                {tour.destination?.nameVi}, {tour.destination?.province}
              </span>
              <span style={{ display: "flex", alignItems: "center", gap: 6, color: "rgba(255,255,255,0.7)" }}>
                <Clock size={16} style={{ color: "var(--amber)" }} />
                {tour.durationDays} ngày {tour.durationDays - 1} đêm
              </span>
              <span style={{ display: "flex", alignItems: "center", gap: 6, color: "rgba(255,255,255,0.7)" }}>
                <Users size={16} style={{ color: "var(--pink)" }} />
                Tối đa {tour.maxGroupSize} người
              </span>
              {tour._count?.reviews > 0 && (
                <span style={{ display: "flex", alignItems: "center", gap: 6, color: "var(--amber)" }}>
                  <Star size={16} fill="currentColor" />
                  {tour._count.reviews} đánh giá
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Content + Booking */}
        <div style={{ maxWidth: 1280, margin: "0 auto", padding: "60px 40px", display: "grid", gridTemplateColumns: "1fr 380px", gap: 48, alignItems: "start" }}>
          {/* Left: Details */}
          <div>
            {/* Description */}
            {tour.description && (
              <div style={{ marginBottom: 48 }}>
                <h2 style={{ fontFamily: "var(--font-serif)", fontSize: 28, fontWeight: 700, marginBottom: 20 }}>Về Tour Này</h2>
                <p style={{ color: "var(--text)", fontSize: 16, lineHeight: 1.8 }}>{tour.description}</p>
              </div>
            )}

            {/* Highlights */}
            {tour.highlights?.length > 0 && (
              <div style={{ marginBottom: 48 }}>
                <h2 style={{ fontFamily: "var(--font-serif)", fontSize: 28, fontWeight: 700, marginBottom: 20 }}>Điểm Nổi Bật</h2>
                <ul style={{ listStyle: "none", padding: 0, display: "flex", flexDirection: "column", gap: 12 }}>
                  {tour.highlights.map((h: string, i: number) => (
                    <li key={i} style={{ display: "flex", alignItems: "flex-start", gap: 12, color: "rgba(255,255,255,0.85)", fontSize: 15 }}>
                      <span style={{ color: "var(--amber)", fontWeight: 700, flexShrink: 0 }}>✦</span>
                      {h}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Itinerary */}
            {tour.itinerary && (
              <div style={{ marginBottom: 48 }}>
                <h2 style={{ fontFamily: "var(--font-serif)", fontSize: 28, fontWeight: 700, marginBottom: 20 }}>Lịch Trình</h2>
                <div style={{ whiteSpace: "pre-wrap", color: "var(--text)", fontSize: 15, lineHeight: 1.8 }}>{tour.itinerary}</div>
              </div>
            )}

            {/* Reviews */}
            {tour.reviews?.length > 0 && (
              <div>
                <h2 style={{ fontFamily: "var(--font-serif)", fontSize: 28, fontWeight: 700, marginBottom: 20 }}>Đánh Giá</h2>
                <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                  {tour.reviews.map((review: any) => (
                    <div key={review.id} className="glass" style={{ borderRadius: 16, padding: 20 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
                        <div style={{ fontWeight: 600, color: "#fff" }}>{review.user?.name}</div>
                        <div style={{ display: "flex", gap: 4 }}>
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} size={14} style={{ color: i < review.rating ? "var(--amber)" : "rgba(255,255,255,0.2)" }} fill={i < review.rating ? "var(--amber)" : "none"} />
                          ))}
                        </div>
                      </div>
                      <p style={{ color: "var(--text)", fontSize: 14, lineHeight: 1.6 }}>{review.content}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right: Booking Widget */}
          <div style={{ position: "sticky", top: 90 }}>
            <div className="glass" style={{ borderRadius: 24, padding: 32 }}>
              {/* Price */}
              <div style={{ marginBottom: 24 }}>
                <span style={{ fontSize: 13, color: "rgba(255,255,255,0.5)" }}>Giá từ</span>
                <div style={{ display: "flex", alignItems: "baseline", gap: 8, marginTop: 4 }}>
                  <span style={{ fontFamily: "var(--font-serif)", fontSize: 40, fontWeight: 900, color: "var(--amber)" }}>
                    {price.toLocaleString("vi-VN")}₫
                  </span>
                  <span style={{ color: "rgba(255,255,255,0.5)", fontSize: 14 }}>/người</span>
                </div>
              </div>

              {/* Guests */}
              <div style={{ marginBottom: 16 }}>
                <label style={{ fontSize: 13, fontWeight: 600, color: "var(--pink)", textTransform: "uppercase", letterSpacing: "0.08em", display: "block", marginBottom: 8 }}>
                  Số Người
                </label>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <button onClick={() => setGuests(Math.max(1, guests - 1))} style={{ width: 36, height: 36, borderRadius: 10, border: "1px solid var(--glass-border)", background: "transparent", color: "#fff", cursor: "pointer", fontSize: 18 }}>−</button>
                  <span style={{ fontSize: 20, fontWeight: 700, flex: 1, textAlign: "center" }}>{guests}</span>
                  <button onClick={() => setGuests(Math.min(tour.maxGroupSize, guests + 1))} style={{ width: 36, height: 36, borderRadius: 10, border: "1px solid var(--glass-border)", background: "transparent", color: "#fff", cursor: "pointer", fontSize: 18 }}>+</button>
                </div>
              </div>

              {/* Dates */}
              <div style={{ marginBottom: 16 }}>
                <label style={{ fontSize: 13, fontWeight: 600, color: "var(--pink)", textTransform: "uppercase", letterSpacing: "0.08em", display: "block", marginBottom: 8 }}>
                  Ngày Khởi Hành
                </label>
                <input type="date" value={checkIn} onChange={e => setCheckIn(e.target.value)} className="input" />
              </div>

              {/* Total */}
              <div style={{ borderTop: "1px solid var(--glass-border)", paddingTop: 20, marginTop: 20, marginBottom: 24 }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                  <span style={{ color: "var(--text)" }}>{price.toLocaleString("vi-VN")} × {guests} người</span>
                  <span style={{ color: "#fff", fontWeight: 600 }}>{total.toLocaleString("vi-VN")}₫</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ color: "var(--text)" }}>Tổng cộng</span>
                  <span style={{ color: "var(--amber)", fontWeight: 700, fontSize: 20 }}>{total.toLocaleString("vi-VN")}₫</span>
                </div>
              </div>

              <button
                className="btn-primary"
                onClick={() => bookMutation.mutate()}
                disabled={bookMutation.isPending}
                style={{ width: "100%", justifyContent: "center", fontSize: 16, padding: "14px", opacity: bookMutation.isPending ? 0.7 : 1 }}
              >
                {bookMutation.isPending ? "Đang xử lý..." : isAuthenticated ? "Đặt Tour Ngay ✦" : "Đăng nhập để đặt"}
              </button>

              <p style={{ textAlign: "center", fontSize: 12, color: "rgba(255,255,255,0.4)", marginTop: 12 }}>
                Miễn phí huỷ trong 24 giờ
              </p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
