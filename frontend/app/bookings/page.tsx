"use client";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Calendar, MapPin, CreditCard, Clock, CheckCircle, XCircle, ChevronRight, Plus } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { bookingsApi } from "@/lib/api";
import { useAuthStore } from "@/stores/auth.store";
import { useEffect } from "react";

const STATUS_CONFIG: Record<string, { label: string; color: string; bg: string; Icon: any }> = {
  PENDING:   { label: "Chờ Thanh Toán", color: "var(--amber)",  bg: "rgba(255,214,10,0.1)",  Icon: Clock },
  CONFIRMED: { label: "Đã Xác Nhận",    color: "#10b981",       bg: "rgba(16,185,129,0.1)",  Icon: CheckCircle },
  COMPLETED: { label: "Hoàn Thành",     color: "var(--text)",   bg: "rgba(255,255,255,0.05)", Icon: CheckCircle },
  CANCELLED: { label: "Đã Huỷ",         color: "var(--pink)",   bg: "rgba(255,60,172,0.1)",  Icon: XCircle },
};

export default function BookingsPage() {
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();

  useEffect(() => {
    if (!isAuthenticated) router.replace("/login");
  }, [isAuthenticated]);

  const { data, isLoading } = useQuery({
    queryKey: ["my-bookings"],
    queryFn: () => bookingsApi.getMy().then(r => r.data.data),
    enabled: isAuthenticated,
  });

  const bookings: any[] = data || [];

  return (
    <>
      <Navbar />
      <main style={{ paddingTop: 70, minHeight: "100vh" }}>
        <div style={{ maxWidth: 900, margin: "0 auto", padding: "60px 24px" }}>

          {/* Header */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 40, flexWrap: "wrap", gap: 16 }}>
            <div>
              <h1 style={{ fontFamily: "var(--font-serif)", fontSize: 36, fontWeight: 700, marginBottom: 8 }}>
                Booking Của Tôi
              </h1>
              <p style={{ color: "var(--text)" }}>
                {bookings.length > 0 ? `${bookings.length} đơn đặt chỗ` : "Chưa có đơn đặt chỗ nào"}
              </p>
            </div>
            <Link href="/tours" className="btn-primary" style={{ padding: "12px 24px", fontSize: 14, textDecoration: "none" }}>
              <Plus size={16} /> Đặt Tour Mới
            </Link>
          </div>

          {/* Filter tabs */}
          <div style={{ display: "flex", gap: 8, marginBottom: 32, flexWrap: "wrap" }}>
            {["Tất cả", "Chờ thanh toán", "Đã xác nhận", "Hoàn thành"].map(tab => (
              <button key={tab} style={{
                padding: "8px 18px", borderRadius: 20, border: "1px solid var(--glass-border)",
                background: tab === "Tất cả" ? "rgba(255,60,172,0.15)" : "var(--glass)",
                color: tab === "Tất cả" ? "var(--pink)" : "rgba(255,255,255,0.6)",
                fontSize: 13, fontWeight: 500, cursor: "pointer",
              }}>
                {tab}
              </button>
            ))}
          </div>

          {/* Loading */}
          {isLoading && (
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {[...Array(3)].map((_, i) => (
                <div key={i} className="skeleton" style={{ height: 130, borderRadius: 20 }} />
              ))}
            </div>
          )}

          {/* Empty state */}
          {!isLoading && bookings.length === 0 && (
            <div style={{ textAlign: "center", padding: "80px 0" }}>
              <div style={{ width: 80, height: 80, borderRadius: "50%", background: "rgba(255,60,172,0.1)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 24px" }}>
                <Calendar size={36} style={{ color: "var(--pink)" }} />
              </div>
              <h3 style={{ fontFamily: "var(--font-serif)", fontSize: 24, marginBottom: 12 }}>Chưa Có Đơn Đặt Chỗ</h3>
              <p style={{ color: "var(--text)", marginBottom: 32 }}>Hãy khám phá và đặt chuyến đi đầu tiên của bạn!</p>
              <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
                <Link href="/tours" className="btn-primary" style={{ textDecoration: "none" }}>Xem Tours</Link>
                <Link href="/homestays" className="btn-ghost" style={{ textDecoration: "none" }}>Xem Homestays</Link>
              </div>
            </div>
          )}

          {/* Booking list */}
          {!isLoading && bookings.length > 0 && (
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {bookings.map((booking: any) => {
                const item = booking.tour || booking.homestay;
                const cfg = STATUS_CONFIG[booking.status] || STATUS_CONFIG.PENDING;
                const nights = Math.round((new Date(booking.checkOut).getTime() - new Date(booking.checkIn).getTime()) / 86400000);

                return (
                  <Link key={booking.id} href={`/bookings/${booking.id}`} style={{ textDecoration: "none" }}>
                    <div className="glass" style={{ borderRadius: 20, padding: 0, overflow: "hidden", transition: "transform 0.2s, box-shadow 0.2s", cursor: "pointer" }}
                      onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = "translateY(-2px)"; (e.currentTarget as HTMLElement).style.boxShadow = "0 12px 40px rgba(0,0,0,0.3)"; }}
                      onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = ""; (e.currentTarget as HTMLElement).style.boxShadow = ""; }}>

                      {/* Status bar */}
                      <div style={{ background: cfg.bg, padding: "10px 24px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                          <cfg.Icon size={14} style={{ color: cfg.color }} />
                          <span style={{ fontSize: 13, fontWeight: 600, color: cfg.color }}>{cfg.label}</span>
                        </div>
                        <span style={{ fontSize: 12, color: "rgba(255,255,255,0.4)" }}>#{booking.id} · {new Date(booking.createdAt).toLocaleDateString("vi-VN")}</span>
                      </div>

                      {/* Content */}
                      <div style={{ padding: "20px 24px", display: "flex", alignItems: "center", gap: 16 }}>
                        {/* Image */}
                        {item?.coverImage && (
                          <img src={item.coverImage} alt={item.title || item.name}
                            style={{ width: 80, height: 80, objectFit: "cover", borderRadius: 12, flexShrink: 0 }} />
                        )}
                        {!item?.coverImage && (
                          <div style={{ width: 80, height: 80, borderRadius: 12, background: "rgba(255,60,172,0.1)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                            <MapPin size={28} style={{ color: "var(--pink)" }} />
                          </div>
                        )}

                        {/* Info */}
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontFamily: "var(--font-serif)", fontSize: 17, fontWeight: 700, color: "#fff", marginBottom: 6, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                            {item?.title || item?.name || "Đặt chỗ"}
                          </div>
                          <div style={{ display: "flex", flexWrap: "wrap", gap: 12, fontSize: 13, color: "var(--text)" }}>
                            <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
                              <Calendar size={12} />
                              {new Date(booking.checkIn).toLocaleDateString("vi-VN")} → {new Date(booking.checkOut).toLocaleDateString("vi-VN")}
                              {nights > 0 && ` (${nights} đêm)`}
                            </span>
                          </div>
                        </div>

                        {/* Price + action */}
                        <div style={{ textAlign: "right", flexShrink: 0 }}>
                          <div style={{ fontSize: 18, fontWeight: 700, color: "var(--amber)", marginBottom: 8 }}>
                            {Number(booking.totalPrice).toLocaleString("vi-VN")}₫
                          </div>
                          {booking.status === "PENDING" && (
                            <Link
                              href={`/bookings/${booking.id}/payment`}
                              onClick={e => e.stopPropagation()}
                              style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "8px 16px", background: "rgba(255,60,172,0.15)", border: "1px solid rgba(255,60,172,0.3)", borderRadius: 20, color: "var(--pink)", fontSize: 13, fontWeight: 600, textDecoration: "none" }}>
                              <CreditCard size={12} /> Thanh toán
                            </Link>
                          )}
                        </div>
                        <ChevronRight size={18} style={{ color: "rgba(255,255,255,0.3)", flexShrink: 0 }} />
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
