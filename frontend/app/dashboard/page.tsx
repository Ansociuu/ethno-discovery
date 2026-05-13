"use client";
import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Calendar, CreditCard, Heart, MapPin, Clock, ChevronRight, LogOut } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { bookingsApi } from "@/lib/api";
import { useAuthStore } from "@/stores/auth.store";

const STATUS_LABELS: Record<string, { label: string; color: string }> = {
  PENDING:   { label: "Chờ thanh toán", color: "var(--amber)" },
  CONFIRMED: { label: "Đã xác nhận",    color: "#10b981" },
  COMPLETED: { label: "Hoàn thành",     color: "rgba(255,255,255,0.5)" },
  CANCELLED: { label: "Đã huỷ",         color: "var(--pink)" },
};

export default function DashboardPage() {
  const router = useRouter();
  const { user, isAuthenticated, logout, fetchMe } = useAuthStore();

  useEffect(() => {
    if (!isAuthenticated) { router.replace("/login"); return; }
    fetchMe();
  }, [isAuthenticated]);

  const { data: bookingsData, isLoading } = useQuery({
    queryKey: ["my-bookings"],
    queryFn: () => bookingsApi.getMy({ limit: 5 }).then(r => r.data),
    enabled: isAuthenticated,
  });

  const bookings = bookingsData?.data || [];

  if (!isAuthenticated) return null;

  return (
    <>
      <Navbar />
      <main style={{ paddingTop: 70, minHeight: "100vh" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "48px 40px" }}>
          {/* Header */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 48, flexWrap: "wrap", gap: 16 }}>
            <div>
              <p style={{ color: "var(--text)", fontSize: 14, marginBottom: 6 }}>Xin chào 👋</p>
              <h1 style={{ fontFamily: "var(--font-serif)", fontSize: "clamp(28px, 4vw, 44px)", fontWeight: 700 }}>
                {user?.name}
              </h1>
              <p style={{ color: "var(--text)", fontSize: 14, marginTop: 6 }}>{user?.email}</p>
            </div>
            <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
              {user?.role === "ADMIN" && (
                <Link href="/admin" className="btn-ghost" style={{ padding: "10px 20px", fontSize: 14 }}>
                  Admin Panel ⚙️
                </Link>
              )}
              <button onClick={() => { logout(); router.push("/"); }} className="btn-ghost"
                style={{ padding: "10px 20px", fontSize: 14, display: "flex", alignItems: "center", gap: 8 }}>
                <LogOut size={16} /> Đăng xuất
              </button>
            </div>
          </div>

          {/* Quick Stats */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 16, marginBottom: 48 }}>
            {[
              { icon: "🗺", label: "Tổng Booking", value: bookingsData?.pagination?.total || 0, color: "var(--pink)" },
              { icon: "✅", label: "Đã Hoàn Thành", value: bookings.filter((b: any) => b.status === "COMPLETED").length, color: "#10b981" },
              { icon: "⏳", label: "Đang Chờ", value: bookings.filter((b: any) => b.status === "PENDING").length, color: "var(--amber)" },
              { icon: "❤️", label: "Yêu Thích", value: 0, color: "var(--pink)" },
            ].map(stat => (
              <div key={stat.label} className="glass" style={{ borderRadius: 20, padding: 24 }}>
                <div style={{ fontSize: 32, marginBottom: 12 }}>{stat.icon}</div>
                <div style={{ fontFamily: "var(--font-serif)", fontSize: 36, fontWeight: 700, color: stat.color }}>{stat.value}</div>
                <div style={{ color: "var(--text)", fontSize: 14, marginTop: 4 }}>{stat.label}</div>
              </div>
            ))}
          </div>

          {/* Bookings */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 24 }}>
            <div className="glass" style={{ borderRadius: 24, padding: 32 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
                <h2 style={{ fontFamily: "var(--font-serif)", fontSize: 24, fontWeight: 700 }}>Booking Gần Đây</h2>
                <Link href="/dashboard/bookings" style={{ color: "var(--pink)", textDecoration: "none", fontSize: 14, display: "flex", alignItems: "center", gap: 6 }}>
                  Xem tất cả <ChevronRight size={16} />
                </Link>
              </div>

              {isLoading ? (
                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                  {[...Array(3)].map((_, i) => <div key={i} className="skeleton" style={{ height: 80, borderRadius: 12 }} />)}
                </div>
              ) : bookings.length === 0 ? (
                <div style={{ textAlign: "center", padding: "48px 0", color: "var(--text)" }}>
                  <div style={{ fontSize: 48, marginBottom: 16 }}>🗺</div>
                  <p style={{ marginBottom: 20 }}>Bạn chưa có booking nào</p>
                  <Link href="/tours" className="btn-primary" style={{ fontSize: 14, padding: "10px 24px" }}>
                    Khám phá Tours
                  </Link>
                </div>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                  {bookings.map((booking: any) => {
                    const item = booking.tour || booking.homestay;
                    const status = STATUS_LABELS[booking.status] || { label: booking.status, color: "var(--text)" };
                    return (
                      <Link key={booking.id} href={`/bookings/${booking.id}`} style={{ textDecoration: "none" }}>
                        <div style={{
                          background: "rgba(255,255,255,0.04)", border: "1px solid var(--glass-border)",
                          borderRadius: 16, padding: "16px 20px",
                          display: "flex", justifyContent: "space-between", alignItems: "center", gap: 16,
                          transition: "background 0.2s",
                        }}
                          onMouseEnter={e => (e.currentTarget.style.background = "rgba(255,255,255,0.07)")}
                          onMouseLeave={e => (e.currentTarget.style.background = "rgba(255,255,255,0.04)")}>
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <h3 style={{ fontSize: 15, fontWeight: 600, color: "#fff", marginBottom: 4, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                              {item?.title || item?.name || `Booking #${booking.id}`}
                            </h3>
                            <div style={{ display: "flex", gap: 16, color: "var(--text)", fontSize: 13 }}>
                              <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
                                <Calendar size={13} /> {new Date(booking.checkIn).toLocaleDateString("vi-VN")}
                              </span>
                              <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
                                <CreditCard size={13} /> {Number(booking.totalPrice).toLocaleString("vi-VN")}₫
                              </span>
                            </div>
                          </div>
                          <span style={{ color: status.color, fontSize: 13, fontWeight: 600, whiteSpace: "nowrap" }}>
                            {status.label}
                          </span>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Quick Links */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 16, marginTop: 24 }}>
            {[
              { icon: "🗺", label: "Khám phá Tours", href: "/tours", color: "var(--pink)" },
              { icon: "🏠", label: "Homestay", href: "/homestays", color: "var(--amber)" },
              { icon: "✨", label: "AI Planner", href: "/ai-planner", color: "var(--amber)" },
              { icon: "🏔", label: "Điểm Đến", href: "/destinations", color: "var(--pink)" },
            ].map(link => (
              <Link key={link.href} href={link.href} style={{ textDecoration: "none" }}>
                <div className="glass" style={{ borderRadius: 16, padding: 20, textAlign: "center", transition: "transform 0.2s" }}
                  onMouseEnter={e => (e.currentTarget.style.transform = "translateY(-4px)")}
                  onMouseLeave={e => (e.currentTarget.style.transform = "")}>
                  <div style={{ fontSize: 32, marginBottom: 8 }}>{link.icon}</div>
                  <div style={{ fontSize: 14, color: link.color, fontWeight: 600 }}>{link.label}</div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
