"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { Users, Map, Compass, Calendar, TrendingUp, DollarSign, Settings, BarChart3, LogOut } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { useAuthStore } from "@/stores/auth.store";
import api from "@/lib/api";

function StatCard({ icon: Icon, label, value, sub, color }: any) {
  return (
    <div className="glass" style={{ borderRadius: 20, padding: 28 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
        <div style={{ width: 48, height: 48, borderRadius: 14, background: `${color}18`, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Icon size={22} style={{ color }} />
        </div>
        {sub !== undefined && (
          <span className={`badge ${sub >= 0 ? "badge-green" : "badge-pink"}`}>
            {sub >= 0 ? "+" : ""}{sub}%
          </span>
        )}
      </div>
      <div style={{ fontFamily: "var(--font-serif)", fontSize: 36, fontWeight: 900, color: "#fff", lineHeight: 1 }}>{value}</div>
      <div style={{ fontSize: 14, color: "var(--text)", marginTop: 8 }}>{label}</div>
    </div>
  );
}

export default function AdminDashboard() {
  const router = useRouter();
  const { user, isAuthenticated, logout } = useAuthStore();

  useEffect(() => {
    if (!isAuthenticated) { router.replace("/login"); return; }
    if (user && user.role !== "ADMIN") { router.replace("/dashboard"); }
  }, [isAuthenticated, user]);

  const { data: stats } = useQuery({
    queryKey: ["admin-stats"],
    queryFn: () => api.get("/admin/stats").then(r => r.data.data),
    enabled: isAuthenticated && user?.role === "ADMIN",
  });

  if (!isAuthenticated || !user) return null;

  const NAV_ITEMS = [
    { href: "/admin", label: "Dashboard", icon: BarChart3 },
    { href: "/admin/destinations", label: "Destinations", icon: Map },
    { href: "/admin/tours", label: "Tours", icon: Compass },
    { href: "/admin/homestays", label: "Homestays", icon: Users },
    { href: "/admin/bookings", label: "Bookings", icon: Calendar },
    { href: "/admin/users", label: "Users", icon: Users },
  ];

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "var(--dark)" }}>
      {/* Sidebar */}
      <aside style={{
        width: 240, background: "var(--midnight)", borderRight: "1px solid var(--glass-border)",
        padding: "32px 0", display: "flex", flexDirection: "column", position: "fixed", top: 0, left: 0, bottom: 0, zIndex: 50,
      }}>
        {/* Logo */}
        <div style={{ padding: "0 24px 32px", borderBottom: "1px solid var(--glass-border)" }}>
          <div style={{ fontFamily: "var(--font-serif)", fontSize: 18, fontWeight: 700 }}>
            🌿 <span style={{ background: "linear-gradient(135deg, var(--pink), var(--amber))", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Admin Panel</span>
          </div>
          <div style={{ fontSize: 12, color: "var(--text)", marginTop: 4 }}>{user.email}</div>
        </div>

        {/* Nav links */}
        <nav style={{ flex: 1, padding: "24px 12px" }}>
          {NAV_ITEMS.map(item => (
            <Link key={item.href} href={item.href} style={{ textDecoration: "none" }}>
              <div style={{
                display: "flex", alignItems: "center", gap: 12, padding: "10px 12px", borderRadius: 12, marginBottom: 4,
                color: "rgba(255,255,255,0.6)", fontSize: 14, transition: "all 0.2s", cursor: "pointer",
              }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = "rgba(255,60,172,0.1)"; (e.currentTarget as HTMLElement).style.color = "var(--pink)"; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = ""; (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.6)"; }}>
                <item.icon size={18} /> {item.label}
              </div>
            </Link>
          ))}
        </nav>

        {/* Logout */}
        <div style={{ padding: "0 12px" }}>
          <button onClick={() => { logout(); router.push("/"); }}
            style={{ width: "100%", display: "flex", alignItems: "center", gap: 12, padding: "10px 12px", borderRadius: 12, background: "none", border: "none", color: "rgba(255,255,255,0.5)", fontSize: 14, cursor: "pointer" }}>
            <LogOut size={18} /> Đăng xuất
          </button>
        </div>
      </aside>

      {/* Main */}
      <main style={{ flex: 1, marginLeft: 240, padding: "40px" }}>
        {/* Header */}
        <div style={{ marginBottom: 40 }}>
          <h1 style={{ fontFamily: "var(--font-serif)", fontSize: 36, fontWeight: 700, marginBottom: 8 }}>
            Tổng Quan
          </h1>
          <p style={{ color: "var(--text)" }}>Chào mừng trở lại, {user.name} 👋</p>
        </div>

        {/* Stats Grid */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 20, marginBottom: 40 }}>
          <StatCard icon={DollarSign} label="Doanh thu tháng" value={stats?.monthlyRevenue ? `${(stats.monthlyRevenue / 1000000).toFixed(1)}M` : "—"} sub={12} color="var(--amber)" />
          <StatCard icon={Calendar} label="Bookings mới" value={stats?.totalBookings || "—"} sub={8} color="var(--pink)" />
          <StatCard icon={Users} label="Người dùng" value={stats?.totalUsers || "—"} sub={15} color="#10b981" />
          <StatCard icon={Compass} label="Tours hoạt động" value={stats?.totalTours || "—"} color="var(--amber)" />
        </div>

        {/* Quick Management Links */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20 }}>
          {[
            { title: "Quản lý Destinations", href: "/admin/destinations", icon: "🏔", count: stats?.totalDestinations, color: "var(--pink)" },
            { title: "Quản lý Tours", href: "/admin/tours", icon: "🗺", count: stats?.totalTours, color: "var(--amber)" },
            { title: "Quản lý Homestays", href: "/admin/homestays", icon: "🏠", count: stats?.totalHomestays, color: "#10b981" },
            { title: "Quản lý Bookings", href: "/admin/bookings", icon: "📋", count: stats?.totalBookings, color: "var(--pink)" },
            { title: "Quản lý Users", href: "/admin/users", icon: "👥", count: stats?.totalUsers, color: "var(--amber)" },
            { title: "Cài đặt hệ thống", href: "/admin/settings", icon: "⚙️", color: "rgba(255,255,255,0.5)" },
          ].map(item => (
            <Link key={item.href} href={item.href} style={{ textDecoration: "none" }}>
              <div className="glass" style={{ borderRadius: 20, padding: 28, transition: "all 0.2s", cursor: "pointer" }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = "translateY(-4px)"; (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,60,172,0.3)"; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = ""; (e.currentTarget as HTMLElement).style.borderColor = ""; }}>
                <div style={{ fontSize: 36, marginBottom: 12 }}>{item.icon}</div>
                <div style={{ fontFamily: "var(--font-serif)", fontSize: 18, fontWeight: 600, color: "#fff", marginBottom: 4 }}>{item.title}</div>
                {item.count !== undefined && (
                  <div style={{ fontSize: 24, fontWeight: 700, color: item.color }}>{item.count}</div>
                )}
              </div>
            </Link>
          ))}
        </div>

        {/* Recent Bookings would go here */}
        <div className="glass" style={{ borderRadius: 20, padding: 32, marginTop: 24 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
            <h2 style={{ fontFamily: "var(--font-serif)", fontSize: 22, fontWeight: 700 }}>Bookings Gần Đây</h2>
            <Link href="/admin/bookings" style={{ color: "var(--pink)", textDecoration: "none", fontSize: 14 }}>Xem tất cả →</Link>
          </div>
          {stats?.recentBookings?.length > 0 ? (
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {stats.recentBookings.map((b: any) => (
                <div key={b.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px 0", borderBottom: "1px solid var(--glass-border)" }}>
                  <div>
                    <div style={{ fontWeight: 600, color: "#fff" }}>#{b.id} — {b.user?.name}</div>
                    <div style={{ fontSize: 13, color: "var(--text)" }}>{new Date(b.createdAt).toLocaleDateString("vi-VN")}</div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div style={{ fontWeight: 600, color: "var(--amber)" }}>{Number(b.totalPrice).toLocaleString("vi-VN")}₫</div>
                    <div style={{ fontSize: 12, color: b.status === "CONFIRMED" ? "#10b981" : "var(--amber)" }}>{b.status}</div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ textAlign: "center", padding: "40px 0", color: "var(--text)" }}>Chưa có dữ liệu</div>
          )}
        </div>
      </main>
    </div>
  );
}
