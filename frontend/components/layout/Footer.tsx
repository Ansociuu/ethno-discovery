"use client";
import Link from "next/link";
import { MapPin, Mail, Share2, ExternalLink, Send } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-dark border-t border-glass-border pt-20 pb-10 px-container">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-12 lg:gap-16 mb-16">
          {/* Brand */}
          <div className="lg:col-span-2">
            <div className="font-serif text-2xl font-bold mb-6 text-white">
              🌿 <span className="text-gradient">EthnoDiscovery</span>
            </div>
            <p className="text-text text-sm leading-relaxed max-w-sm">
              Nền tảng du lịch văn hoá cao cấp, kết nối du khách với trải nghiệm bản địa cùng hai dân tộc H&apos;Mông và Dao.
            </p>
            <div className="flex gap-4 mt-8">
              {[Share2, ExternalLink, Send].map((Icon, i) => (
                <a key={i} href="#" className="w-10 h-10 rounded-xl bg-glass border border-glass-border flex items-center justify-center text-white/60 hover:text-white hover:border-pink transition-all duration-300">
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
              <h4 className="text-[11px] font-bold tracking-widest uppercase text-pink mb-6">
                {col.title}
              </h4>
              <ul className="space-y-4">
                {col.links.map(([label, href]) => (
                  <li key={label}>
                    <Link href={href} className="text-text hover:text-white text-sm transition-colors no-underline">
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Newsletter */}
        <div className="bg-white/5 border border-glass-border rounded-3xl p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-8 mb-12">
          <div>
            <h3 className="font-serif text-2xl mb-2 text-white">Nhận ưu đãi độc quyền</h3>
            <p className="text-text text-sm">Đăng ký nhận bản tin về tour mới, deals và tips du lịch vùng cao.</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
            <input className="input w-full sm:w-72" type="email" placeholder="Email của bạn" />
            <button className="btn-primary py-3 px-8 text-sm flex items-center justify-center gap-2">
              Đăng ký <Mail size={16} />
            </button>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-glass-border pt-8 flex flex-col sm:sm:flex-row justify-between items-center gap-4 text-xs text-white/40 font-medium">
          <p>© 2026 EthnoDiscovery. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <p className="flex items-center gap-2">
              <MapPin size={14} className="text-pink" /> Hà Nội, Việt Nam
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
