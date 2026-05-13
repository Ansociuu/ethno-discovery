"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { useAuthStore } from "@/stores/auth.store";

export default function LoginPage() {
  const router = useRouter();
  const { login, isLoading } = useAuthStore();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      await login(email, password);
      router.push("/dashboard");
    } catch (err: any) {
      setError(err.response?.data?.message || "Đăng nhập thất bại");
    }
  };

  return (
    <>
      <Navbar />
      <main style={{ paddingTop: 70, minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "40px" }}>
        {/* BG orbs */}
        <div style={{ position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none" }}>
          <div style={{ position: "absolute", width: 500, height: 500, borderRadius: "50%", background: "rgba(255,60,172,0.08)", filter: "blur(100px)", top: -100, left: -100 }} />
          <div style={{ position: "absolute", width: 400, height: 400, borderRadius: "50%", background: "rgba(255,214,10,0.06)", filter: "blur(100px)", bottom: -100, right: -100 }} />
        </div>

        <div style={{ position: "relative", zIndex: 1, width: "100%", maxWidth: 460 }}>
          {/* Card */}
          <div className="glass" style={{ borderRadius: 28, padding: "48px 40px" }}>
            {/* Logo */}
            <div style={{ textAlign: "center", marginBottom: 32 }}>
              <div style={{ fontSize: 40, marginBottom: 12 }}>🌿</div>
              <h1 style={{ fontFamily: "var(--font-serif)", fontSize: 28, fontWeight: 700, marginBottom: 6 }}>
                Chào Mừng Trở Lại
              </h1>
              <p style={{ color: "var(--text)", fontSize: 15 }}>Đăng nhập vào EthnoDiscovery</p>
            </div>

            {/* Error */}
            {error && (
              <div style={{ background: "rgba(255,60,172,0.12)", border: "1px solid rgba(255,60,172,0.25)", borderRadius: 12, padding: "12px 16px", marginBottom: 20, color: "var(--pink)", fontSize: 14 }}>
                {error}
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: 16 }}>
                <label style={{ fontSize: 13, fontWeight: 600, color: "var(--pink)", textTransform: "uppercase", letterSpacing: "0.08em", display: "block", marginBottom: 8 }}>
                  Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="email@example.com"
                  required
                  className="input"
                />
              </div>

              <div style={{ marginBottom: 24 }}>
                <label style={{ fontSize: 13, fontWeight: 600, color: "var(--pink)", textTransform: "uppercase", letterSpacing: "0.08em", display: "block", marginBottom: 8 }}>
                  Mật Khẩu
                </label>
                <div style={{ position: "relative" }}>
                  <input
                    type={showPass ? "text" : "password"}
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    className="input"
                    style={{ paddingRight: 44 }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPass(!showPass)}
                    style={{ position: "absolute", right: 14, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", color: "rgba(255,255,255,0.5)", cursor: "pointer" }}
                  >
                    {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="btn-primary"
                style={{ width: "100%", justifyContent: "center", fontSize: 16, padding: "14px", gap: 8 }}
              >
                {isLoading && <Loader2 size={18} style={{ animation: "spin 1s linear infinite" }} />}
                {isLoading ? "Đang đăng nhập..." : "Đăng Nhập"}
              </button>
            </form>

            {/* Demo accounts */}
            <div style={{ marginTop: 24, padding: 16, background: "rgba(255,214,10,0.05)", border: "1px solid rgba(255,214,10,0.15)", borderRadius: 12 }}>
              <p style={{ fontSize: 12, color: "var(--amber)", fontWeight: 600, marginBottom: 8 }}>Demo Accounts:</p>
              <button onClick={() => { setEmail("admin@ethnodiscovery.vn"); setPassword("admin123456"); }}
                style={{ fontSize: 12, color: "var(--text)", background: "none", border: "none", cursor: "pointer", display: "block", marginBottom: 4, textAlign: "left" }}>
                👑 admin@ethnodiscovery.vn / admin123456
              </button>
              <button onClick={() => { setEmail("demo@ethnodiscovery.vn"); setPassword("demo123456"); }}
                style={{ fontSize: 12, color: "var(--text)", background: "none", border: "none", cursor: "pointer", display: "block", textAlign: "left" }}>
                👤 demo@ethnodiscovery.vn / demo123456
              </button>
            </div>

            <p style={{ textAlign: "center", marginTop: 24, fontSize: 14, color: "var(--text)" }}>
              Chưa có tài khoản?{" "}
              <Link href="/register" style={{ color: "var(--pink)", textDecoration: "none", fontWeight: 600 }}>Đăng ký ngay</Link>
            </p>
          </div>
        </div>
      </main>
    </>
  );
}
