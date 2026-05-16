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
    <section className="section-py bg-dark px-container overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <span className="section-tag mb-4">Traveler Stories</span>
        <h2 className="h2-fluid mb-16">
          Họ nói gì về <em className="text-pink not-italic italic">EthnoDiscovery</em>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {REVIEWS.map((review, i) => (
            <div
              key={review.name}
              className={`bg-white/5 border border-white/10 rounded-3xl p-8 hover:bg-white/10 hover:border-pink/30 transition-all duration-300 flex flex-col ${
                review.featured ? "md:col-span-2 lg:flex-row lg:items-start lg:gap-8" : "col-span-1"
              }`}
            >
              {review.featured && (
                <div 
                  style={{ background: review.avGradient, color: review.avColor }}
                  className="w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg shrink-0 mb-6 lg:mb-0"
                >
                  {review.initials}
                </div>
              )}

              <div className="flex-1">
                <div className="text-amber text-lg mb-4 tracking-widest">★★★★★</div>
                
                <p className="text-white/70 text-base md:text-lg leading-relaxed italic mb-8">
                  &ldquo;{review.text}&rdquo;
                </p>

                <div className="flex items-center gap-4 mt-auto">
                  {!review.featured && (
                    <div 
                      style={{ background: review.avGradient, color: review.avColor }}
                      className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm shrink-0"
                    >
                      {review.initials}
                    </div>
                  )}
                  <div>
                    <div className="text-sm font-bold text-white">{review.name}</div>
                    <div className="text-[12px] text-white/40">{review.from}</div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
