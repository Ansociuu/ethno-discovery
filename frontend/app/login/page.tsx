"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Eye, EyeOff, Loader2, Leaf } from "lucide-react";
import { toast } from "sonner";
import { Navbar } from "@/components/layout/Navbar";
import { useAuthStore } from "@/stores/auth.store";

const loginSchema = z.object({
  email: z.string().min(1, "Email không được để trống").email("Email không đúng định dạng"),
  password: z.string().min(6, "Mật khẩu tối thiểu 6 ký tự"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuthStore();
  const [showPass, setShowPass] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = async (data: LoginFormValues) => {
    try {
      await login(data.email, data.password);
      toast.success("Đăng nhập thành công!", { description: "Chào mừng bạn quay lại EthnoDiscovery" });
      router.push("/dashboard");
    } catch (err: any) {
      toast.error("Đăng nhập thất bại", { description: err.response?.data?.message || "Email hoặc mật khẩu không đúng" });
    }
  };

  return (
    <>
      <Navbar />
      <main className="pt-[70px] min-h-screen flex items-center justify-center p-6 relative overflow-hidden">
        {/* Background Orbs */}
        <div className="absolute inset-0 z-0 pointer-events-none">
          <div className="absolute w-[500px] h-[500px] rounded-full bg-pink/5 blur-[100px] -top-24 -left-24" />
          <div className="absolute w-[400px] h-[400px] rounded-full bg-amber/5 blur-[100px] -bottom-24 -right-24" />
        </div>

        <div className="relative z-10 w-full max-w-[460px]">
          <div className="glass rounded-[32px] p-10 md:p-12 border-white/10 shadow-2xl">
            {/* Header */}
            <div className="text-center mb-10">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-pink/20 to-amber/20 flex items-center justify-center mx-auto mb-6">
                <Leaf size={32} className="text-pink" />
              </div>
              <h1 className="font-serif text-3xl font-black text-white mb-2">Chào Mừng Trở Lại</h1>
              <p className="text-white/50 text-sm">Đăng nhập vào EthnoDiscovery</p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div>
                <label className="block text-[10px] font-bold text-pink uppercase tracking-widest mb-3">Email</label>
                <input
                  {...register("email")}
                  placeholder="email@example.com"
                  className={`w-full bg-white/5 border rounded-2xl py-4 px-5 text-sm text-white outline-none transition-all ${
                    errors.email ? "border-pink focus:border-pink" : "border-white/10 focus:border-pink/50"
                  }`}
                />
                {errors.email && <p className="text-pink text-xs mt-2 font-medium">{errors.email.message}</p>}
              </div>

              <div>
                <label className="block text-[10px] font-bold text-pink uppercase tracking-widest mb-3">Mật Khẩu</label>
                <div className="relative">
                  <input
                    {...register("password")}
                    type={showPass ? "text" : "password"}
                    placeholder="••••••••"
                    className={`w-full bg-white/5 border rounded-2xl py-4 px-5 pr-12 text-sm text-white outline-none transition-all ${
                      errors.password ? "border-pink focus:border-pink" : "border-white/10 focus:border-pink/50"
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPass(!showPass)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/70 transition-colors"
                  >
                    {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {errors.password && <p className="text-pink text-xs mt-2 font-medium">{errors.password.message}</p>}
                <div className="flex justify-end mt-2">
                  <Link href="/forgot-password" className="text-xs text-white/40 hover:text-pink transition-colors no-underline">
                    Quên mật khẩu?
                  </Link>
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="btn-primary w-full py-4 rounded-2xl justify-center font-black text-base shadow-lg shadow-pink/20 hover:shadow-pink/40 disabled:opacity-70 mt-4"
              >
                {isSubmitting && <Loader2 size={18} className="animate-spin mr-2" />}
                {isSubmitting ? "Đang xử lý..." : "Đăng Nhập"}
              </button>
            </form>

            {/* Social Login */}
            <div className="mt-8">
              <div className="relative mb-8">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-white/10"></div>
                </div>
                <div className="relative flex justify-center text-[10px] font-bold uppercase tracking-widest">
                  <span className="bg-midnight px-4 text-white/30">Hoặc tiếp tục với</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <a 
                  href={`${process.env.NEXT_PUBLIC_API_URL}/auth/google`}
                  className="flex items-center justify-center gap-3 py-3 px-4 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all no-underline group"
                >
                  <img src="https://www.svgrepo.com/show/475656/google-color.svg" className="w-5 h-5 group-hover:scale-110 transition-transform" />
                  <span className="text-xs font-bold text-white">Google</span>
                </a>
                <a 
                  href={`${process.env.NEXT_PUBLIC_API_URL}/auth/facebook`}
                  className="flex items-center justify-center gap-3 py-3 px-4 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all no-underline group"
                >
                  <img src="https://www.svgrepo.com/show/475647/facebook-color.svg" className="w-5 h-5 group-hover:scale-110 transition-transform" />
                  <span className="text-xs font-bold text-white">Facebook</span>
                </a>
              </div>
            </div>

            {/* Demo accounts */}
            <div className="mt-8 p-5 bg-amber/5 border border-amber/10 rounded-2xl">
              <p className="text-[10px] font-bold text-amber uppercase tracking-widest mb-3">Tài khoản Demo</p>
              <div className="space-y-2">
                <button 
                  onClick={() => { setValue("email", "admin@ethnodiscovery.vn"); setValue("password", "admin123456"); }}
                  className="w-full text-left text-xs text-white/60 hover:text-white bg-transparent border-none cursor-pointer p-1 transition-colors"
                >
                  👑 <span className="font-mono">admin@ethnodiscovery.vn</span> / admin123456
                </button>
                <button 
                  onClick={() => { setValue("email", "demo@ethnodiscovery.vn"); setValue("password", "demo123456"); }}
                  className="w-full text-left text-xs text-white/60 hover:text-white bg-transparent border-none cursor-pointer p-1 transition-colors"
                >
                  👤 <span className="font-mono">demo@ethnodiscovery.vn</span> / demo123456
                </button>
              </div>
            </div>

            <p className="text-center mt-8 text-sm text-white/40">
              Chưa có tài khoản? <Link href="/register" className="text-pink font-bold no-underline hover:underline">Đăng ký ngay</Link>
            </p>
          </div>
        </div>
      </main>
    </>
  );
}
