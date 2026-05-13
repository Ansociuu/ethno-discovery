"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Loader2 } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { authApi } from "@/lib/api";
import { useAuthStore } from "@/stores/auth.store";

export default function RegisterPage() {
  const router = useRouter();
  const { login } = useAuthStore();
  const [form, setForm] = useState({ name: "", email: "", password: "", phone: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (form.password.length < 8) { setError("Mật khẩu tối thiểu 8 ký tự"); return; }
    setLoading(true);
    try {
      await authApi.register(form);
      await login(form.email, form.password);
      router.push("/dashboard");
    } catch (err: any) {
      setError(err.response?.data?.message || "Đăng ký thất bại");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <main style={{ paddingTop: 70, minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "40px" }}>
        <div style={{ position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none" }}>
          <div style={{ position: "absolute", width: 500, height: 500, borderRadius: "50%", background: "rgba(255,214,10,0.08)", filter: "blur(100px)", top: -100, right: -100 }} />
        </div>

        <div style={{ position: "relative", zIndex: 1, width: "100%", maxWidth: 460 }}>
          <div className="glass" style={{ borderRadius: 28, padding: "48px 40px" }}>
            <div style={{ textAlign: "center", marginBottom: 32 }}>
              <div style={{ fontSize: 40, marginBottom: 12 }}>🌿</div>
              <h1 style={{ fontFamily: "var(--font-serif)", fontSize: 28, fontWeight: 700, marginBottom: 6 }}>Tạo Tài Khoản</h1>
              <p style={{ color: "var(--text)", fontSize: 15 }}>Gia nhập cộng đồng EthnoDiscovery</p>
            </div>

            {error && (
              <div style={{ background: "rgba(255,60,172,0.12)", border: "1px solid rgba(255,60,172,0.25)", borderRadius: 12, padding: "12px 16px", marginBottom: 20, color: "var(--pink)", fontSize: 14 }}>
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              {[
                { label: "Họ và tên", key: "name", type: "text", placeholder: "Nguyễn Văn A" },
                { label: "Email", key: "email", type: "email", placeholder: "email@example.com" },
                { label: "Số điện thoại", key: "phone", type: "tel", placeholder: "0901234567" },
                { label: "Mật Khẩu", key: "password", type: "password", placeholder: "Tối thiểu 8 ký tự" },
              ].map(field => (
                <div key={field.key} style={{ marginBottom: 16 }}>
                  <label style={{ fontSize: 13, fontWeight: 600, color: "var(--pink)", textTransform: "uppercase", letterSpacing: "0.08em", display: "block", marginBottom: 8 }}>
                    {field.label}
                  </label>
                  <input
                    type={field.type}
                    value={(form as any)[field.key]}
                    onChange={e => setForm({ ...form, [field.key]: e.target.value })}
                    placeholder={field.placeholder}
                    required={field.key !== "phone"}
                    className="input"
                  />
                </div>
              ))}

              <button
                type="submit"
                disabled={loading}
                className="btn-primary"
                style={{ width: "100%", justifyContent: "center", fontSize: 16, padding: "14px", marginTop: 8, gap: 8 }}
              >
                {loading && <Loader2 size={18} style={{ animation: "spin 1s linear infinite" }} />}
                {loading ? "Đang tạo tài khoản..." : "Đăng Ký Ngay ✦"}
              </button>
            </form>

            <p style={{ textAlign: "center", marginTop: 24, fontSize: 14, color: "var(--text)" }}>
              Đã có tài khoản?{" "}
              <Link href="/login" style={{ color: "var(--pink)", textDecoration: "none", fontWeight: 600 }}>Đăng nhập</Link>
            </p>
          </div>
        </div>
      </main>
    </>
  );
}
