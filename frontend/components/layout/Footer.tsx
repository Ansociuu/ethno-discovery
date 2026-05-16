"use client";
import Link from "next/link";
import { MapPin, Mail, Share2, ExternalLink, Send } from "lucide-react";

export function Footer() {
  return (
    <footer style={{
      background: "var(--dark)",
      borderTop: "1px solid var(--glass-border)",
      padding: "80px 40px 40px",
    }}>
      <div style={{ maxWidth: 1280, margin: "0 auto" }}>
        <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr", gap: 48, marginBottom: 60 }}>
          {/* Brand */}
          <div>
            <div style={{ fontFamily: "var(--font-serif)", fontSize: 24, fontWeight: 700, marginBottom: 16 }}>
              🌿 <span className="text-gradient">EthnoDiscovery</span>
            </div>
            <p style={{ color: "var(--text)", fontSize: 14, lineHeight: 1.7, maxWidth: 280 }}>
              Nền tảng du lịch văn hoá cao cấp, kết nối du khách với trải nghiệm bản địa cùng hai dân tộc H'Mông và Dao.
            </p>
            <div style={{ display: "flex", gap: 12, marginTop: 24 }}>
              {[Share2, ExternalLink, Send].map((Icon, i) => (
                <a key={i} href="#" style={{
                  width: 40, height: 40, borderRadius: 10,
                  background: "var(--glass)", border: "1px solid var(--glass-border)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  color: "rgba(255,255,255,0.6)", transition: "all 0.2s",
                }}
                  onMouseEnter={e => {
                    (e.currentTarget as HTMLElement).style.color = "#fff";
                    (e.currentTarget as HTMLElement).style.borderColor = "var(--pink)";
                  }}
                  onMouseLeave={e => {
                    (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.6)";
                    (e.currentTarget as HTMLElement).style.borderColor = "var(--glass-border)";
                  }}>
                  <Icon size={18} />
                </a>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {[
            { title: "Khám Phá", links: [["Điểm Đến", "/destinations"], ["Tours", "/tours"], ["Homestay", "/homestays"], ["AI Planner", "/ai-planner"]] },
            { title: "Tài Khoản", links: [["Đăng nhập", "/login"], ["Đăng ký", "/register"], ["Dashboard", "/dashboard"], ["Booking của tôi", "/dashboard/bookings"]] },
            { title: "Hỗ Trợ", links: [["Liên hệ", "/contact"], ["FAQ", "/faq"], ["Hoàn tiền", "/refund"], ["Điều khoản", "/terms"], ["Chính sách bảo mật", "/privacy"]] },
          ].map((col) => (
            <div key={col.title}>
              <h4 style={{ fontSize: 13, fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--pink)", marginBottom: 20 }}>
                {col.title}
              </h4>
              <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 12 }}>
                {col.links.map(([label, href]) => (
                  <li key={label}>
                    <Link href={href} style={{ color: "var(--text)", textDecoration: "none", fontSize: 14, transition: "color 0.2s" }}
                      onMouseEnter={e => (e.currentTarget.style.color = "#fff")}
                      onMouseLeave={e => (e.currentTarget.style.color = "var(--text)")}>
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Newsletter */}
        <div style={{
          background: "var(--glass)", border: "1px solid var(--glass-border)",
          borderRadius: 20, padding: "40px 48px",
          display: "flex", alignItems: "center", justifyContent: "space-between", gap: 32,
          marginBottom: 40, flexWrap: "wrap",
        }}>
          <div>
            <h3 style={{ fontFamily: "var(--font-serif)", fontSize: 24, marginBottom: 8 }}>Nhận ưu đãi độc quyền</h3>
            <p style={{ color: "var(--text)", fontSize: 14 }}>Đăng ký nhận bản tin về tour mới, deals và tips du lịch vùng cao.</p>
          </div>
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            <input className="input" type="email" placeholder="Email của bạn" style={{ width: 280 }} />
            <button className="btn-primary" style={{ padding: "12px 24px", fontSize: 14, display: "flex", alignItems: "center", gap: 8 }}>
              Đăng ký <Mail size={16} />
            </button>
          </div>
        </div>

        {/* Bottom */}
        <div style={{ borderTop: "1px solid var(--glass-border)", paddingTop: 24, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 16 }}>
          <p style={{ color: "var(--text)", fontSize: 13 }}>© 2026 EthnoDiscovery. All rights reserved.</p>
          <p style={{ color: "var(--text)", fontSize: 13, display: "flex", alignItems: "center", gap: 6 }}>
            <MapPin size={14} style={{ color: "var(--pink)" }} /> Hà Nội, Việt Nam
          </p>
        </div>
      </div>
    </footer>
  );
}
