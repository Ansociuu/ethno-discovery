"use client";
import Link from "next/link";
import { 
  Sparkles, 
  Brain, 
  Map, 
  MessageSquare, 
  Target, 
  Calendar, 
  Wallet,
  ArrowRight
} from "lucide-react";

const AI_FEATURES = [
  { icon: Brain, color: "bg-pink/20 text-pink", title: "Hiểu sở thích cá nhân", desc: "AI phân tích budget, thời gian, và vibe để gợi ý phù hợp nhất" },
  { icon: Map, color: "bg-amber/20 text-amber", title: "Tối ưu lộ trình", desc: "Kết hợp điểm đến, phương tiện, và thời điểm lý tưởng" },
  { icon: MessageSquare, color: "bg-blue-500/20 text-blue-400", title: "Chatbot 24/7", desc: "Hỗ trợ đa ngôn ngữ xuyên suốt hành trình của bạn" },
];

const TRAVEL_TYPES = ["Solo", "Couple", "Family", "Group"];
const VIBES = ["Văn hoá", "Adventure", "Chill", "Photography"];

export function AIPlannerTeaser() {
  return (
    <div className="fade-up relative overflow-hidden py-24 px-6 md:px-12 bg-midnight">
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[600px] bg-pink/5 blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center relative z-10">
        {/* Left Content */}
        <div className="animate-fade-up">
          <span className="section-tag">AI Journey Planner</span>
          <h2 className="font-serif text-[clamp(32px,5vw,56px)] font-black leading-tight mt-4">
            Lịch trình hoàn hảo —<br />
            <span className="italic text-gradient-amber">chỉ trong 30 giây</span>
          </h2>
          <p className="text-white/60 text-lg leading-relaxed mt-6 max-w-lg">
            AI thông minh thấu hiểu văn hóa, địa lý và sở thích cá nhân của bạn để kiến tạo những hành trình độc bản.
          </p>

          <div className="mt-12 space-y-4">
            {AI_FEATURES.map((feat, i) => (
              <div key={i} className="glass p-5 rounded-[20px] flex items-start gap-4 hover:bg-white/10 transition-colors">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${feat.color}`}>
                  <feat.icon size={24} />
                </div>
                <div>
                  <h4 className="text-white font-bold mb-1">{feat.title}</h4>
                  <p className="text-white/40 text-sm leading-snug">{feat.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Form Card */}
        <div className="glass p-8 md:p-10 rounded-[32px] border-white/10 relative group">
          <div className="absolute inset-0 bg-gradient-to-br from-pink/5 to-amber/5 opacity-0 group-hover:opacity-100 transition-opacity rounded-[32px]" />
          
          <div className="relative z-10">
            <div className="flex items-center gap-3 text-white font-bold text-xl mb-2">
              <Sparkles className="text-amber" size={24} />
              Tạo Lịch Trình Ngay
            </div>
            <p className="text-white/40 text-sm mb-10">Trả lời vài câu hỏi — AI sẽ làm phần còn lại.</p>

            {/* Travel Type */}
            <div className="mb-8">
              <label className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-white/50 mb-4">
                <Target size={14} className="text-pink" /> Bạn đi cùng ai?
              </label>
              <div className="flex flex-wrap gap-2">
                {TRAVEL_TYPES.map((t, i) => (
                  <button key={t} className={`px-5 py-2 rounded-full text-xs font-bold border transition-all ${
                    i === 0 ? "bg-pink/20 border-pink/40 text-pink" : "bg-white/5 border-white/10 text-white/60 hover:border-white/30"
                  }`}>
                    {t}
                  </button>
                ))}
              </div>
            </div>

            {/* Vibe */}
            <div className="mb-8">
              <label className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-white/50 mb-4">
                <Sparkles size={14} className="text-pink" /> Vibe chuyến đi?
              </label>
              <div className="flex flex-wrap gap-2">
                {VIBES.map((v, i) => (
                  <button key={v} className={`px-5 py-2 rounded-full text-xs font-bold border transition-all ${
                    i === 0 ? "bg-amber/20 border-amber/40 text-amber" : "bg-white/5 border-white/10 text-white/60 hover:border-white/30"
                  }`}>
                    {v}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
              <div>
                <label className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-white/50 mb-3">
                  <Calendar size={14} className="text-pink" /> Số ngày
                </label>
                <div className="text-xl font-bold text-white">5 ngày</div>
              </div>
              <div>
                <label className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-white/50 mb-3">
                  <Wallet size={14} className="text-pink" /> Ngân sách
                </label>
                <div className="text-xl font-bold text-white">~5,000,000đ</div>
              </div>
            </div>

            <Link href="/ai-planner" className="btn-primary w-full py-5 rounded-2xl justify-center font-black text-lg no-underline shadow-xl shadow-pink/30 hover:shadow-pink/50 transition-all">
              Bắt Đầu Ngay <ArrowRight size={20} />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
