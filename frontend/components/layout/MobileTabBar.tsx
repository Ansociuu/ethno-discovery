"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  Home, 
  Compass, 
  Sparkles, 
  Bed, 
  User
} from "lucide-react";

export function MobileTabBar() {
  const pathname = usePathname();

  const tabs = [
    { href: "/", label: "Trang chủ", icon: Home },
    { href: "/tours", label: "Trải nghiệm", icon: Compass },
    { href: "/ai-planner", label: "AI Planner", icon: Sparkles, isSpecial: true },
    { href: "/homestays", label: "Chỗ ở", icon: Bed },
    { href: "/dashboard", label: "Cá nhân", icon: User },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 w-full z-[100] md:hidden">
      {/* Background with blur */}
      <div className="absolute inset-0 bg-midnight/90 backdrop-blur-2xl border-t border-white/10" />
      
      <div className="relative flex items-center justify-around px-2 pb-safe pt-2">
        {tabs.map((tab) => {
          const isActive = pathname === tab.href;
          
          if (tab.isSpecial) {
            return (
              <Link
                key={tab.href}
                href={tab.href}
                className="flex-1 flex flex-col items-center -translate-y-3 transition-transform active:scale-95 group"
              >
                <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 shadow-2xl ${
                  isActive 
                    ? "bg-gradient-to-tr from-pink to-amber scale-110 shadow-pink/40" 
                    : "bg-gradient-to-tr from-pink/80 to-amber/80 group-hover:scale-105 shadow-pink/20"
                }`}>
                  <tab.icon size={22} strokeWidth={2.5} className="text-white animate-pulse-subtle" />
                </div>
                <span className={`text-[8px] font-dm font-semibold uppercase tracking-[0.05em] mt-1.5 transition-colors ${
                  isActive ? "text-amber" : "text-white/60"
                }`}>
                  AI Plan
                </span>
              </Link>
            );
          }

          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={`flex-1 flex flex-col items-center gap-1.5 py-2 transition-all active:scale-90 ${
                isActive ? "text-pink" : "text-white/40 hover:text-white/60"
              }`}
            >
              <div className={`transition-transform duration-300 ${isActive ? "scale-110" : ""}`}>
                <tab.icon size={20} strokeWidth={isActive ? 2.5 : 2} />
              </div>
              <span className="text-[8px] font-dm font-semibold uppercase tracking-[0.05em] whitespace-nowrap">
                {tab.label}
              </span>
              <div className={`w-1 h-1 rounded-full bg-pink transition-all duration-300 ${isActive ? "opacity-100 mt-0" : "opacity-0 mt-2"}`} />
            </Link>
          );
        })}
      </div>
    </div>
  );
}
