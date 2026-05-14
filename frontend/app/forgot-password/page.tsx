"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Loader2, Leaf, Mail, KeyRound, Lock, ArrowLeft, CheckCircle } from "lucide-react";
import { toast } from "sonner";
import { Navbar } from "@/components/layout/Navbar";
import { authApi } from "@/lib/api";

const emailSchema = z.object({
  email: z.string().min(1, "Email không được để trống").email("Email không đúng định dạng"),
});

const otpSchema = z.object({
  otp: z.string().length(6, "Mã OTP phải có 6 số"),
});

const resetSchema = z.object({
  password: z.string().min(8, "Mật khẩu tối thiểu 8 ký tự"),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Mật khẩu xác nhận không khớp",
  path: ["confirmPassword"],
});

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [step, setStep] = useState(1); // 1: Email, 2: OTP, 3: Reset, 4: Success
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");

  const emailForm = useForm({
    resolver: zodResolver(emailSchema),
    defaultValues: { email: "" },
  });

  const otpForm = useForm({
    resolver: zodResolver(otpSchema),
    defaultValues: { otp: "" },
  });

  const resetForm = useForm({
    resolver: zodResolver(resetSchema),
    defaultValues: { password: "", confirmPassword: "" },
  });

  const onEmailSubmit = async (data: any) => {
    try {
      await authApi.forgotPassword(data.email);
      setEmail(data.email);
      setStep(2);
      toast.success("Mã OTP đã được gửi!", { description: "Vui lòng kiểm tra email của bạn" });
    } catch (err: any) {
      toast.error("Lỗi", { description: err.response?.data?.message || "Không thể gửi OTP" });
    }
  };

  const onOtpSubmit = async (data: any) => {
    try {
      await authApi.verifyOTP(email, data.otp);
      setOtp(data.otp);
      setStep(3);
      toast.success("Xác thực thành công!");
    } catch (err: any) {
      toast.error("Mã OTP không đúng", { description: "Vui lòng kiểm tra lại" });
    }
  };

  const onResetSubmit = async (data: any) => {
    try {
      await authApi.resetPassword(email, otp, data.password);
      setStep(4);
      toast.success("Đặt lại mật khẩu thành công!");
    } catch (err: any) {
      toast.error("Thất bại", { description: "Vui lòng thử lại sau" });
    }
  };

  return (
    <>
      <Navbar />
      <main className="pt-[100px] min-h-screen flex items-center justify-center p-6 relative overflow-hidden bg-midnight">
        <div className="absolute inset-0 z-0 pointer-events-none">
          <div className="absolute w-[500px] h-[500px] rounded-full bg-pink/5 blur-[100px] -top-24 -left-24" />
          <div className="absolute w-[400px] h-[400px] rounded-full bg-amber/5 blur-[100px] -bottom-24 -right-24" />
        </div>

        <div className="relative z-10 w-full max-w-[440px]">
          <div className="glass rounded-[32px] p-10 border-white/10 shadow-2xl overflow-hidden relative">
            
            {/* Step Progress */}
            {step < 4 && (
              <div className="flex gap-2 mb-10 justify-center">
                {[1, 2, 3].map((i) => (
                  <div 
                    key={i} 
                    className={`h-1 rounded-full transition-all duration-500 ${
                      step >= i ? "w-8 bg-pink" : "w-4 bg-white/10"
                    }`} 
                  />
                ))}
              </div>
            )}

            {step === 1 && (
              <div className="animate-fade-in">
                <div className="text-center mb-10">
                  <div className="w-16 h-16 rounded-2xl bg-pink/10 flex items-center justify-center mx-auto mb-6">
                    <Mail size={32} className="text-pink" />
                  </div>
                  <h1 className="font-serif text-3xl font-black text-white mb-2">Quên Mật Khẩu?</h1>
                  <p className="text-white/50 text-sm">Nhập email của bạn để nhận mã xác thực OTP</p>
                </div>

                <form onSubmit={emailForm.handleSubmit(onEmailSubmit)} className="space-y-6">
                  <div>
                    <label className="block text-[10px] font-bold text-pink uppercase tracking-widest mb-3">Địa chỉ Email</label>
                    <input
                      {...emailForm.register("email")}
                      placeholder="email@example.com"
                      className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-5 text-sm text-white outline-none focus:border-pink/50 transition-all"
                    />
                    {emailForm.formState.errors.email && (
                      <p className="text-pink text-xs mt-2">{emailForm.formState.errors.email.message as string}</p>
                    )}
                  </div>
                  <button type="submit" disabled={emailForm.formState.isSubmitting} className="btn-primary w-full py-4 rounded-2xl justify-center font-black">
                    {emailForm.formState.isSubmitting ? <Loader2 className="animate-spin" /> : "Gửi Mã OTP"}
                  </button>
                </form>
              </div>
            )}

            {step === 2 && (
              <div className="animate-fade-in">
                <button onClick={() => setStep(1)} className="text-white/40 hover:text-white flex items-center gap-2 mb-6 bg-transparent border-none cursor-pointer p-0 transition-colors">
                  <ArrowLeft size={16} /> <span className="text-sm font-bold">Quay lại</span>
                </button>
                <div className="text-center mb-10">
                  <div className="w-16 h-16 rounded-2xl bg-amber/10 flex items-center justify-center mx-auto mb-6">
                    <KeyRound size={32} className="text-amber" />
                  </div>
                  <h1 className="font-serif text-3xl font-black text-white mb-2">Xác Thực OTP</h1>
                  <p className="text-white/50 text-sm">Mã đã được gửi tới <span className="text-white font-bold">{email}</span></p>
                </div>

                <form onSubmit={otpForm.handleSubmit(onOtpSubmit)} className="space-y-6">
                  <div>
                    <label className="block text-[10px] font-bold text-pink uppercase tracking-widest mb-3">Mã OTP (6 số)</label>
                    <input
                      {...otpForm.register("otp")}
                      placeholder="000000"
                      className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-5 text-center text-2xl font-black tracking-[10px] text-white outline-none focus:border-pink/50 transition-all"
                    />
                    {otpForm.formState.errors.otp && (
                      <p className="text-pink text-xs mt-2 text-center">{otpForm.formState.errors.otp.message as string}</p>
                    )}
                  </div>
                  <button type="submit" disabled={otpForm.formState.isSubmitting} className="btn-primary w-full py-4 rounded-2xl justify-center font-black">
                    {otpForm.formState.isSubmitting ? <Loader2 className="animate-spin" /> : "Xác Thực"}
                  </button>
                </form>
              </div>
            )}

            {step === 3 && (
              <div className="animate-fade-in">
                <div className="text-center mb-10">
                  <div className="w-16 h-16 rounded-2xl bg-green-500/10 flex items-center justify-center mx-auto mb-6">
                    <Lock size={32} className="text-green-400" />
                  </div>
                  <h1 className="font-serif text-3xl font-black text-white mb-2">Đặt Lại Mật Khẩu</h1>
                  <p className="text-white/50 text-sm">Vui lòng nhập mật khẩu mới cho tài khoản của bạn</p>
                </div>

                <form onSubmit={resetForm.handleSubmit(onResetSubmit)} className="space-y-6">
                  <div className="space-y-4">
                    <div>
                      <label className="block text-[10px] font-bold text-pink uppercase tracking-widest mb-2">Mật khẩu mới</label>
                      <input
                        {...resetForm.register("password")}
                        type="password"
                        placeholder="••••••••"
                        className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 px-5 text-sm text-white outline-none focus:border-pink/50 transition-all"
                      />
                      {resetForm.formState.errors.password && (
                        <p className="text-pink text-xs mt-1">{resetForm.formState.errors.password.message as string}</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-pink uppercase tracking-widest mb-2">Xác nhận mật khẩu</label>
                      <input
                        {...resetForm.register("confirmPassword")}
                        type="password"
                        placeholder="••••••••"
                        className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 px-5 text-sm text-white outline-none focus:border-pink/50 transition-all"
                      />
                      {resetForm.formState.errors.confirmPassword && (
                        <p className="text-pink text-xs mt-1">{resetForm.formState.errors.confirmPassword.message as string}</p>
                      )}
                    </div>
                  </div>
                  <button type="submit" disabled={resetForm.formState.isSubmitting} className="btn-primary w-full py-4 rounded-2xl justify-center font-black">
                    {resetForm.formState.isSubmitting ? <Loader2 className="animate-spin" /> : "Cập Nhật Mật Khẩu"}
                  </button>
                </form>
              </div>
            )}

            {step === 4 && (
              <div className="animate-fade-in text-center py-4">
                <div className="w-20 h-20 rounded-full bg-green-500/10 flex items-center justify-center mx-auto mb-8 animate-bounce">
                  <CheckCircle size={48} className="text-green-400" />
                </div>
                <h1 className="font-serif text-3xl font-black text-white mb-4">Thành Công!</h1>
                <p className="text-white/50 text-sm mb-10">Mật khẩu của bạn đã được cập nhật. Giờ đây bạn có thể đăng nhập bằng mật khẩu mới.</p>
                <Link href="/login" className="btn-primary w-full py-4 rounded-2xl justify-center font-black no-underline">
                  Đăng Nhập Ngay
                </Link>
              </div>
            )}

            <div className="mt-10 text-center">
              <Link href="/login" className="text-sm text-white/40 hover:text-white transition-colors no-underline">
                Quay lại trang Đăng nhập
              </Link>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
