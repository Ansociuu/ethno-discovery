"use client";
import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Users, Star, MapPin, ChevronRight, Calendar, Heart, Wifi, Coffee, Mountain } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { homestaysApi, bookingsApi } from "@/lib/api";
import { useAuthStore } from "@/stores/auth.store";

export default function HomestayDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();

  const [guests, setGuests] = useState(2);
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [nights, setNights] = useState(1);

  // Calculate nights when dates change
  const calcNights = (ci: string, co: string) => {
    if (!ci || !co) return 1;
    const diff = (new Date(co).getTime() - new Date(ci).getTime()) / 86400000;
    return Math.max(1, Math.round(diff));
  };

  const { data, isLoading } = useQuery({
    queryKey: ["homestay", id],
    queryFn: () => homestaysApi.getById(Number(id)).then(r => r.data.data),
  });

  const bookMutation = useMutation({
    mutationFn: () => bookingsApi.create({
      bookableType: "homestay",
      homestayId: Number(id),
      checkIn: checkIn || new Date().toISOString(),
      checkOut: checkOut || new Date(Date.now() + nights * 86400000).toISOString(),
      guests,
    }),
    onSuccess: (res) => router.push(`/bookings/${res.data.data.id}/payment`),
    onError: () => { if (!isAuthenticated) router.push("/login"); },
  });

  if (isLoading) {
    return (
      <>
        <Navbar />
        <div style={{ paddingTop: 70 }}>
          <div className="skeleton" style={{ height: 480 }} />
        </div>
      </>
    );
  }

  if (!data) return null;
  const hs = data;
  const price = Number(hs.pricePerNight);
  const total = price * nights * guests;

  // Parse amenities
  let amenities: string[] = [];
  if (Array.isArray(hs.amenities)) amenities = hs.amenities;
  else if (typeof hs.amenities === "string") {
    try { amenities = JSON.parse(hs.amenities); } catch {}
  }

  const AMENITY_ICONS: Record<string, string> = {
    wifi: "📶", "mountain view": "🏔️", breakfast: "🍳", fireplace: "🔥",
    "hot tub": "🛁", yoga: "🧘", "live music": "🎵", "local food": "🍜",
    "farm tour": "🌿", "cloud view": "☁️",
  };

  const getAmenityIcon = (amenity: string) => {
    const lower = amenity.toLowerCase();
    for (const [key, icon] of Object.entries(AMENITY_ICONS)) {
      if (lower.includes(key)) return icon;
    }
    return "✦";
  };

  return (
    <>
      <Navbar />
      <main style={{ paddingTop: 70 }}>
        {/* Hero Images */}
        <div style={{ position: "relative", height: 500, overflow: "hidden" }}>
          {hs.coverImage
            ? <img src={hs.coverImage} alt={hs.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            : <div style={{ width: "100%", height: "100%", background: "linear-gradient(135deg, var(--midnight), var(--amber))" }} />
          }
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(20,13,31,1) 0%, rgba(0,0,0,0.3) 70%, transparent 100%)" }} />

          {/* Breadcrumb */}
          <div style={{ position: "absolute", bottom: 48, left: 0, right: 0, maxWidth: 1280, margin: "0 auto", padding: "0 40px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12, fontSize: 13, color: "rgba(255,255,255,0.6)" }}>
              <Link href="/" style={{ color: "inherit", textDecoration: "none" }}>Trang chủ</Link>
              <ChevronRight size={14} />
              <Link href="/homestays" style={{ color: "inherit", textDecoration: "none" }}>Homestay</Link>
              <ChevronRight size={14} />
              <span style={{ color: "#fff" }}>{hs.name}</span>
            </div>
            {hs.featured && <span className="badge badge-amber" style={{ marginBottom: 12 }}>⭐ Superhost</span>}
            <h1 style={{ fontFamily: "var(--font-serif)", fontSize: "clamp(32px, 4vw, 60px)", fontWeight: 900, lineHeight: 1.1, marginBottom: 16 }}>
              {hs.name}
            </h1>
            <div style={{ display: "flex", gap: 20, flexWrap: "wrap" }}>
              <span style={{ display: "flex", alignItems: "center", gap: 6, color: "rgba(255,255,255,0.7)" }}>
                <MapPin size={16} style={{ color: "var(--amber)" }} />
                {hs.destination?.nameVi}, {hs.destination?.province}
              </span>
              <span style={{ display: "flex", alignItems: "center", gap: 6, color: "rgba(255,255,255,0.7)" }}>
                <Users size={16} style={{ color: "var(--pink)" }} />
                Tối đa {hs.maxGuests} khách
              </span>
              {hs._count?.reviews > 0 && (
                <span style={{ display: "flex", alignItems: "center", gap: 6, color: "var(--amber)" }}>
                  <Star size={16} fill="currentColor" />
                  {hs._count.reviews} đánh giá
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Content */}
        <div style={{ maxWidth: 1280, margin: "0 auto", padding: "60px 40px", display: "grid", gridTemplateColumns: "1fr 380px", gap: 48, alignItems: "start" }}>
          {/* Left */}
          <div>
            {/* Description */}
            {hs.description && (
              <div style={{ marginBottom: 48 }}>
                <h2 style={{ fontFamily: "var(--font-serif)", fontSize: 28, fontWeight: 700, marginBottom: 20 }}>Về Homestay Này</h2>
                <p style={{ color: "var(--text)", fontSize: 16, lineHeight: 1.8 }}>{hs.description}</p>
              </div>
            )}

            {/* Amenities */}
            {amenities.length > 0 && (
              <div style={{ marginBottom: 48 }}>
                <h2 style={{ fontFamily: "var(--font-serif)", fontSize: 28, fontWeight: 700, marginBottom: 20 }}>Tiện Ích</h2>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 12 }}>
                  {amenities.map((a: string) => (
                    <div key={a} className="glass" style={{ borderRadius: 12, padding: "12px 16px", display: "flex", alignItems: "center", gap: 10 }}>
                      <span style={{ fontSize: 20 }}>{getAmenityIcon(a)}</span>
                      <span style={{ fontSize: 14, color: "rgba(255,255,255,0.8)" }}>{a}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* House Rules */}
            <div style={{ marginBottom: 48 }}>
              <h2 style={{ fontFamily: "var(--font-serif)", fontSize: 28, fontWeight: 700, marginBottom: 20 }}>Nội Quy</h2>
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {[
                  { icon: "🕐", rule: "Check-in: 14:00 — Check-out: 12:00" },
                  { icon: "🚭", rule: "Không hút thuốc trong phòng" },
                  { icon: "🐾", rule: "Không mang thú cưng" },
                  { icon: "🔕", rule: "Giờ yên tĩnh: 22:00 — 07:00" },
                  { icon: "🌿", rule: "Ủng hộ du lịch bền vững" },
                ].map(r => (
                  <div key={r.rule} style={{ display: "flex", alignItems: "center", gap: 12, fontSize: 15, color: "rgba(255,255,255,0.75)" }}>
                    <span>{r.icon}</span> {r.rule}
                  </div>
                ))}
              </div>
            </div>

            {/* Location info */}
            {hs.destination && (
              <div style={{ marginBottom: 48 }}>
                <h2 style={{ fontFamily: "var(--font-serif)", fontSize: 28, fontWeight: 700, marginBottom: 20 }}>Vị Trí</h2>
                <div className="glass" style={{ borderRadius: 20, padding: 24 }}>
                  <div style={{ display: "flex", gap: 16, marginBottom: 12 }}>
                    <MapPin size={20} style={{ color: "var(--amber)", flexShrink: 0 }} />
                    <div>
                      <div style={{ fontSize: 16, fontWeight: 600, color: "#fff", marginBottom: 4 }}>{hs.destination.nameVi}</div>
                      <div style={{ fontSize: 14, color: "var(--text)" }}>{hs.destination.province}</div>
                    </div>
                  </div>
                  <Link href={`/destinations/${hs.destination.slug}`} className="btn-ghost" style={{ padding: "8px 16px", fontSize: 13 }}>
                    Khám phá {hs.destination.nameVi} →
                  </Link>
                </div>
              </div>
            )}

            {/* Reviews */}
            {hs.reviews?.length > 0 && (
              <div>
                <h2 style={{ fontFamily: "var(--font-serif)", fontSize: 28, fontWeight: 700, marginBottom: 20 }}>
                  Đánh Giá ({hs.reviews.length})
                </h2>
                <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                  {hs.reviews.map((review: any) => (
                    <div key={review.id} className="glass" style={{ borderRadius: 16, padding: 20 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12, alignItems: "center" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                          <div style={{ width: 36, height: 36, borderRadius: "50%", background: "linear-gradient(135deg, var(--pink), var(--amber))", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, color: "#000", fontSize: 14 }}>
                            {review.user?.name?.[0]}
                          </div>
                          <span style={{ fontWeight: 600, color: "#fff" }}>{review.user?.name}</span>
                        </div>
                        <div style={{ display: "flex", gap: 2 }}>
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
              {/* Price display */}
              <div style={{ marginBottom: 24 }}>
                <span style={{ fontSize: 13, color: "rgba(255,255,255,0.5)" }}>Giá từ</span>
                <div style={{ display: "flex", alignItems: "baseline", gap: 8, marginTop: 4 }}>
                  <span style={{ fontFamily: "var(--font-serif)", fontSize: 38, fontWeight: 900, color: "var(--amber)" }}>
                    {price.toLocaleString("vi-VN")}₫
                  </span>
                  <span style={{ color: "rgba(255,255,255,0.5)", fontSize: 14 }}>/đêm/phòng</span>
                </div>
              </div>

              {/* Check-in / Check-out */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 16 }}>
                <div>
                  <label style={{ fontSize: 11, fontWeight: 600, color: "var(--pink)", textTransform: "uppercase", letterSpacing: "0.08em", display: "block", marginBottom: 6 }}>
                    Nhận phòng
                  </label>
                  <input type="date" value={checkIn} min={new Date().toISOString().split("T")[0]}
                    onChange={e => { setCheckIn(e.target.value); setNights(calcNights(e.target.value, checkOut)); }}
                    className="input" style={{ fontSize: 14, padding: "10px 12px" }} />
                </div>
                <div>
                  <label style={{ fontSize: 11, fontWeight: 600, color: "var(--pink)", textTransform: "uppercase", letterSpacing: "0.08em", display: "block", marginBottom: 6 }}>
                    Trả phòng
                  </label>
                  <input type="date" value={checkOut} min={checkIn || new Date().toISOString().split("T")[0]}
                    onChange={e => { setCheckOut(e.target.value); setNights(calcNights(checkIn, e.target.value)); }}
                    className="input" style={{ fontSize: 14, padding: "10px 12px" }} />
                </div>
              </div>

              {/* Guests */}
              <div style={{ marginBottom: 20 }}>
                <label style={{ fontSize: 11, fontWeight: 600, color: "var(--pink)", textTransform: "uppercase", letterSpacing: "0.08em", display: "block", marginBottom: 8 }}>
                  Số Khách
                </label>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <button onClick={() => setGuests(Math.max(1, guests - 1))} style={{ width: 36, height: 36, borderRadius: 10, border: "1px solid var(--glass-border)", background: "transparent", color: "#fff", cursor: "pointer", fontSize: 18 }}>−</button>
                  <span style={{ fontSize: 18, fontWeight: 700, flex: 1, textAlign: "center" }}>{guests}</span>
                  <button onClick={() => setGuests(Math.min(hs.maxGuests, guests + 1))} style={{ width: 36, height: 36, borderRadius: 10, border: "1px solid var(--glass-border)", background: "transparent", color: "#fff", cursor: "pointer", fontSize: 18 }}>+</button>
                </div>
              </div>

              {/* Price breakdown */}
              <div style={{ borderTop: "1px solid var(--glass-border)", paddingTop: 16, marginBottom: 20 }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8, fontSize: 14 }}>
                  <span style={{ color: "var(--text)" }}>{price.toLocaleString("vi-VN")} × {nights} đêm × {guests} khách</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ color: "var(--text)", fontSize: 15 }}>Tổng</span>
                  <span style={{ fontSize: 22, fontWeight: 700, color: "var(--amber)" }}>{total.toLocaleString("vi-VN")}₫</span>
                </div>
              </div>

              <button
                onClick={() => bookMutation.mutate()}
                disabled={bookMutation.isPending}
                className="btn-primary"
                style={{ width: "100%", justifyContent: "center", fontSize: 16, padding: "14px", opacity: bookMutation.isPending ? 0.7 : 1 }}
              >
                {bookMutation.isPending ? "Đang xử lý..." : isAuthenticated ? "Đặt Phòng Ngay ✦" : "Đăng nhập để đặt"}
              </button>
              <p style={{ textAlign: "center", fontSize: 12, color: "rgba(255,255,255,0.4)", marginTop: 12 }}>
                Miễn phí huỷ trong 24 giờ · Thanh toán an toàn
              </p>
            </div>

            {/* Host info */}
            {hs.host && (
              <div className="glass" style={{ borderRadius: 20, padding: 24, marginTop: 16 }}>
                <h3 style={{ fontFamily: "var(--font-serif)", fontSize: 18, fontWeight: 700, marginBottom: 12 }}>Chủ Homestay</h3>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <div style={{ width: 48, height: 48, borderRadius: "50%", background: "linear-gradient(135deg, var(--pink), var(--amber))", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: 18, color: "#000" }}>
                    {hs.host.name?.[0]}
                  </div>
                  <div>
                    <div style={{ fontWeight: 600, color: "#fff" }}>{hs.host.name}</div>
                    <div style={{ fontSize: 13, color: "var(--text)" }}>Host EthnoDiscovery</div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
