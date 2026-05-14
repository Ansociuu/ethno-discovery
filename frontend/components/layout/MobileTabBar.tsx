"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  Home, 
  Map, 
  Search, 
  Heart, 
  User,
  Compass
} from "lucide-react";

export function MobileTabBar() {
  const pathname = usePathname();

  const tabs = [
    { href: "/", label: "Trang chủ", icon: Home },
    { href: "/destinations", label: "Điểm đến", icon: Map },
    { href: "/search", label: "Tìm kiếm", icon: Search },
    { href: "/tours", label: "Tours", icon: Compass },
    { href: "/dashboard", label: "Cá nhân", icon: User },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 md:hidden flex items-center justify-around bg-midnight/80 backdrop-blur-xl border-t border-glass-border px-2 py-3 pb-safe">
      {tabs.map((tab) => {
        const isActive = pathname === tab.href;
        return (
          <Link
            key={tab.href}
            href={tab.href}
            className={`flex flex-col items-center gap-1 no-underline transition-all ${
              isActive ? "text-pink" : "text-text"
            }`}
          >
            <div className={`p-1 rounded-xl transition-all ${isActive ? "bg-pink/10" : ""}`}>
              <tab.icon size={22} strokeWidth={isActive ? 2.5 : 2} />
            </div>
            <span className="text-[10px] font-bold uppercase tracking-wider">
              {tab.label}
            </span>
            {isActive && (
              <div className="w-1 h-1 rounded-full bg-pink mt-0.5 animate-pulse" />
            )}
          </Link>
        );
      })}
    </div>
  );
}
