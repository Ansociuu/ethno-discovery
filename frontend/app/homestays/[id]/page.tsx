"use client";
import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { 
  Users, 
  Star, 
  MapPin, 
  ChevronRight, 
  Calendar, 
  Heart, 
  Wifi, 
  Coffee, 
  Mountain,
  Clock,
  XCircle,
  Info,
  VolumeX,
  Leaf,
  Plus,
  Minus,
  CreditCard,
  ArrowRight,
  Smartphone,
  ShieldCheck,
  CheckCircle
} from "lucide-react";
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
      checkOut: new Date(Date.now() + nights * 86400000).toISOString(),
      guests,
    }),
    onSuccess: (res) => router.push(`/bookings/${res.data.data.id}/payment`),
    onError: () => { if (!isAuthenticated) router.push("/login"); },
  });

  if (isLoading) {
    return (
      <>
        <Navbar />
        <div className="pt-[70px]">
          <div className="skeleton h-[480px]" />
        </div>
      </>
    );
  }

  if (!data) return null;
  const hs = data;
  const price = Number(hs.pricePerNight);
  const total = price * nights * guests;

  let amenities: string[] = [];
  if (Array.isArray(hs.amenities)) amenities = hs.amenities;
  else if (typeof hs.amenities === "string") {
    try { amenities = JSON.parse(hs.amenities); } catch {}
  }

  const AMENITY_MAP: Record<string, any> = {
    wifi: { icon: Wifi, color: "text-blue-400" },
    mountain: { icon: Mountain, color: "text-pink" },
    breakfast: { icon: Coffee, color: "text-amber" },
    cloud: { icon: Mountain, color: "text-blue-300" },
    default: { icon: CheckCircle, color: "text-pink" }
  };

  const getAmenityConfig = (amenity: string) => {
    const lower = amenity.toLowerCase();
    if (lower.includes("wifi")) return AMENITY_MAP.wifi;
    if (lower.includes("view") || lower.includes("núi")) return AMENITY_MAP.mountain;
    if (lower.includes("sáng") || lower.includes("ăn")) return AMENITY_MAP.breakfast;
    return AMENITY_MAP.default;
  };

  return (
    <>
      <Navbar />
      <main className="pt-[70px]">
        {/* Hero Banner */}
        <div className="relative h-[550px] overflow-hidden">
          <img 
            src={hs.coverImage || '/placeholder.jpg'} 
            alt={hs.name} 
            className="w-full h-full object-cover animate-fade-up duration-1000"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-midnight via-midnight/40 to-transparent" />
          
          <div className="absolute bottom-16 left-0 right-0 max-w-7xl mx-auto px-6 animate-fade-up">
            <div className="flex items-center gap-2 text-xs font-bold text-white/40 uppercase tracking-widest mb-6">
              <Link href="/" className="text-inherit no-underline hover:text-white transition-colors">Trang chủ</Link>
              <ChevronRight size={14} />
              <Link href="/homestays" className="text-inherit no-underline hover:text-white transition-colors">Homestays</Link>
              <ChevronRight size={14} />
              <span className="text-white">{hs.name}</span>
            </div>

            {hs.featured && (
              <div className="inline-flex items-center gap-2 bg-amber/20 backdrop-blur-md border border-amber/40 text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full text-amber mb-6">
                <Star size={12} className="fill-amber" /> Superhost
              </div>
            )}

            <h1 className="font-serif text-[clamp(32px,5vw,60px)] font-black text-white leading-[1.1] mb-8 max-w-4xl">
              {hs.name}
            </h1>

            <div className="flex flex-wrap gap-8">
              <div className="flex items-center gap-2 text-white/70 font-bold">
                <MapPin size={18} className="text-amber" />
                {hs.destination?.nameVi}, {hs.destination?.province}
              </div>
              <div className="flex items-center gap-2 text-white/70 font-bold">
                <Users size={18} className="text-pink" />
                Tối đa {hs.maxGuests} khách
              </div>
              {hs._count?.reviews > 0 && (
                <div className="flex items-center gap-2 text-amber font-bold">
                  <Star size={18} className="fill-amber" />
                  {hs._count.reviews} đánh giá
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Content Section */}
        <div className="max-w-7xl mx-auto px-6 py-16 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          {/* Left Column */}
          <div className="lg:col-span-8 space-y-16">
            <div>
              <h2 className="font-serif text-3xl font-bold text-white mb-6 flex items-center gap-3">
                <Info size={24} className="text-pink" /> Trải Nghiệm Nghỉ Dưỡng
              </h2>
              <p className="text-white/60 text-lg leading-relaxed">{hs.description}</p>
            </div>

            {/* Amenities */}
            <div>
              <h2 className="font-serif text-2xl font-bold text-white mb-8">Tiện Nghi Có Sẵn</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {amenities.map((a, i) => {
                  const cfg = getAmenityConfig(a);
                  return (
                    <div key={i} className="glass p-4 rounded-2xl flex items-center gap-3 border-white/5 hover:bg-white/10 transition-colors">
                      <cfg.icon size={20} className={cfg.color} />
                      <span className="text-sm font-medium text-white/80">{a}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* House Rules */}
            <div className="glass rounded-[32px] p-8 md:p-10 border-white/5">
              <h2 className="font-serif text-2xl font-bold text-white mb-8">Nội Quy & Chính Sách</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-12">
                {[
                  { icon: Clock, label: "Check-in: 14:00 • Check-out: 12:00" },
                  { icon: XCircle, label: "Không hút thuốc trong phòng" },
                  { icon: Info, label: "Không mang theo thú cưng" },
                  { icon: VolumeX, label: "Giờ yên tĩnh: 22:00 - 07:00" },
                  { icon: Leaf, label: "Khuyến khích bảo vệ môi trường" },
                  { icon: ShieldCheck, label: "Bảo hiểm lưu trú cơ bản" },
                ].map((rule, i) => (
                  <div key={i} className="flex items-center gap-4 text-white/60 text-sm font-medium">
                    <rule.icon size={18} className="text-pink shrink-0" />
                    {rule.label}
                  </div>
                ))}
              </div>
            </div>

            {/* Location Section */}
            {hs.destination && (
              <div>
                <h2 className="font-serif text-2xl font-bold text-white mb-8">Vị Trí & Điểm Đến</h2>
                <div className="glass rounded-[32px] p-8 flex flex-col md:flex-row items-center gap-8 group">
                  <div className="w-full md:w-48 h-32 rounded-2xl overflow-hidden shrink-0">
                    <img src={hs.destination.coverImage} className="w-full h-full object-cover group-hover:scale-110 transition-transform" />
                  </div>
                  <div className="flex-1 text-center md:text-left">
                    <h4 className="text-xl font-bold text-white mb-2">{hs.destination.nameVi}</h4>
                    <p className="text-sm text-white/40 mb-6">{hs.destination.province}</p>
                    <Link href={`/destinations/${hs.destination.slug}`} className="btn-ghost py-2 px-6 no-underline text-xs inline-flex items-center gap-2 uppercase tracking-widest font-bold">
                      Khám phá khu vực <ArrowRight size={14} />
                    </Link>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Right Column: Booking Widget */}
          <div className="lg:col-span-4 sticky top-24">
            <div className="glass rounded-[32px] p-8 border-white/10 shadow-2xl shadow-black/40">
              <div className="mb-8">
                <span className="text-xs font-bold text-white/30 uppercase tracking-widest">Giá mỗi đêm</span>
                <div className="flex items-baseline gap-2 mt-2">
                  <span className="font-serif text-4xl font-black text-white">
                    {price.toLocaleString("vi-VN")}₫
                  </span>
                  <span className="text-white/30 text-sm">/ đêm</span>
                </div>
              </div>

              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold text-pink uppercase tracking-widest mb-3">Nhận phòng</label>
                    <input 
                      type="date" 
                      value={checkIn} 
                      min={new Date().toISOString().split("T")[0]}
                      onChange={e => { setCheckIn(e.target.value); setNights(calcNights(e.target.value, checkOut)); }}
                      className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 px-4 text-xs text-white outline-none focus:border-amber/50"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-pink uppercase tracking-widest mb-3">Trả phòng</label>
                    <input 
                      type="date" 
                      value={checkOut} 
                      min={checkIn || new Date().toISOString().split("T")[0]}
                      onChange={e => { setCheckOut(e.target.value); setNights(calcNights(checkIn, e.target.value)); }}
                      className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 px-4 text-xs text-white outline-none focus:border-amber/50"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-pink uppercase tracking-widest mb-3">Số lượng khách</label>
                  <div className="flex items-center justify-between bg-white/5 border border-white/10 rounded-2xl p-2">
                    <button 
                      onClick={() => setGuests(Math.max(1, guests - 1))}
                      className="w-10 h-10 rounded-xl flex items-center justify-center text-white hover:bg-white/10 border-none bg-transparent cursor-pointer"
                    >
                      <Minus size={18} />
                    </button>
                    <span className="text-lg font-bold text-white">{guests}</span>
                    <button 
                      onClick={() => setGuests(Math.min(hs.maxGuests, guests + 1))}
                      className="w-10 h-10 rounded-xl flex items-center justify-center text-white hover:bg-white/10 border-none bg-transparent cursor-pointer"
                    >
                      <Plus size={18} />
                    </button>
                  </div>
                </div>

                <div className="pt-6 border-t border-white/5 space-y-2">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-white/40">{price.toLocaleString("vi-VN")} × {nights} đêm</span>
                    <span className="text-white font-bold">{(price * nights).toLocaleString("vi-VN")}₫</span>
                  </div>
                  <div className="flex justify-between items-center text-sm border-b border-white/5 pb-2">
                    <span className="text-white/40">Phí khách (x{guests})</span>
                    <span className="text-white font-bold">0₫</span>
                  </div>
                  <div className="flex justify-between items-center pt-2">
                    <span className="text-sm font-black text-white">Tổng số tiền</span>
                    <span className="text-2xl font-black text-amber">{total.toLocaleString("vi-VN")}₫</span>
                  </div>
                </div>

                <button
                  onClick={() => bookMutation.mutate()}
                  disabled={bookMutation.isPending}
                  className="btn-primary w-full py-5 rounded-2xl justify-center font-black text-lg no-underline shadow-xl shadow-pink/30 hover:shadow-pink/50 disabled:opacity-50"
                >
                  {bookMutation.isPending ? "Đang xử lý..." : isAuthenticated ? "Đặt Phòng Ngay" : "Đăng nhập để đặt"}
                </button>

                <div className="flex items-center justify-center gap-2 text-[10px] text-white/30 font-bold uppercase tracking-widest mt-4">
                  <Smartphone size={12} /> Xác nhận tức thì qua tin nhắn
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
