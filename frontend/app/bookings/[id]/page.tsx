"use client";
import { useQuery } from "@tanstack/react-query";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ChevronRight, Calendar, CreditCard, CheckCircle, Clock, XCircle, Copy } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { bookingsApi, paymentsApi } from "@/lib/api";
import { useState } from "react";

const STATUS_MAP: Record<string, { label: string; color: string; icon: any }> = {
  PENDING:   { label: "Chờ Thanh Toán", color: "var(--amber)",          icon: Clock },
  CONFIRMED: { label: "Đã Xác Nhận",    color: "#10b981",               icon: CheckCircle },
  COMPLETED: { label: "Hoàn Thành",     color: "rgba(255,255,255,0.5)", icon: CheckCircle },
  CANCELLED: { label: "Đã Huỷ",         color: "var(--pink)",           icon: XCircle },
};

export default function BookingDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [paying, setPaying] = useState(false);
  const [paymentData, setPaymentData] = useState<any>(null);
  const [copied, setCopied] = useState(false);

  const { data, isLoading } = useQuery({
    queryKey: ["booking", id],
    queryFn: () => bookingsApi.getById(Number(id)).then(r => r.data.data),
  });

  const handlePay = async () => {
    setPaying(true);
    try {
      const res = await paymentsApi.create(Number(id));
      setPaymentData(res.data.data);
    } catch (e: any) {
      alert(e.response?.data?.message || "Lỗi tạo thanh toán");
    } finally {
      setPaying(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (isLoading) {
    return (
      <>
        <Navbar />
        <main style={{ paddingTop: 70, minHeight: "100vh" }}>
          <div style={{ maxWidth: 800, margin: "80px auto", padding: "0 40px" }}>
            {[...Array(4)].map((_, i) => <div key={i} className="skeleton" style={{ height: 100, borderRadius: 16, marginBottom: 16 }} />)}
          </div>
        </main>
      </>
    );
  }

  if (!data) return null;
  const booking = data;
  const item = booking.tour || booking.homestay;
  const statusInfo = STATUS_MAP[booking.status] || STATUS_MAP.PENDING;
  const StatusIcon = statusInfo.icon;

  return (
    <>
      <Navbar />
      <main style={{ paddingTop: 70, minHeight: "100vh" }}>
        <div style={{ maxWidth: 800, margin: "0 auto", padding: "60px 40px" }}>
          {/* Breadcrumb */}
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 32, fontSize: 13, color: "rgba(255,255,255,0.5)" }}>
            <Link href="/dashboard" style={{ color: "inherit", textDecoration: "none" }}>Dashboard</Link>
            <ChevronRight size={14} />
            <span style={{ color: "#fff" }}>Booking #{booking.id}</span>
          </div>

          {/* Status Banner */}
          <div className="glass" style={{
            borderRadius: 20, padding: 28, marginBottom: 24,
            borderLeft: `4px solid ${statusInfo.color}`,
            display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 16,
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
              <StatusIcon size={28} style={{ color: statusInfo.color }} />
              <div>
                <div style={{ fontSize: 20, fontWeight: 700, color: "#fff" }}>{statusInfo.label}</div>
                <div style={{ fontSize: 13, color: "var(--text)" }}>Booking #{booking.id} · {new Date(booking.createdAt).toLocaleDateString("vi-VN")}</div>
              </div>
            </div>
            {booking.status === "PENDING" && (
              <button
                onClick={handlePay}
                disabled={paying}
                className="btn-primary"
                style={{ padding: "12px 28px", fontSize: 15 }}
              >
                {paying ? "Đang xử lý..." : "💳 Thanh Toán Ngay"}
              </button>
            )}
          </div>

          {/* SePay QR Payment Modal */}
          {paymentData && (
            <div className="glass" style={{ borderRadius: 20, padding: 32, marginBottom: 24, textAlign: "center" }}>
              <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(255,214,10,0.1)", border: "1px solid rgba(255,214,10,0.2)", padding: "8px 16px", borderRadius: 20, marginBottom: 20 }}>
                <div className="animate-pulse-dot" style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--amber)" }} />
                <span style={{ fontSize: 13, fontWeight: 600, color: "var(--amber)" }}>Chờ Thanh Toán · {Math.ceil(paymentData.expiredAt ? (new Date(paymentData.expiredAt).getTime() - Date.now()) / 60000 : 15)} phút</span>
              </div>

              <h2 style={{ fontFamily: "var(--font-serif)", fontSize: 24, marginBottom: 8 }}>Quét Mã QR Để Thanh Toán</h2>
              <p style={{ color: "var(--text)", marginBottom: 24 }}>Dùng app ngân hàng quét mã QR hoặc chuyển khoản thủ công</p>

              {/* QR Code */}
              {paymentData.qrCode ? (
                <img src={paymentData.qrCode} alt="QR Payment" style={{ width: 220, height: 220, borderRadius: 16, border: "4px solid var(--glass-border)", marginBottom: 24 }} />
              ) : (
                <div style={{ width: 220, height: 220, borderRadius: 16, border: "2px solid var(--glass-border)", margin: "0 auto 24px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 48 }}>
                  📱
                </div>
              )}

              {/* Transfer info */}
              <div style={{ maxWidth: 360, margin: "0 auto", textAlign: "left" }}>
                {[
                  { label: "Ngân hàng", value: paymentData.bankName || "MB Bank" },
                  { label: "Số tài khoản", value: paymentData.accountNumber || "N/A", copy: true },
                  { label: "Nội dung CK", value: paymentData.description || `ETHNO${booking.id}`, copy: true },
                  { label: "Số tiền", value: `${Number(booking.totalPrice).toLocaleString("vi-VN")}₫` },
                ].map(item => (
                  <div key={item.label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 0", borderBottom: "1px solid var(--glass-border)" }}>
                    <span style={{ fontSize: 13, color: "var(--text)" }}>{item.label}</span>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <span style={{ fontSize: 14, fontWeight: 600, color: "#fff" }}>{item.value}</span>
                      {item.copy && (
                        <button onClick={() => copyToClipboard(item.value)}
                          style={{ background: "none", border: "none", cursor: "pointer", color: "var(--pink)", padding: 2 }}>
                          <Copy size={14} />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
              {copied && <div style={{ marginTop: 12, color: "var(--amber)", fontSize: 13 }}>✓ Đã sao chép</div>}
              <p style={{ marginTop: 20, fontSize: 13, color: "var(--text)" }}>Hệ thống sẽ tự động xác nhận sau khi nhận được chuyển khoản</p>
            </div>
          )}

          {/* Booking Details */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 20 }}>
            {/* Item info */}
            <div className="glass" style={{ borderRadius: 20, padding: 24 }}>
              <h3 style={{ fontFamily: "var(--font-serif)", fontSize: 18, fontWeight: 700, marginBottom: 16 }}>
                {booking.tour ? "🗺 Tour" : "🏠 Homestay"}
              </h3>
              {item?.coverImage && (
                <img src={item.coverImage} alt={item.title || item.name} style={{ width: "100%", height: 140, objectFit: "cover", borderRadius: 12, marginBottom: 12 }} />
              )}
              <div style={{ fontWeight: 600, color: "#fff", marginBottom: 4 }}>{item?.title || item?.name}</div>
              {item?.destination && (
                <div style={{ fontSize: 13, color: "var(--text)" }}>📍 {item.destination.nameVi}</div>
              )}
            </div>

            {/* Booking info */}
            <div className="glass" style={{ borderRadius: 20, padding: 24 }}>
              <h3 style={{ fontFamily: "var(--font-serif)", fontSize: 18, fontWeight: 700, marginBottom: 16 }}>Chi Tiết</h3>
              {[
                { icon: Calendar, label: "Nhận phòng", value: new Date(booking.checkIn).toLocaleDateString("vi-VN") },
                { icon: Calendar, label: "Trả phòng", value: new Date(booking.checkOut).toLocaleDateString("vi-VN") },
                { icon: CreditCard, label: "Tổng tiền", value: `${Number(booking.totalPrice).toLocaleString("vi-VN")}₫` },
              ].map(item => (
                <div key={item.label} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
                  <item.icon size={16} style={{ color: "var(--pink)", flexShrink: 0 }} />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 12, color: "var(--text)" }}>{item.label}</div>
                    <div style={{ fontSize: 15, fontWeight: 600, color: "#fff" }}>{item.value}</div>
                  </div>
                </div>
              ))}

              {/* Payment status */}
              <div style={{ marginTop: 16, padding: "10px 14px", borderRadius: 10, background: booking.payment?.status === "PAID" ? "rgba(16,185,129,0.1)" : "rgba(255,214,10,0.1)", border: `1px solid ${booking.payment?.status === "PAID" ? "rgba(16,185,129,0.3)" : "rgba(255,214,10,0.3)"}` }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: booking.payment?.status === "PAID" ? "#10b981" : "var(--amber)" }}>
                  {booking.payment?.status === "PAID" ? "✓ Đã thanh toán" : "⏳ Chưa thanh toán"}
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div style={{ display: "flex", gap: 12 }}>
            <Link href="/dashboard" className="btn-ghost" style={{ padding: "12px 24px" }}>
              ← Về Dashboard
            </Link>
            {booking.status === "PENDING" && (
              <button onClick={() => bookingsApi.cancel(Number(id)).then(() => router.push("/dashboard"))}
                style={{ padding: "12px 24px", border: "1px solid var(--pink)", background: "transparent", color: "var(--pink)", borderRadius: 12, cursor: "pointer", fontSize: 14, fontWeight: 500 }}>
                Huỷ Booking
              </button>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
