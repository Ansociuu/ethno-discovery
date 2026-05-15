"use client";
import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { 
  Clock, 
  Users, 
  Star, 
  MapPin, 
  ChevronRight, 
  Heart, 
  Share2, 
  Calendar,
  Sparkles,
  CheckCircle,
  CreditCard,
  Plus,
  Minus,
  Info,
  ArrowLeft
} from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { toursApi, bookingsApi } from "@/lib/api";
import { useAuthStore } from "@/stores/auth.store";
import { StickyBookingBar } from "@/components/ui/StickyBookingBar";

export default function TourDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();

  const [guests, setGuests] = useState(2);
  const [checkIn, setCheckIn] = useState("");

  const { data, isLoading } = useQuery({
    queryKey: ["tour", id],
    queryFn: () => toursApi.getById(Number(id)).then(r => r.data.data),
  });

  const bookMutation = useMutation({
    mutationFn: () => bookingsApi.create({
      bookableType: "tour",
      tourId: Number(id),
      checkIn: checkIn || new Date().toISOString(),
      checkOut: new Date(Date.now() + (data?.durationDays || 3) * 86400000).toISOString(),
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
        <div className="pt-[70px]">
          <div className="skeleton h-[500px]" />
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
      <main className="pt-[70px]">
        {/* Hero Banner */}
        <div className="relative h-[550px] overflow-hidden">
          <img 
            src={tour.coverImage || '/placeholder.jpg'} 
            alt={tour.title} 
            className="w-full h-full object-cover animate-fade-up duration-1000"
          />
          <div className="absolute bottom-0 left-0 right-0 h-2/3 bg-gradient-to-t from-midnight via-midnight/60 to-transparent z-10" />
          
          <div className="absolute bottom-12 left-0 right-0 max-w-7xl mx-auto px-6 z-20 animate-fade-up">
            <div className="flex items-center gap-2 text-[10px] md:text-xs font-bold text-white/60 uppercase tracking-widest mb-6 bg-black/20 backdrop-blur-md w-fit px-3 py-1.5 rounded-full border border-white/10">
              <Link href="/" className="text-inherit no-underline hover:text-white transition-colors">Trang chủ</Link>
              <ChevronRight size={12} />
              <Link href="/tours" className="text-inherit no-underline hover:text-white transition-colors">Tours</Link>
              <ChevronRight size={12} />
              <span className="text-white truncate max-w-[150px] md:max-w-none">{tour.title}</span>
            </div>

            {tour.featured && (
              <div className="inline-flex items-center gap-2 bg-amber/20 backdrop-blur-md border border-amber/40 text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full text-amber mb-6">
                <Sparkles size={12} /> Tour Nổi Bật
              </div>
            )}

            <h1 className="font-serif text-[clamp(28px,5vw,60px)] font-black text-white leading-[1.1] mb-8 max-w-4xl text-shadow-lg">
              {tour.title}
            </h1>

            <div className="flex flex-wrap gap-8">
              <div className="flex items-center gap-2 text-white/70 font-bold">
                <MapPin size={18} className="text-pink" />
                {tour.destination?.nameVi}
              </div>
              <div className="flex items-center gap-2 text-white/70 font-bold">
                <Clock size={18} className="text-amber" />
                {tour.durationDays} ngày {tour.durationDays - 1} đêm
              </div>
              <div className="flex items-center gap-2 text-white/70 font-bold">
                <Users size={18} className="text-pink" />
                Tối đa {tour.maxGroupSize} người
              </div>
              {tour._count?.reviews > 0 && (
                <div className="flex items-center gap-2 text-amber font-bold">
                  <Star size={18} className="fill-amber" />
                  {tour._count.reviews} đánh giá
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Content Section */}
        <div className="max-w-7xl mx-auto px-6 py-16 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          {/* Left Column: Details */}
          <div className="lg:col-span-8 space-y-12">
            <div>
              <h2 className="font-serif text-3xl font-bold text-white mb-6 flex items-center gap-3">
                <Info size={24} className="text-pink" /> Tổng Quan Chuyến Đi
              </h2>
              <p className="text-white/60 text-lg leading-relaxed">{tour.description}</p>
            </div>

            {/* Highlights */}
            <div className="glass rounded-[32px] p-8 md:p-10">
              <h2 className="font-serif text-2xl font-bold text-white mb-8">Điểm Nhấn Hành Trình</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[
                  "Khám phá văn hóa H'Mông bản địa",
                  "Trekking qua những thửa ruộng bậc thang",
                  "Thưởng thức đặc sản vùng cao",
                  "Nghỉ đêm tại homestay kiến trúc cổ"
                ].map((h, i) => (
                  <div key={i} className="flex items-start gap-4 text-white/70">
                    <CheckCircle size={20} className="text-amber shrink-0 mt-1" />
                    <span className="font-medium">{h}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Itinerary */}
            <div>
              <h2 className="font-serif text-3xl font-bold text-white mb-8">Lịch Trình Chi Tiết</h2>
              <div className="space-y-6">
                {(() => {
                  let itineraryArray = [];
                  try {
                    itineraryArray = typeof tour.itinerary === 'string' ? JSON.parse(tour.itinerary || '[]') : (tour.itinerary || []);
                  } catch (e) {
                    itineraryArray = [];
                  }
                  
                  if (!Array.isArray(itineraryArray)) itineraryArray = [];

                  return itineraryArray.map((day: any, i: number) => (
                    <div key={i} className="relative pl-10 border-l border-white/10 pb-10 last:pb-0">
                      <div className="absolute left-[-8px] top-0 w-4 h-4 rounded-full bg-pink border-4 border-midnight" />
                      <div className="text-xs font-bold text-pink uppercase tracking-widest mb-2">Ngày {day.day || (i + 1)}</div>
                      <h4 className="text-xl font-bold text-white mb-3">{day.title || "Đang cập nhật..."}</h4>
                      <ul className="space-y-2">
                        {(day.activities && Array.isArray(day.activities) ? day.activities : []).map((act: string, j: number) => (
                          <li key={j} className="text-white/40 text-sm flex items-center gap-2">
                            <div className="w-1 h-1 rounded-full bg-white/20" /> {act}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ));
                })()}
              </div>
            </div>
          </div>

          {/* Right Column: Booking Widget */}
          <div className="lg:col-span-4 sticky top-24">
            <div className="glass rounded-[32px] p-8 border-white/10 shadow-2xl shadow-black/40">
              <div className="mb-8">
                <span className="text-xs font-bold text-white/30 uppercase tracking-widest">Giá mỗi khách</span>
                <div className="flex items-baseline gap-2 mt-2">
                  <span className="font-serif text-4xl font-black text-white">
                    {price.toLocaleString("vi-VN")}₫
                  </span>
                  <span className="text-white/30 text-sm">/ khách</span>
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-[10px] font-bold text-pink uppercase tracking-widest mb-4">Số lượng người</label>
                  <div className="flex items-center justify-between bg-white/5 border border-white/10 rounded-2xl p-2">
                    <button 
                      onClick={() => setGuests(Math.max(1, guests - 1))}
                      className="w-12 h-12 rounded-xl flex items-center justify-center text-white hover:bg-white/10 border-none bg-transparent cursor-pointer"
                    >
                      <Minus size={20} />
                    </button>
                    <span className="text-xl font-black text-white">{guests}</span>
                    <button 
                      onClick={() => setGuests(Math.min(tour.maxGroupSize, guests + 1))}
                      className="w-12 h-12 rounded-xl flex items-center justify-center text-white hover:bg-white/10 border-none bg-transparent cursor-pointer"
                    >
                      <Plus size={20} />
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-pink uppercase tracking-widest mb-4">Ngày khởi hành</label>
                  <div className="relative">
                    <Calendar size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" />
                    <input 
                      type="date" 
                      value={checkIn} 
                      onChange={e => setCheckIn(e.target.value)} 
                      className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-sm text-white outline-none focus:border-pink/50"
                    />
                  </div>
                </div>

                <div className="pt-6 border-t border-white/5">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-white/40">Tạm tính ({guests} khách)</span>
                    <span className="text-sm font-bold text-white">{total.toLocaleString("vi-VN")}₫</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-black text-white">Tổng cộng</span>
                    <span className="text-2xl font-black text-amber">{total.toLocaleString("vi-VN")}₫</span>
                  </div>
                </div>

                <button
                  onClick={() => bookMutation.mutate()}
                  disabled={bookMutation.isPending}
                  className="btn-primary w-full py-5 rounded-2xl justify-center font-black text-lg no-underline shadow-xl shadow-pink/30 hover:shadow-pink/50 disabled:opacity-50"
                >
                  {bookMutation.isPending ? "Đang xử lý..." : isAuthenticated ? "Đặt Tour Ngay" : "Đăng nhập để đặt"}
                </button>

                <div className="flex items-center justify-center gap-2 text-[10px] text-white/30 font-bold uppercase tracking-widest mt-4">
                  <CheckCircle size={12} className="text-green-500" /> Miễn phí huỷ trong 24 giờ
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <StickyBookingBar 
        price={price} 
        label={isAuthenticated ? "Đặt Tour Ngay" : "Đăng Nhập Để Đặt"} 
        onBook={() => bookMutation.mutate()} 
        isLoading={bookMutation.isPending}
      />
      
      <Footer />
    </>
  );
}
