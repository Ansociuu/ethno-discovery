"use client";

const REVIEWS = [
  {
    name: "Sophie Martens",
    from: "🇧🇪 Brussels, Belgium · Sa Pa 7-day",
    initials: "S",
    avGradient: "linear-gradient(135deg, var(--pink), #E63946)",
    avColor: "#fff",
    text: "Best trip of my life. Waking up to terraced rice fields covered in morning mist, sharing meals with local families, learning to dye fabric with indigo — EthnoDiscovery made it all feel authentic, not touristy. The AI planner was shockingly accurate.",
    featured: true,
  },
  {
    name: "Yuki Tanaka",
    from: "🇯🇵 Tokyo, Japan · Bắc Hà 4-day",
    initials: "Y",
    avGradient: "linear-gradient(135deg, var(--amber), #fff)",
    avColor: "#000",
    text: "The H'Mông market at Bắc Hà was unlike anything I've seen. Our guide spoke 4 languages and knew every family there. 本当に素晴らしい体験でした。",
    featured: false,
  },
  {
    name: "Marcus Chen",
    from: "🇸🇬 Singapore · Hà Giang 5-day",
    initials: "M",
    avGradient: "linear-gradient(135deg, var(--pink), var(--amber))",
    avColor: "#000",
    text: "Ha Giang loop with AI-planned stops was perfection. Every homestay, every meal, every viewpoint was curated exactly to my style. Worth every penny.",
    featured: false,
  },
];

export function ReviewsSection() {
  return (
    <div style={{ padding: "100px 0", background: "var(--dark)" }}>
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 40px" }}>
        <span className="section-tag fade-up">Traveler Stories</span>
        <h2 className="fade-up" style={{ fontFamily: "var(--font-serif)", fontSize: "clamp(32px, 4vw, 52px)", fontWeight: 700, margin: "12px 0 60px", lineHeight: 1.1 }}>
          Họ nói gì về <em style={{ color: "var(--pink)", fontStyle: "italic" }}>EthnoDiscovery</em>
        </h2>

        {/* 3-col grid, first card spans 2 */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20 }}>
          {REVIEWS.map((review, i) => (
            <div
              key={review.name}
              style={{
                background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)",
                borderRadius: 20, padding: 28, transition: "all 0.3s",
                gridColumn: review.featured ? "span 2" : "span 1",
                display: review.featured ? "flex" : "block",
                gap: review.featured ? 24 : 0,
                alignItems: review.featured ? "flex-start" : "unset",
              }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.05)"; (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.12)"; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.03)"; (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.07)"; }}
            >
              {/* Avatar (only in featured, shown separately) */}
              {review.featured && (
                <div style={{ width: 42, height: 42, borderRadius: "50%", background: review.avGradient, color: review.avColor, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: 16, flexShrink: 0 }}>
                  {review.initials}
                </div>
              )}

              <div style={{ flex: 1 }}>
                {/* Stars */}
                <div style={{ color: "var(--amber)", fontSize: 18, marginBottom: 16, letterSpacing: 2 }}>★★★★★</div>

                {/* Text */}
                <p style={{ fontSize: 15, color: "rgba(255,255,255,0.7)", lineHeight: 1.7, marginBottom: 20, fontStyle: "italic" }}>
                  &ldquo;{review.text}&rdquo;
                </p>

                {/* Reviewer info */}
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  {!review.featured && (
                    <div style={{ width: 42, height: 42, borderRadius: "50%", background: review.avGradient, color: review.avColor, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: 16, flexShrink: 0 }}>
                      {review.initials}
                    </div>
                  )}
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 600, color: "#fff" }}>{review.name}</div>
                    <div style={{ fontSize: 12, color: "rgba(255,255,255,0.4)" }}>{review.from}</div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
