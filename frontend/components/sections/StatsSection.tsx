"use client";
import { useEffect, useRef, useState } from "react";
import { 
  Users, 
  Home, 
  Star, 
  MapPin,
  Smile
} from "lucide-react";

const STATS = [
  { num: 20, suffix: "+", label: "Bản làng hỗ trợ", icon: MapPin },
  { num: 300, suffix: "+", label: "Đối tác bản địa", icon: Home },
  { num: 5000, suffix: "+", label: "Khách hàng hài lòng", display: "5K+", icon: Smile },
  { num: 49, suffix: "★", label: "Đánh giá trung bình", display: "4.9/5", icon: Star },
];

function AnimatedNumber({ target, suffix, display }: { target: number; suffix: string; display?: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const animated = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !animated.current) {
        animated.current = true;
        const steps = 60;
        const increment = target / steps;
        let current = 0;
        const timer = setInterval(() => {
          current += increment;
          if (current >= target) { setCount(target); clearInterval(timer); }
          else setCount(Math.floor(current));
        }, 1500 / steps);
      }
    }, { threshold: 0.1 });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [target]);

  return <div ref={ref} className="font-serif text-5xl md:text-7xl font-black bg-gradient-to-r from-pink to-amber bg-clip-text text-transparent">{display || `${count}${suffix}`}</div>;
}

export function StatsSection() {
  return (
    <div className="py-24 bg-white/5 border-y border-white/5 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 lg:grid-cols-4 gap-12 md:gap-16">
        {STATS.map((stat, i) => (
          <div key={i} className="text-center flex flex-col items-center gap-4 animate-fade-up">
            <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-pink mb-2">
              <stat.icon size={28} />
            </div>
            <AnimatedNumber target={stat.num} suffix={stat.suffix} display={stat.display} />
            <div className="text-xs md:text-sm text-white/40 font-bold uppercase tracking-[0.2em]">
              {stat.label}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
