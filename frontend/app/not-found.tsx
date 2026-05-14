import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { Home, Search, Map } from "lucide-react";

export default function NotFound() {
  return (
    <>
      <Navbar />
      <main style={{ paddingTop: 70, minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ textAlign: "center", padding: "0 24px", maxWidth: 500 }}>
          {/* 404 visual */}
          <div style={{ position: "relative", display: "inline-block", marginBottom: 32 }}>
            <div style={{ fontSize: 120, fontFamily: "var(--font-serif)", fontWeight: 900, background: "linear-gradient(135deg, var(--pink), var(--amber))", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", lineHeight: 1 }}>
              404
            </div>
            <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", width: 200, height: 200, borderRadius: "50%", background: "radial-gradient(circle, rgba(255,60,172,0.08), transparent 70%)", pointerEvents: "none" }} />
          </div>

          <h1 style={{ fontFamily: "var(--font-serif)", fontSize: 28, fontWeight: 700, marginBottom: 12 }}>
            Trang Không Tìm Thấy
          </h1>
          <p style={{ color: "var(--text)", fontSize: 16, lineHeight: 1.7, marginBottom: 40 }}>
            Trang bạn đang tìm đã bị xoá, đổi tên hoặc chưa tồn tại. Hãy thử tìm kiếm hoặc quay về trang chủ.
          </p>

          <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
            <Link href="/" className="btn-primary" style={{ textDecoration: "none" }}>
              <Home size={16} /> Trang Chủ
            </Link>
            <Link href="/search" className="btn-ghost" style={{ textDecoration: "none" }}>
              <Search size={16} /> Tìm Kiếm
            </Link>
            <Link href="/tours" className="btn-ghost" style={{ textDecoration: "none" }}>
              <Map size={16} /> Xem Tours
            </Link>
          </div>
        </div>
      </main>
    </>
  );
}
