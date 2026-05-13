"use client";
import { usePathname } from "next/navigation";
import Link from "next/link";

const TABS = [
  { icon: "🏠", label: "Home",    href: "/" },
  { icon: "🧭", label: "Explore", href: "/destinations" },
  { icon: "🤖", label: "AI",      href: "/ai-planner" },
  { icon: "❤️", label: "Saved",   href: "/dashboard" },
  { icon: "👤", label: "Profile", href: "/dashboard" },
];

export function MobileTabBar() {
  const pathname = usePathname();

  return (
    <div style={{
      display: "none",
      position: "fixed",
      bottom: 0, left: 0, right: 0,
      zIndex: 1000,
      background: "rgba(20,13,31,0.95)",
      backdropFilter: "blur(20px)",
      borderTop: "1px solid rgba(255,255,255,0.08)",
      padding: "8px 0 20px",
      justifyContent: "space-around",
    }} className="mobile-tab-bar">
      {TABS.map((tab) => {
        const isActive = tab.href === "/" ? pathname === "/" : pathname.startsWith(tab.href);
        return (
          <Link key={tab.label} href={tab.href} style={{ textDecoration: "none" }}>
            <div style={{
              display: "flex", flexDirection: "column", alignItems: "center",
              gap: 4, fontSize: 10, fontWeight: 500,
              color: isActive ? "var(--pink)" : "rgba(255,255,255,0.4)",
              cursor: "pointer", padding: "4px 16px", transition: "color 0.2s",
            }}>
              <div style={{ fontSize: 22 }}>{tab.icon}</div>
              {tab.label}
            </div>
          </Link>
        );
      })}
    </div>
  );
}
