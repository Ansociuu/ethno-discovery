"use client";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { 
  Users, 
  Map, 
  Compass, 
  BarChart3, 
  LogOut,
  Leaf,
  Home,
  ClipboardList
} from "lucide-react";
import { useAuthStore } from "@/stores/auth.store";
import { AuthGuard } from "@/components/auth-guard";

const NAV_ITEMS = [
  { href: "/admin", label: "Tổng quan", icon: BarChart3 },
  { href: "/admin/destinations", label: "Điểm đến", icon: Map },
  { href: "/admin/tours", label: "Quản lý Tours", icon: Compass },
  { href: "/admin/homestays", label: "Homestays", icon: Home },
  { href: "/admin/bookings", label: "Đơn đặt chỗ", icon: ClipboardList },
  { href: "/admin/users", label: "Người dùng", icon: Users },
];

export function AdminLayout({ children, title, subtitle }: { children: React.ReactNode, title?: string, subtitle?: string }) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, logout } = useAuthStore();

  return (
    <AuthGuard requireAdmin>
      <div className="flex min-h-screen bg-midnight">
        {/* Sidebar */}
        <aside className="w-64 bg-midnight/50 backdrop-blur-xl border-r border-white/5 flex flex-col fixed inset-y-0 z-50">
          <div className="p-8 border-b border-white/5">
            <Link href="/" className="flex items-center gap-3 no-underline">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-pink to-amber flex items-center justify-center shadow-lg shadow-pink/20">
                <Leaf className="text-white w-5 h-5" />
              </div>
              <span className="font-serif text-xl font-black text-white">Admin<span className="text-pink">Panel</span></span>
            </Link>
            <div className="text-[10px] font-bold text-white/30 uppercase tracking-[0.2em] mt-3">Quản trị viên</div>
          </div>

          <nav className="flex-1 p-4 space-y-1">
            {NAV_ITEMS.map(item => {
              const isActive = pathname === item.href || (item.href !== "/admin" && pathname?.startsWith(item.href));
              return (
                <Link 
                  key={item.href} 
                  href={item.href} 
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold no-underline transition-all ${
                    isActive ? "bg-pink/10 text-pink" : "text-white/50 hover:bg-white/5 hover:text-white"
                  }`}
                >
                  <item.icon size={18} /> {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="p-4 border-t border-white/5">
            <button onClick={() => { logout(); router.push("/"); }} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-white/30 text-sm font-bold bg-transparent border-none cursor-pointer hover:bg-white/5 hover:text-white transition-all">
              <LogOut size={18} /> Đăng xuất
            </button>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 ml-64 p-12 overflow-x-hidden">
          {(title || subtitle) && (
            <header className="mb-10">
              {title && <h1 className="font-serif text-4xl font-black text-white mb-2">{title}</h1>}
              {subtitle && <p className="text-white/40">{subtitle}</p>}
            </header>
          )}
          {children}
        </main>
      </div>
    </AuthGuard>
  );
}
