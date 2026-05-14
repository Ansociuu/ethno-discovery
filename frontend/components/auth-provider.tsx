"use client";
import { useEffect, useState } from "react";
import { useAuthStore } from "@/stores/auth.store";
import { Loader2, Leaf } from "lucide-react";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { fetchMe, isLoading } = useAuthStore();
  const [isHydrated, setIsHydrated] = useState(false);

  // Handle Zustand hydration
  useEffect(() => {
    const initAuth = async () => {
      await fetchMe();
      setIsHydrated(true);
    };
    initAuth();
  }, [fetchMe]);

  if (!isHydrated) {
    return (
      <div className="fixed inset-0 bg-midnight flex flex-col items-center justify-center z-[9999]">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-pink to-amber flex items-center justify-center animate-pulse mb-6">
          <Leaf className="text-white w-8 h-8" />
        </div>
        <div className="flex items-center gap-3 text-white/50 font-medium">
          <Loader2 className="animate-spin text-pink" size={20} />
          <span>Khởi tạo EthnoDiscovery...</span>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
