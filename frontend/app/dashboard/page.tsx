"use client";
import { useQuery } from "@tanstack/react-query";
import { 
  User, 
  MapPin, 
  Calendar, 
  Heart, 
  Sparkles, 
  Settings, 
  ChevronRight, 
  Clock, 
  CheckCircle,
  Package,
  Compass
} from "lucide-react";
import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { MobileTabBar } from "@/components/layout/MobileTabBar";
import { authApi, bookingsApi, wishlistApi, aiApi } from "@/lib/api";
import { useAuthStore } from "@/stores/auth.store";
import { AuthGuard } from "@/components/auth-guard";

export default function DashboardPage() {
  const { user, isAuthenticated } = useAuthStore();

  const { data: userData } = useQuery({
    queryKey: ["me"],
    queryFn: () => authApi.getMe().then(r => r.data.data),
    enabled: isAuthenticated
  });

  const { data: bookings } = useQuery({
    queryKey: ["my-bookings"],
    queryFn: () => bookingsApi.getMy({ limit: 3 }).then(r => r.data.data),
    enabled: isAuthenticated
  });

  const { data: aiTrips } = useQuery({
    queryKey: ["my-ai-trips"],
    queryFn: () => aiApi.getTrips().then(r => r.data.data),
    enabled: isAuthenticated
  });

  return (
    <AuthGuard>
      <Navbar />
      <main className="pt-[100px] min-h-screen pb-20">
        <div className="max-w-7xl mx-auto px-6">
          
          {/* Header Profile */}
          <section className="glass rounded-[32px] p-8 mb-12 flex flex-col md:flex-row items-center gap-8 animate-fade-up">
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-pink to-amber flex items-center justify-center text-4xl font-bold text-white shadow-xl shadow-pink/20">
              {user?.name?.[0]}
            </div>
            <div className="text-center md:text-left flex-1">
              <h1 className="font-serif text-4xl font-bold mb-2">{user?.name}</h1>
              <p className="text-text flex items-center justify-center md:justify-start gap-2">
                <User size={16} className="text-pink" />
                {user?.email} • Khách hàng hạng Vàng
              </p>
            </div>
            <div className="flex gap-4">
              <Link href="/profile" className="btn-ghost py-2 px-6 text-sm no-underline">
                <Settings size={16} /> Cài đặt
              </Link>
            </div>
          </section>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column: Stats & Bookings */}
            <div className="lg:col-span-2 space-y-8">
              
              {/* Quick Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { label: "Đã đặt", value: bookings?.length || 0, icon: Package, color: "text-pink" },
                  { label: "Yêu thích", value: "12", icon: Heart, color: "text-red-500" },
                  { label: "AI Trips", value: aiTrips?.length || 0, icon: Sparkles, color: "text-amber" },
                  { label: "Tours đi", value: "3", icon: Compass, color: "text-blue-400" },
                ].map((stat, i) => (
                  <div key={i} className="glass rounded-2xl p-6 text-center">
                    <stat.icon className={`${stat.color} mx-auto mb-2`} size={24} />
                    <div className="text-2xl font-bold">{stat.value}</div>
                    <div className="text-xs text-text uppercase tracking-wider font-semibold">{stat.label}</div>
                  </div>
                ))}
              </div>

              {/* Recent Bookings */}
              <div className="glass rounded-[32px] p-8">
                <div className="flex items-center justify-between mb-8">
                  <h2 className="font-serif text-2xl font-bold flex items-center gap-3">
                    <Calendar className="text-pink" />
                    Chuyến đi gần đây
                  </h2>
                  <Link href="/bookings" className="text-pink text-sm font-bold no-underline flex items-center gap-1">
                    Tất cả <ChevronRight size={16} />
                  </Link>
                </div>

                <div className="space-y-4">
                  {!bookings?.length ? (
                    <div className="text-center py-12 text-text">
                      Bạn chưa có chuyến đi nào. 
                      <Link href="/tours" className="text-pink block mt-2 no-underline font-bold">Khám phá ngay!</Link>
                    </div>
                  ) : (
                    bookings.map((booking: any) => (
                      <Link key={booking.id} href={`/bookings/${booking.id}`} className="block glass bg-white/5 border-glass-border rounded-2xl p-4 no-underline hover:bg-white/10 transition-all">
                        <div className="flex items-center gap-4">
                          <div className="w-16 h-16 rounded-xl overflow-hidden bg-white/10 flex-shrink-0">
                            <img src={booking.tour?.coverImage || booking.homestay?.coverImage} className="w-full h-full object-cover" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="font-bold text-white truncate">{booking.tour?.title || booking.homestay?.name}</h3>
                            <p className="text-xs text-text mb-0 flex items-center gap-2">
                              <MapPin size={12} /> {booking.tour?.destination?.nameVi}
                            </p>
                          </div>
                          <div className="text-right">
                            <div className={`text-[10px] font-bold px-2 py-1 rounded-full mb-1 inline-block ${
                              booking.status === 'CONFIRMED' ? 'bg-green-500/20 text-green-400' : 'bg-amber-500/20 text-amber-400'
                            }`}>
                              {booking.status}
                            </div>
                            <div className="text-sm font-bold text-white">
                              {Number(booking.totalPrice).toLocaleString()}đ
                            </div>
                          </div>
                        </div>
                      </Link>
                    ))
                  )}
                </div>
              </div>
            </div>

            {/* Right Column: AI Planner & Settings */}
            <div className="space-y-8">
              {/* AI Planner Promo */}
              <div className="glass rounded-[32px] p-8 bg-gradient-to-br from-pink/20 to-amber/10 border-pink/30 relative overflow-hidden group">
                <Sparkles className="absolute -right-4 -top-4 text-pink/20 w-32 h-32 group-hover:rotate-12 transition-transform" />
                <h3 className="font-serif text-2xl font-bold mb-4 relative z-10">Lên kế hoạch với AI</h3>
                <p className="text-text text-sm mb-6 relative z-10">Tạo lịch trình cá nhân hóa cho chuyến đi tiếp theo của bạn chỉ trong 30 giây.</p>
                <Link href="/ai-planner" className="btn-primary w-full justify-center no-underline relative z-10">
                  Thử ngay
                </Link>
              </div>

              {/* Saved AI Trips */}
              <div className="glass rounded-[32px] p-8">
                <h3 className="font-serif text-xl font-bold mb-6 flex items-center gap-2">
                  <Sparkles className="text-amber" size={20} />
                  AI Trips đã lưu
                </h3>
                <div className="space-y-4">
                  {!aiTrips?.length ? (
                    <p className="text-text text-sm text-center py-4">Chưa có lịch trình nào được lưu.</p>
                  ) : (
                    aiTrips.slice(0, 3).map((trip: any) => (
                      <div key={trip.id} className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-glass-border">
                        <div className="text-sm font-medium truncate pr-4">{trip.title}</div>
                        <ChevronRight size={16} className="text-text" />
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
      <MobileTabBar />
    </AuthGuard>
  );
}
