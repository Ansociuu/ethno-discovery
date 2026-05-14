"use client";
import { useQuery } from "@tanstack/react-query";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { 
  ChevronRight, 
  Calendar, 
  CreditCard, 
  CheckCircle, 
  Clock, 
  XCircle, 
  MapPin,
  ArrowLeft,
  Smartphone,
  Info,
  Compass,
  Home,
  Users,
  Wallet
} from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { bookingsApi } from "@/lib/api";

const STATUS_MAP: Record<string, { label: string; color: string; icon: any; bg: string }> = {
  PENDING:   { label: "Chờ Thanh Toán", color: "var(--amber)",          icon: Clock,       bg: "rgba(255,214,10,0.1)" },
  CONFIRMED: { label: "Đã Xác Nhận",    color: "#10b981",               icon: CheckCircle, bg: "rgba(16,185,129,0.1)" },
  COMPLETED: { label: "Hoàn Thành",     color: "rgba(255,255,255,0.5)", icon: CheckCircle, bg: "rgba(255,255,255,0.05)" },
  CANCELLED: { label: "Đã Huỷ",         color: "var(--pink)",           icon: XCircle,     bg: "rgba(255,60,172,0.1)" },
};

export default function BookingDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  const { data, isLoading } = useQuery({
    queryKey: ["booking", id],
    queryFn: () => bookingsApi.getById(Number(id)).then(r => r.data.data),
  });

  if (isLoading) {
    return (
      <>
        <Navbar />
        <main className="pt-[100px] min-h-screen">
          <div className="max-w-3xl mx-auto px-6">
            <div className="skeleton h-48 rounded-[32px] mb-8" />
            <div className="grid grid-cols-2 gap-6">
              <div className="skeleton h-64 rounded-[32px]" />
              <div className="skeleton h-64 rounded-[32px]" />
            </div>
          </div>
        </main>
      </>
    );
  }

  if (!data) return null;
  const booking = data;
  const item = booking.tour || booking.homestay;
  const statusInfo = STATUS_MAP[booking.status] || STATUS_MAP.PENDING;

  return (
    <>
      <Navbar />
      <main className="pt-[100px] min-h-screen pb-20">
        <div className="max-w-4xl mx-auto px-6">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-white/30 mb-8">
            <Link href="/dashboard" className="text-inherit no-underline hover:text-white transition-colors">Dashboard</Link>
            <ChevronRight size={14} />
            <span className="text-white/60">Booking #{booking.id}</span>
          </div>

          {/* Status Hero Card */}
          <section className="glass rounded-[32px] p-8 md:p-12 mb-8 relative overflow-hidden border-white/10" style={{ borderLeft: `6px solid ${statusInfo.color}` }}>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 relative z-10">
              <div className="flex items-center gap-6">
                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center ${statusInfo.bg}`}>
                  <statusInfo.icon size={32} style={{ color: statusInfo.color }} />
                </div>
                <div>
                  <h1 className="font-serif text-3xl font-black text-white mb-2">{statusInfo.label}</h1>
                  <p className="text-white/40 text-sm font-medium">Mã đơn hàng: #{booking.id} • {new Date(booking.createdAt).toLocaleDateString("vi-VN")}</p>
                </div>
              </div>
              
              {booking.status === "PENDING" && (
                <Link 
                  href={`/bookings/${id}/payment`}
                  className="btn-primary py-4 px-10 no-underline text-lg font-black shadow-xl shadow-pink/20 hover:scale-[1.02] transition-all"
                >
                  <CreditCard size={20} /> Thanh Toán Ngay
                </Link>
              )}
            </div>
          </section>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            {/* Left: Item Info */}
            <div className="glass rounded-[32px] p-8 border-white/5">
              <h3 className="font-serif text-xl font-bold text-white mb-6 flex items-center gap-3">
                {booking.tour ? <Compass size={20} className="text-pink" /> : <Home size={20} className="text-pink" />}
                {booking.tour ? "Thông Tin Tour" : "Thông Tin Homestay"}
              </h3>
              
              <div className="relative h-48 rounded-2xl overflow-hidden mb-6">
                <img 
                  src={item?.coverImage || '/placeholder.jpg'} 
                  alt={item?.title || item?.name} 
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-midnight/80 to-transparent" />
                <div className="absolute bottom-4 left-4">
                  <span className="flex items-center gap-1.5 text-xs font-bold text-white">
                    <MapPin size={14} className="text-pink" /> {item?.destination?.nameVi}
                  </span>
                </div>
              </div>

              <h4 className="text-xl font-bold text-white mb-2">{item?.title || item?.name}</h4>
              <p className="text-sm text-white/40 leading-relaxed line-clamp-3">
                {item?.description}
              </p>
            </div>

            {/* Right: Booking Details */}
            <div className="glass rounded-[32px] p-8 border-white/5">
              <h3 className="font-serif text-xl font-bold text-white mb-6 flex items-center gap-3">
                <Info size={20} className="text-amber" /> Chi Tiết Đặt Chỗ
              </h3>

              <div className="space-y-6">
                {[
                  { label: "Ngày nhận", value: new Date(booking.checkIn).toLocaleDateString("vi-VN"), icon: Calendar },
                  { label: "Ngày trả", value: new Date(booking.checkOut).toLocaleDateString("vi-VN"), icon: Calendar },
                  { label: "Số lượng khách", value: `${booking.guests} khách`, icon: Users },
                  { label: "Tổng chi phí", value: `${Number(booking.totalPrice).toLocaleString("vi-VN")}₫`, icon: Wallet, color: "text-amber" },
                ].map((row, i) => (
                  <div key={i} className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-white/30">
                      <row.icon size={18} />
                    </div>
                    <div>
                      <div className="text-[10px] font-bold text-white/30 uppercase tracking-widest">{row.label}</div>
                      <div className={`text-base font-bold ${row.color || "text-white"}`}>{row.value}</div>
                    </div>
                  </div>
                ))}

                <div className={`mt-4 p-4 rounded-2xl border flex items-center gap-3 ${
                  booking.paymentStatus === "PAID" 
                    ? "bg-green-500/10 border-green-500/20 text-green-400" 
                    : "bg-amber-500/10 border-amber-500/20 text-amber-400"
                }`}>
                  {booking.paymentStatus === "PAID" ? <CheckCircle size={18} /> : <Clock size={18} />}
                  <span className="text-sm font-bold uppercase tracking-wider">
                    {booking.paymentStatus === "PAID" ? "Đã Thanh Toán" : "Chờ Thanh Toán"}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="flex flex-wrap gap-4">
            <Link href="/dashboard" className="btn-ghost py-4 px-8 no-underline flex items-center gap-2">
              <ArrowLeft size={18} /> Quay lại Dashboard
            </Link>
            {booking.status === "PENDING" && (
              <button 
                onClick={() => {
                  if(confirm("Bạn có chắc muốn huỷ đơn đặt chỗ này?")) {
                    bookingsApi.cancel(Number(id)).then(() => router.push("/dashboard"));
                  }
                }}
                className="bg-transparent border border-white/10 text-white/30 hover:text-pink hover:border-pink/30 py-4 px-8 rounded-2xl text-sm font-bold transition-all cursor-pointer"
              >
                <XCircle size={18} /> Huỷ Booking
              </button>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
