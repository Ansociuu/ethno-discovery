"use client";
import { useEffect, useRef, useState } from "react";

const STATS = [
  { num: 20, suffix: "+", label: "Villages Supported" },
  { num: 300, suffix: "+", label: "Local Hosts" },
  { num: 5000, suffix: "+", label: "Happy Travelers", display: "5K+" },
  { num: 49, suffix: "★", label: "Average Rating", display: "4.9★" },
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
        }, 2000 / steps);
      }
    }, { threshold: 0.5 });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [target]);

  if (display) return <div ref={ref}>{display}</div>;
  return <div ref={ref}>{count}{suffix}</div>;
}

export function StatsSection() {
  return (
    <div style={{
      background: "linear-gradient(135deg, rgba(255,60,172,0.08), rgba(255,214,10,0.08))",
      borderTop: "1px solid rgba(255,255,255,0.06)",
      borderBottom: "1px solid rgba(255,255,255,0.06)",
      padding: "80px 40px", margin: 0, maxWidth: "100%",
    }}>
      <div style={{ maxWidth: 1280, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 40, textAlign: "center" }}>
        {STATS.map((stat) => (
          <div key={stat.label} className="fade-up">
            <div style={{
              fontFamily: "var(--font-serif)", fontSize: 56, fontWeight: 900,
              lineHeight: 1, marginBottom: 8,
              background: "linear-gradient(135deg, var(--pink), var(--amber))",
              WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
            }}>
              <AnimatedNumber target={stat.num} suffix={stat.suffix} display={stat.display} />
            </div>
            <div style={{ fontSize: 14, color: "var(--text)", fontWeight: 500, letterSpacing: "0.04em" }}>
              {stat.label}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
