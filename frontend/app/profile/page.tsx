"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Loader2, User, Mail, Phone, ShieldCheck, Camera } from "lucide-react";
import { toast } from "sonner";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { authApi } from "@/lib/api";
import { useAuthStore } from "@/stores/auth.store";

const profileSchema = z.object({
  name: z.string().min(2, "Tên phải có ít nhất 2 ký tự"),
  phone: z.string().optional(),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

export default function ProfilePage() {
  const router = useRouter();
  const { user, isAuthenticated, fetchMe } = useAuthStore();
  const [isPageLoading, setIsPageLoading] = useState(true);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: { name: "", phone: "" },
  });

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login");
    } else if (user) {
      setValue("name", user.name || "");
      setValue("phone", user.phone || "");
      setIsPageLoading(false);
    }
  }, [isAuthenticated, user, router, setValue]);

  const onSubmit = async (data: ProfileFormValues) => {
    try {
      await authApi.updateMe(data);
      await checkAuth(); // refresh user info in store
      toast.success("Cập nhật thành công!", { description: "Thông tin cá nhân của bạn đã được lưu lại." });
    } catch (err: any) {
      toast.error("Cập nhật thất bại", { description: err.response?.data?.message || "Vui lòng thử lại sau" });
    }
  };

  if (isPageLoading) {
    return (
      <>
        <Navbar />
        <div className="pt-[70px] min-h-screen flex items-center justify-center">
          <Loader2 size={32} className="animate-spin text-pink" />
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <main className="pt-[70px] pb-24">
        {/* Header Banner */}
        <div className="bg-gradient-to-br from-pink/10 to-amber/5 border-b border-white/5 py-12 px-6 text-center">
          <h1 className="font-serif text-4xl font-black mb-2">Hồ Sơ Cá Nhân</h1>
          <p className="text-white/50 text-sm">Quản lý thông tin tài khoản và cài đặt của bạn</p>
        </div>

        <div className="max-w-4xl mx-auto px-6 mt-12 grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Sidebar */}
          <div className="md:col-span-1 space-y-6">
            <div className="glass rounded-[32px] p-8 text-center border-white/10">
              <div className="relative w-24 h-24 mx-auto mb-4">
                <div className="w-full h-full rounded-full bg-gradient-to-br from-pink/30 to-amber/30 flex items-center justify-center text-3xl font-bold uppercase text-white shadow-xl shadow-pink/10 border border-white/10">
                  {user?.name?.[0] || "U"}
                </div>
                <button className="absolute bottom-0 right-0 w-8 h-8 bg-midnight border border-white/20 rounded-full flex items-center justify-center hover:bg-white/10 transition-colors text-white">
                  <Camera size={14} />
                </button>
              </div>
              <h3 className="text-lg font-bold text-white mb-1">{user?.name}</h3>
              <p className="text-xs text-white/50 font-medium uppercase tracking-widest">{user?.role}</p>

              <div className="mt-6 pt-6 border-t border-white/5 space-y-3">
                <div className="flex items-center gap-3 text-sm text-white/70">
                  <ShieldCheck size={16} className="text-green-400" />
                  <span>Tài khoản đã xác thực</span>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="md:col-span-2">
            <div className="glass rounded-[32px] p-8 md:p-10 border-white/10">
              <h2 className="font-serif text-2xl font-bold text-white mb-8">Thông tin cơ bản</h2>
              
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-[10px] font-bold text-pink uppercase tracking-widest mb-3 flex items-center gap-2">
                      <User size={14} /> Họ và Tên
                    </label>
                    <input
                      {...register("name")}
                      className={`w-full bg-white/5 border rounded-2xl py-3 px-4 text-sm text-white outline-none transition-all ${
                        errors.name ? "border-pink focus:border-pink" : "border-white/10 focus:border-pink/50"
                      }`}
                    />
                    {errors.name && <p className="text-pink text-xs mt-2 font-medium">{errors.name.message}</p>}
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-pink uppercase tracking-widest mb-3 flex items-center gap-2">
                      <Phone size={14} /> Số điện thoại
                    </label>
                    <input
                      {...register("phone")}
                      className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 px-4 text-sm text-white outline-none transition-all focus:border-pink/50"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-pink uppercase tracking-widest mb-3 flex items-center gap-2">
                    <Mail size={14} /> Email (Không thể thay đổi)
                  </label>
                  <input
                    value={user?.email || ""}
                    disabled
                    className="w-full bg-black/20 border border-white/5 rounded-2xl py-3 px-4 text-sm text-white/40 cursor-not-allowed"
                  />
                </div>

                <div className="pt-6 border-t border-white/5 flex justify-end">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="btn-primary py-3 px-8 rounded-xl font-bold text-sm shadow-lg shadow-pink/20 hover:shadow-pink/40 disabled:opacity-70 flex items-center gap-2"
                  >
                    {isSubmitting && <Loader2 size={16} className="animate-spin" />}
                    {isSubmitting ? "Đang lưu..." : "Lưu thay đổi"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
