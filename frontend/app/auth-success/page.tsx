"use client";
import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuthStore } from "@/stores/auth.store";
import { Loader2, Leaf } from "lucide-react";
import { toast } from "sonner";

export default function AuthSuccessPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { fetchMe } = useAuthStore();

  useEffect(() => {
    const accessToken = searchParams.get("accessToken");
    const refreshToken = searchParams.get("refreshToken");

    if (accessToken && refreshToken) {
      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("refreshToken", refreshToken);
      
      const completeAuth = async () => {
        try {
          await fetchMe();
          toast.success("Đăng nhập thành công!", { description: "Chào mừng bạn đến với EthnoDiscovery" });
          router.replace("/dashboard");
        } catch (err) {
          toast.error("Lỗi xác thực", { description: "Không thể lấy thông tin người dùng" });
          router.replace("/login");
        }
      };
      
      completeAuth();
    } else {
      router.replace("/login");
    }
  }, [searchParams, fetchMe, router]);

  return (
    <div className="min-h-screen bg-midnight flex flex-col items-center justify-center">
      <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-pink to-amber flex items-center justify-center animate-bounce mb-8">
        <Leaf className="text-white w-10 h-10" />
      </div>
      <div className="flex items-center gap-3 text-white/50 font-serif text-xl">
        <Loader2 className="animate-spin text-pink" size={24} />
        <span>Đang hoàn tất đăng nhập...</span>
      </div>
    </div>
  );
}
