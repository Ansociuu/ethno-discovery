"use client";
import { useParams, useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { CheckCircle, Clock, Copy, ArrowLeft, RefreshCw } from "lucide-react";
import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { bookingsApi, paymentsApi } from "@/lib/api";

export default function PaymentPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [payment, setPayment] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState<string | null>(null);
  const [checking, setChecking] = useState(false);

  const { data: bookingData } = useQuery({
    queryKey: ["booking", id],
    queryFn: () => bookingsApi.getById(Number(id)).then(r => r.data.data),
  });

  useEffect(() => {
    paymentsApi.create(Number(id))
      .then(r => setPayment(r.data.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [id]);

  const copy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopied(key);
    setTimeout(() => setCopied(null), 2000);
  };

  const checkStatus = async (silent = false) => {
    if (!payment?.orderCode) return;
    if (!silent) setChecking(true);
    try {
      const res = await paymentsApi.getStatus(payment.orderCode);
      if (res.data.data.status === "success") {
        router.push(`/bookings/${id}?paid=true`);
        return true;
      } else if (!silent) {
        alert("Chưa nhận được thanh toán. Vui lòng thử lại sau vài giây.");
      }
    } catch {
      return false;
    } finally {
      if (!silent) setChecking(false);
    }
    return false;
  };

  // Tự động kiểm tra trạng thái mỗi 5 giây
  useEffect(() => {
    if (!payment?.orderCode || payment.status === "success") return;

    const interval = setInterval(() => {
      checkStatus(true);
    }, 5000);

    return () => clearInterval(interval);
  }, [payment?.orderCode]);

  const booking = bookingData;
  const amount = Number(booking?.totalPrice || 0);

  if (loading) {
    return (
      <>
        <Navbar />
        <main style={{ paddingTop: 70, minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div style={{ textAlign: "center" }}>
            <div style={{ width: 48, height: 48, border: "3px solid var(--pink)", borderTopColor: "transparent", borderRadius: "50%", animation: "spin 0.8s linear infinite", margin: "0 auto 16px" }} />
            <p style={{ color: "var(--text)" }}>Đang tạo mã thanh toán...</p>
          </div>
        </main>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <main style={{ paddingTop: 70, minHeight: "100vh" }}>
        <div style={{ maxWidth: 560, margin: "0 auto", padding: "48px 24px" }}>

          {/* Header */}
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 32 }}>
            <Link href={`/bookings/${id}`} style={{ color: "rgba(255,255,255,0.5)", textDecoration: "none", display: "flex", alignItems: "center", gap: 6, fontSize: 14 }}>
              <ArrowLeft size={16} /> Quay lại
            </Link>
          </div>

          {/* Status badge */}
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(255,214,10,0.1)", border: "1px solid rgba(255,214,10,0.25)", padding: "6px 16px", borderRadius: 20, marginBottom: 24 }}>
            <div style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--amber)", animation: "pulse-dot 2s infinite" }} />
            <span style={{ fontSize: 13, fontWeight: 600, color: "var(--amber)" }}>Chờ Thanh Toán</span>
          </div>

          {/* Main card */}
          <div className="glass" style={{ borderRadius: 24, overflow: "hidden" }}>
            {/* QR Section */}
            <div style={{ background: "#fff", padding: 32, textAlign: "center" }}>
              {payment?.qrUrl ? (
                <img
                  src={payment.qrUrl}
                  alt="QR Thanh Toán"
                  style={{ width: 220, height: 220, margin: "0 auto", display: "block" }}
                  onError={e => { (e.target as HTMLImageElement).style.display = "none"; }}
                />
              ) : (
                <div style={{ width: 220, height: 220, background: "#f5f5f5", borderRadius: 12, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <span style={{ fontSize: 48 }}>📱</span>
                </div>
              )}
              <p style={{ color: "#666", fontSize: 13, marginTop: 12 }}>Quét bằng app ngân hàng bất kỳ</p>
            </div>

            {/* Transfer info */}
            <div style={{ padding: 28 }}>
              <h2 style={{ fontFamily: "var(--font-serif)", fontSize: 20, fontWeight: 700, marginBottom: 20, textAlign: "center" }}>
                Thông Tin Chuyển Khoản
              </h2>

              {[
                { label: "Ngân hàng", value: payment?.bankCode || "MB", key: "bank" },
                { label: "Số tài khoản", value: payment?.accountNumber || "—", key: "account", copy: true },
                { label: "Tên tài khoản", value: payment?.accountName || "—", key: "name" },
                { label: "Số tiền", value: `${amount.toLocaleString("vi-VN")}₫`, key: "amount" },
                { label: "Nội dung CK", value: payment?.description || `BOOKING${id}`, key: "desc", copy: true },
              ].map(item => (
                <div key={item.key} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 0", borderBottom: "1px solid var(--glass-border)" }}>
                  <span style={{ fontSize: 13, color: "var(--text)" }}>{item.label}</span>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{ fontSize: 14, fontWeight: 600, color: item.key === "amount" ? "var(--amber)" : "#fff" }}>
                      {item.value}
                    </span>
                    {item.copy && (
                      <button
                        onClick={() => copy(item.value, item.key)}
                        style={{ background: "none", border: "none", cursor: "pointer", padding: 4, color: copied === item.key ? "#10b981" : "var(--pink)", transition: "color 0.2s" }}
                        title="Sao chép"
                      >
                        {copied === item.key ? <CheckCircle size={14} /> : <Copy size={14} />}
                      </button>
                    )}
                  </div>
                </div>
              ))}

              {/* Timer */}
              {payment?.expiredAt && (
                <div style={{ marginTop: 16, padding: "10px 16px", borderRadius: 10, background: "rgba(255,214,10,0.08)", textAlign: "center" }}>
                  <Clock size={14} style={{ color: "var(--amber)", verticalAlign: "middle", marginRight: 6 }} />
                  <span style={{ fontSize: 13, color: "var(--amber)" }}>
                    Hết hạn: {new Date(payment.expiredAt).toLocaleTimeString("vi-VN")}
                  </span>
                </div>
              )}

              {/* Actions */}
              <div style={{ display: "flex", flexDirection: "column", gap: 12, marginTop: 24 }}>
                <button onClick={checkStatus} disabled={checking} className="btn-primary" style={{ width: "100%", justifyContent: "center" }}>
                  {checking
                    ? <><RefreshCw size={16} style={{ animation: "spin 0.8s linear infinite" }} /> Đang kiểm tra...</>
                    : <><CheckCircle size={16} /> Tôi Đã Chuyển Khoản</>
                  }
                </button>
                <Link href="/dashboard" className="btn-ghost" style={{ textAlign: "center", justifyContent: "center" }}>
                  Về Dashboard
                </Link>
              </div>

              <p style={{ textAlign: "center", fontSize: 12, color: "rgba(255,255,255,0.35)", marginTop: 16, display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
                <RefreshCw size={12} style={{ animation: "spin 2s linear infinite" }} /> Hệ thống đang tự động kiểm tra thanh toán...
              </p>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
