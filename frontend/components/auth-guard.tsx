"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/stores/auth.store";
import { Loader2 } from "lucide-react";

interface AuthGuardProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
}

export function AuthGuard({ children, requireAdmin = false }: AuthGuardProps) {
  const { isAuthenticated, user, isLoading } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated) {
        router.push("/login");
      } else if (requireAdmin && user?.role !== "ADMIN") {
        router.push("/");
      }
    }
  }, [isAuthenticated, user, isLoading, router, requireAdmin]);

  if (isLoading || !isAuthenticated || (requireAdmin && user?.role !== "ADMIN")) {
    return (
      <div className="min-h-screen bg-midnight flex items-center justify-center">
        <Loader2 className="animate-spin text-pink" size={40} />
      </div>
    );
  }

  return <>{children}</>;
}
