"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Eye, EyeOff, Loader2, Leaf, UserPlus, KeyRound } from "lucide-react";
import { toast } from "sonner";
import { Navbar } from "@/components/layout/Navbar";
import { authApi } from "@/lib/api";
import { useAuthStore } from "@/stores/auth.store";
import { Modal } from "@/components/ui/Modal";
import { PrivacyContent } from "@/components/ui/PrivacyContent";
import { TermsContent } from "@/components/ui/TermsContent";

const registerSchema = z.object({
  name: z.string().min(2, "Tên phải có ít nhất 2 ký tự"),
  email: z.string().min(1, "Email không được để trống").email("Email không đúng định dạng"),
  phone: z.string().optional(),
  password: z.string().min(8, "Mật khẩu tối thiểu 8 ký tự"),
});

type RegisterFormValues = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const router = useRouter();
  const { setUser, fetchMe } = useAuthStore();
  const [showPass, setShowPass] = useState(false);
  const [step, setStep] = useState(1); // 1: Form, 2: OTP
  const [email, setEmail] = useState("");
  const [regToken, setRegToken] = useState("");
  const [countdown, setCountdown] = useState(0);
  
  // Modal states
  const [isPrivacyOpen, setIsPrivacyOpen] = useState(false);
  const [isTermsOpen, setIsTermsOpen] = useState(false);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (countdown > 0) {
      timer = setInterval(() => setCountdown(c => c - 1), 1000);
    }
    return () => clearInterval(timer);
  }, [countdown]);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: { name: "", email: "", phone: "", password: "" },
  });

  const otpForm = useForm({
    defaultValues: { otp: "" },
  });

  const onRegisterSubmit = async (data: RegisterFormValues) => {
    try {
      const res = await authApi.register(data);
      setEmail(data.email);
      setRegToken(res.data.data.registrationToken);
      setStep(2);
      setCountdown(60); // Đặt đếm ngược 60s
      toast.success("Mã xác thực đã được gửi!", { description: "Vui lòng kiểm tra email của bạn" });
    } catch (err: any) {
      console.error("Registration Error Details:", err);
      const msg = err.response?.data?.message || err.message || "Vui lòng thử lại sau";
      toast.error("Đăng ký thất bại", { description: msg });
    }
  };

  const onResendOtp = async () => {
    if (countdown > 0) return;
    try {
      // Lấy các giá trị hiện tại từ form chính để gửi lại
      const data = handleSubmit((d) => d)();
      const res = await authApi.register(data as any);
      setRegToken(res.data.data.registrationToken);
      setCountdown(60);
      toast.success("Mã mới đã được gửi!");
    } catch (err) {
      toast.error("Không thể gửi lại mã");
    }
  };

  const onOtpSubmit = async (data: { otp: string }) => {
    try {
      const res = await authApi.verifyRegister(data.otp, regToken);
      const { user, accessToken, refreshToken } = res.data.data;
      
      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', refreshToken);
      
      toast.success("Xác thực thành công!", { description: "Chào mừng bạn đến với EthnoDiscovery" });
      await fetchMe();
      router.push("/dashboard");
    } catch (err: any) {
      toast.error("Mã OTP không đúng", { description: "Vui lòng kiểm tra lại" });
    }
  };

  return (
    <>
      <Navbar />
      <main className="pt-[70px] min-h-screen flex items-center justify-center p-6 relative overflow-hidden bg-midnight">
        {/* Background Orbs */}
        <div className="absolute inset-0 z-0 pointer-events-none">
          <div className="absolute w-[600px] h-[600px] rounded-full bg-pink/5 blur-[120px] -top-32 -right-32" />
        </div>

        <div className="relative z-10 w-full max-w-[480px]">
          <div className="glass rounded-[32px] p-10 md:p-12 border-white/10 shadow-2xl">
            {step === 1 ? (
              <>
                {/* Header */}
                <div className="text-center mb-10">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-pink/20 to-amber/20 flex items-center justify-center mx-auto mb-6">
                    <UserPlus size={32} className="text-pink" />
                  </div>
                  <h1 className="font-serif text-3xl font-black text-white mb-2">Tạo Tài Khoản</h1>
                  <p className="text-white/50 text-sm">Gia nhập cộng đồng EthnoDiscovery</p>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit(onRegisterSubmit)} className="space-y-5">
                  <div>
                    <label className="block text-[10px] font-bold text-pink uppercase tracking-widest mb-2">Họ và tên</label>
                    <input
                      {...register("name")}
                      placeholder="Nguyễn Văn A"
                      className={`w-full bg-white/5 border rounded-2xl py-3 px-5 text-sm text-white outline-none transition-all ${
                        errors.name ? "border-pink focus:border-pink" : "border-white/10 focus:border-pink/50"
                      }`}
                    />
                    {errors.name && <p className="text-pink text-xs mt-1.5 font-medium">{errors.name.message}</p>}
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-pink uppercase tracking-widest mb-2">Email</label>
                    <input
                      {...register("email")}
                      placeholder="email@example.com"
                      className={`w-full bg-white/5 border rounded-2xl py-3 px-5 text-sm text-white outline-none transition-all ${
                        errors.email ? "border-pink focus:border-pink" : "border-white/10 focus:border-pink/50"
                      }`}
                    />
                    {errors.email && <p className="text-pink text-xs mt-1.5 font-medium">{errors.email.message}</p>}
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-pink uppercase tracking-widest mb-2">Số điện thoại (Tuỳ chọn)</label>
                    <input
                      {...register("phone")}
                      placeholder="0901234567"
                      className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 px-5 text-sm text-white outline-none transition-all focus:border-pink/50"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-pink uppercase tracking-widest mb-2">Mật Khẩu</label>
                    <div className="relative">
                      <input
                        {...register("password")}
                        type={showPass ? "text" : "password"}
                        placeholder="Tối thiểu 8 ký tự"
                        className={`w-full bg-white/5 border rounded-2xl py-3 px-5 pr-12 text-sm text-white outline-none transition-all ${
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
                    {errors.password && <p className="text-pink text-xs mt-1.5 font-medium">{errors.password.message}</p>}
                  </div>

                  <div className="flex items-start gap-3 mt-2">
                    <input type="checkbox" required className="mt-1 accent-pink cursor-pointer" />
                    <p className="text-xs text-white/50 leading-relaxed">
                      Tôi đồng ý với {" "}
                      <button 
                        type="button" 
                        onClick={() => setIsTermsOpen(true)}
                        className="text-pink hover:underline bg-transparent border-none p-0 inline font-medium cursor-pointer"
                      >
                        Điều khoản dịch vụ
                      </button> 
                      {" "} và {" "}
                      <button 
                        type="button" 
                        onClick={() => setIsPrivacyOpen(true)}
                        className="text-pink hover:underline bg-transparent border-none p-0 inline font-medium cursor-pointer"
                      >
                        Chính sách bảo mật
                      </button> 
                      {" "} của EthnoDiscovery.
                    </p>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="btn-primary w-full py-4 rounded-2xl justify-center font-black text-base shadow-lg shadow-pink/20 hover:shadow-pink/40 disabled:opacity-70 mt-6"
                  >
                    {isSubmitting && <Loader2 size={18} className="animate-spin mr-2" />}
                    {isSubmitting ? "Đang xử lý..." : "Đăng Ký Ngay"}
                  </button>
                </form>

                {/* Social Login */}
                <div className="mt-8">
                  <div className="relative mb-8">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-white/10"></div>
                    </div>
                    <div className="relative flex justify-center text-[10px] font-bold uppercase tracking-widest">
                      <span className="bg-midnight px-4 text-white/30">Hoặc đăng ký với</span>
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

                <p className="text-center mt-8 text-sm text-white/40">
                  Đã có tài khoản? <Link href="/login" className="text-pink font-bold no-underline hover:underline">Đăng nhập</Link>
                </p>
              </>
            ) : (
              <div className="animate-fade-in">
                <div className="text-center mb-10">
                  <div className="w-16 h-16 rounded-2xl bg-amber/10 flex items-center justify-center mx-auto mb-6">
                    <KeyRound size={32} className="text-amber" />
                  </div>
                  <h1 className="font-serif text-3xl font-black text-white mb-2">Xác Thực Tài Khoản</h1>
                  <p className="text-white/50 text-sm">Vui lòng nhập mã OTP đã được gửi tới <br/><span className="text-white font-bold">{email}</span></p>
                </div>

                <form onSubmit={otpForm.handleSubmit(onOtpSubmit)} className="space-y-6">
                  <div>
                    <label className="block text-[10px] font-bold text-pink uppercase tracking-widest mb-3 text-center">Mã OTP (6 số)</label>
                    <input
                      {...otpForm.register("otp")}
                      placeholder="000000"
                      className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-5 text-center text-2xl font-black tracking-[10px] text-white outline-none focus:border-pink/50 transition-all"
                    />
                  </div>
                  <button type="submit" disabled={otpForm.formState.isSubmitting} className="btn-primary w-full py-4 rounded-2xl justify-center font-black">
                    {otpForm.formState.isSubmitting ? <Loader2 className="animate-spin" /> : "Xác Thực & Đăng Ký"}
                  </button>

                  <div className="text-center">
                    <button 
                      type="button" 
                      onClick={onResendOtp} 
                      disabled={countdown > 0}
                      className={`text-sm font-bold transition-colors ${
                        countdown > 0 ? "text-white/20 cursor-not-allowed" : "text-pink hover:text-pink/80"
                      }`}
                    >
                      {countdown > 0 ? `Gửi lại mã sau ${countdown}s` : "Gửi lại mã OTP"}
                    </button>
                  </div>

                  <button type="button" onClick={() => setStep(1)} className="w-full bg-transparent border-none text-white/40 hover:text-white text-xs font-bold transition-colors cursor-pointer mt-4">
                    Thay đổi thông tin đăng ký
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Modals */}
      <Modal 
        isOpen={isPrivacyOpen} 
        onClose={() => setIsPrivacyOpen(false)} 
        title="Chính Sách Bảo Mật"
      >
        <PrivacyContent />
      </Modal>

      <Modal 
        isOpen={isTermsOpen} 
        onClose={() => setIsTermsOpen(false)} 
        title="Điều Khoản Dịch Vụ"
      >
        <TermsContent />
      </Modal>
    </>
  );
}
