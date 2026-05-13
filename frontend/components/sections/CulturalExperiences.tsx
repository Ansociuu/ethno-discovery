"use client";
import Link from "next/link";

const EXPERIENCES = [
  { icon: "🏪", name: "Chợ Phiên H'Mông", desc: "Phiên chợ bản sắc mỗi cuối tuần, nơi giao thương và gặp gỡ văn hoá", tag: "Văn hoá", gradient: "linear-gradient(160deg, var(--bg3), var(--pink))" },
  { icon: "🎨", name: "Nhuộm Chàm Truyền Thống", desc: "Tự tay nhuộm vải chàm theo phương pháp cổ truyền H'Mông hàng trăm năm", tag: "Thủ công", gradient: "linear-gradient(160deg, var(--dark), var(--amber))" },
  { icon: "🧵", name: "Dệt Vải Thổ Cẩm", desc: "Học dệt thổ cẩm từ những người phụ nữ H'Mông lành nghề nhất bản", tag: "Thủ công", gradient: "linear-gradient(160deg, var(--midnight), var(--pink))" },
  { icon: "🎵", name: "Đêm Nhạc Khèn", desc: "Nghe tiếng khèn H'Mông dưới trăng bên bếp lửa — âm nhạc thuần khiết nhất", tag: "Âm nhạc", gradient: "linear-gradient(160deg, var(--bg3), var(--amber))" },
  { icon: "🍜", name: "Ẩm Thực Bản Địa", desc: "Nấu và thưởng thức thắng cố, mèn mén, rượu ngô — hương vị Tây Bắc", tag: "Ẩm thực", gradient: "linear-gradient(160deg, var(--dark), var(--pink))" },
];

export function CulturalExperiences() {
  return (
    <section style={{ background: "var(--midnight)", margin: 0, maxWidth: "100%", padding: "100px 0" }}>
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 40px" }}>
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 60, flexWrap: "wrap", gap: 20 }}>
          <div>
            <span className="section-tag">🌺 Trải Nghiệm Văn Hoá</span>
            <h2 style={{ fontFamily: "var(--font-serif)", fontSize: "clamp(32px, 4vw, 52px)", fontWeight: 700, lineHeight: 1.1, margin: "12px 0" }}>
              Chạm Đến <span className="text-gradient-pink">Bản Sắc</span>
            </h2>
            <p style={{ color: "var(--text)", fontSize: 17, fontWeight: 300, maxWidth: 500, lineHeight: 1.7 }}>
              Không chỉ ngắm nhìn — mà thực sự sống trong văn hoá H&apos;Mông, Dao, Tày qua những hoạt động tay nghề độc đáo.
            </p>
          </div>
        </div>

        {/* Cards Grid with staggered layout */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(5, minmax(200px, 1fr))", gap: 16, overflowX: "auto", paddingBottom: 16 }}>
          {EXPERIENCES.map((exp, i) => (
            <div
              key={exp.name}
              style={{
                position: "relative",
                borderRadius: 20,
                overflow: "hidden",
                minHeight: 300,
                cursor: "pointer",
                transition: "transform 0.3s",
                background: exp.gradient,
                marginTop: i % 2 !== 0 ? 32 : 0,
              }}
              onMouseEnter={e => (e.currentTarget.style.transform = "scale(1.03)")}
              onMouseLeave={e => (e.currentTarget.style.transform = "")}
            >
              {/* Overlay */}
              <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,0.9) 0%, transparent 60%)" }} />

              {/* Icon */}
              <div style={{
                position: "absolute", top: 20, left: 20,
                width: 44, height: 44, borderRadius: 14,
                background: "rgba(255,255,255,0.12)", backdropFilter: "blur(8px)",
                display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22,
              }}>
                {exp.icon}
              </div>

              {/* Content */}
              <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: 20 }}>
                <h3 style={{ fontFamily: "var(--font-serif)", fontSize: 18, fontWeight: 700, marginBottom: 6, color: "#fff" }}>
                  {exp.name}
                </h3>
                <p style={{ fontSize: 13, color: "rgba(255,255,255,0.55)", lineHeight: 1.5, marginBottom: 8 }}>
                  {exp.desc}
                </p>
                <span className="badge badge-amber">{exp.tag}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
