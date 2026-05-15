"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { 
  Users, 
  Map, 
  Compass, 
  Calendar, 
  TrendingUp, 
  DollarSign, 
  Settings, 
  BarChart3,
  ClipboardList,
  Home
} from "lucide-react";
import { useAuthStore } from "@/stores/auth.store";
import api from "@/lib/api";
import { AdminLayout } from "@/components/admin/AdminLayout";

function StatCard({ icon: Icon, label, value, sub, color }: any) {
  return (
    <div className="glass rounded-[24px] p-7 transition-all hover:scale-[1.02]">
      <div className="flex justify-between items-start mb-6">
        <div className="w-12 h-12 rounded-2xl flex items-center justify-center" style={{ background: `${color}18` }}>
          <Icon size={24} style={{ color }} />
        </div>
        {sub !== undefined && (
          <span className={`px-2 py-1 rounded-full text-[10px] font-bold ${sub >= 0 ? "bg-green-500/20 text-green-400" : "bg-pink/20 text-pink"}`}>
            {sub >= 0 ? "+" : ""}{sub}%
          </span>
        )}
      </div>
      <div className="font-serif text-3xl font-black text-white leading-none">{value}</div>
      <div className="text-xs text-white/40 uppercase tracking-widest font-bold mt-4">{label}</div>
    </div>
  );
}

export default function AdminDashboard() {
  const router = useRouter();
  const { user, isAuthenticated, logout } = useAuthStore();

  const { data: stats } = useQuery({
    queryKey: ["admin-stats"],
    queryFn: () => api.get("/admin/stats").then(r => r.data.data),
    enabled: isAuthenticated && user?.role === "ADMIN",
  });



  const QUICK_LINKS = [
    { title: "Quản lý Destinations", href: "/admin/destinations", icon: Map, count: stats?.totalDestinations, color: "var(--pink)" },
    { title: "Quản lý Tours", href: "/admin/tours", icon: Compass, count: stats?.totalTours, color: "var(--amber)" },
    { title: "Quản lý Homestays", href: "/admin/homestays", icon: Home, count: stats?.totalHomestays, color: "#10b981" },
    { title: "Quản lý Bookings", href: "/admin/bookings", icon: ClipboardList, count: stats?.totalBookings, color: "var(--pink)" },
    { title: "Quản lý Users", href: "/admin/users", icon: Users, count: stats?.totalUsers, color: "var(--amber)" },
    { title: "Cài đặt hệ thống", href: "/admin/settings", icon: Settings, color: "rgba(255,255,255,0.5)" },
  ];  return (
    <AdminLayout title="Bảng Điều Khiển" subtitle={`Chào mừng trở lại, ${user?.name}`}>
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <StatCard icon={DollarSign} label="Doanh thu tháng" value={stats?.monthlyRevenue ? `${(Number(stats.monthlyRevenue) / 1000000).toFixed(1)}M` : "0.0M"} sub={12} color="var(--amber)" />
          <StatCard icon={ClipboardList} label="Bookings mới" value={stats?.totalBookings || "0"} sub={8} color="var(--pink)" />
          <StatCard icon={Users} label="Người dùng" value={stats?.totalUsers || "0"} sub={15} color="#10b981" />
          <StatCard icon={Compass} label="Tours hoạt động" value={stats?.totalTours || "0"} color="var(--amber)" />
        </div>

        {/* Quick Management Links */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {QUICK_LINKS.map(item => (
            <Link key={item.href} href={item.href} className="glass rounded-[24px] p-8 no-underline group hover:scale-[1.02] hover:border-pink/30 transition-all">
              <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center mb-6 group-hover:bg-pink/10 transition-colors">
                <item.icon size={32} style={{ color: item.color }} />
              </div>
              <div className="font-serif text-lg font-bold text-white mb-1">{item.title}</div>
              {item.count !== undefined && (
                <div className="text-2xl font-black" style={{ color: item.color }}>{item.count}</div>
              )}
            </Link>
          ))}
        </div>

        {/* Recent Bookings Section */}
        <div className="glass rounded-[32px] p-10 mt-12">
          <div className="flex justify-between items-center mb-8">
            <h2 className="font-serif text-2xl font-bold text-white">Bookings Gần Đây</h2>
            <Link href="/admin/bookings" className="text-pink text-sm font-bold no-underline hover:underline">Xem tất cả →</Link>
          </div>
          
          {stats?.recentBookings?.length > 0 ? (
            <div className="space-y-4">
              {stats.recentBookings.map((b: any) => (
                <div key={b.id} className="flex justify-between items-center py-4 border-b border-white/5 last:border-0">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-white/40 font-bold text-xs">
                      #{b.id}
                    </div>
                    <div>
                      <div className="font-bold text-white">{b.user?.name}</div>
                      <div className="text-xs text-white/30">{new Date(b.createdAt).toLocaleDateString("vi-VN")}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-amber">{Number(b.totalPrice).toLocaleString("vi-VN")}₫</div>
                    <div className={`text-[10px] font-bold uppercase tracking-widest ${b.status === "CONFIRMED" ? "text-green-400" : "text-amber-400"}`}>
                      {b.status}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-white/20 font-medium">Chưa có dữ liệu đặt chỗ mới.</div>
          )}
        </div>
    </AdminLayout>
  );
}
