"use client";
import { useState, useRef } from "react";
import { Sparkles, Send, Loader2, Save, Download } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { aiApi } from "@/lib/api";
import { useAuthStore } from "@/stores/auth.store";
import Link from "next/link";

const PROVINCES = ["Hà Giang", "Sapa / Lào Cai", "Mộc Châu / Sơn La", "Điện Biên", "Lai Châu", "Yên Bái / Mù Cang Chải"];
const INTERESTS = ["Văn hoá bản địa", "Thiên nhiên & leo núi", "Ẩm thực", "Nhiếp ảnh", "Chợ phiên", "Homestay"];
const DURATIONS = [2, 3, 4, 5, 6, 7];
const BUDGETS = [
  { label: "Tiết kiệm (< 2tr)", value: 2000000 },
  { label: "Trung bình (2-5tr)", value: 5000000 },
  { label: "Thoải mái (5-10tr)", value: 10000000 },
  { label: "Cao cấp (> 10tr)", value: 15000000 },
];

export default function AIPlannerPage() {
  const { isAuthenticated } = useAuthStore();
  const [step, setStep] = useState<"form" | "generating" | "result">("form");
  const [form, setForm] = useState({ duration: 3, budget: 5000000, groupSize: 2, province: "", interests: [] as string[] });
  const [result, setResult] = useState("");
  const [parsedResult, setParsedResult] = useState<any>(null);
  const streamRef = useRef<string>("");

  const toggleInterest = (interest: string) => {
    setForm(f => ({
      ...f,
      interests: f.interests.includes(interest)
        ? f.interests.filter(i => i !== interest)
        : [...f.interests, interest],
    }));
  };

  const handleGenerate = async () => {
    if (!isAuthenticated) return;
    setStep("generating");
    setResult("");
    streamRef.current = "";

    try {
      const res = await aiApi.generate({
        duration: form.duration,
        budget: form.budget,
        groupSize: form.groupSize,
        province: form.province,
        interests: form.interests.join(", "),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || `Lỗi máy chủ (${res.status})`);
      }

      if (!res.body) throw new Error("No stream");
      const reader = res.body.getReader();
      const decoder = new TextDecoder();

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const text = decoder.decode(value);
        const lines = text.split("\n").filter(l => l.startsWith("data: "));
        for (const line of lines) {
          try {
            const json = JSON.parse(line.slice(6));
            if (json.error) {
              throw new Error(json.error);
            }
            if (json.chunk) {
              streamRef.current += json.chunk;
              setResult(streamRef.current);
            }
            if (json.done && json.fullText) {
              try {
                const jsonStr = json.fullText.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
                setParsedResult(JSON.parse(jsonStr));
              } catch { /* keep raw */ }
            }
          } catch (e: any) { 
            if (e.message && !e.message.includes('Unexpected token')) throw e;
          }
        }
      }
      setStep("result");
    } catch (err: any) {
      setStep("form");
      alert(`Có lỗi xảy ra: ${err.message || 'Vui lòng thử lại.'}`);
    }
  };

  return (
    <>
      <Navbar />
      <main style={{ paddingTop: 70, minHeight: "100vh" }}>
        {/* Header */}
        <div style={{
          background: "linear-gradient(135deg, rgba(255,214,10,0.1) 0%, rgba(255,60,172,0.08) 100%)",
          borderBottom: "1px solid var(--glass-border)",
          padding: "60px 40px",
          textAlign: "center",
        }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 10, background: "rgba(255,214,10,0.1)", border: "1px solid rgba(255,214,10,0.2)", padding: "8px 20px", borderRadius: 30, marginBottom: 20 }}>
            <Sparkles size={16} style={{ color: "var(--amber)" }} />
            <span style={{ fontSize: 13, fontWeight: 600, color: "var(--amber)" }}>AI-Powered by Google Gemini</span>
          </div>
          <h1 style={{ fontFamily: "var(--font-serif)", fontSize: "clamp(36px, 5vw, 64px)", fontWeight: 900, margin: "0 0 12px" }}>
            AI <span className="text-gradient-amber">Journey Planner</span>
          </h1>
          <p style={{ color: "var(--text)", fontSize: 17, maxWidth: 500, margin: "0 auto" }}>
            Kể cho AI nghe về chuyến đi mơ ước — nhận lại lịch trình hoàn hảo trong 30 giây
          </p>
        </div>

        <div style={{ maxWidth: 900, margin: "0 auto", padding: "60px 40px" }}>
          {!isAuthenticated ? (
            /* Login prompt */
            <div style={{ textAlign: "center", padding: "60px 0" }}>
              <div style={{ fontSize: 60, marginBottom: 24 }}>🔐</div>
              <h2 style={{ fontFamily: "var(--font-serif)", fontSize: 28, marginBottom: 16 }}>Đăng nhập để sử dụng AI Planner</h2>
              <p style={{ color: "var(--text)", marginBottom: 32 }}>Tính năng AI Planner miễn phí cho tất cả thành viên EthnoDiscovery</p>
              <div style={{ display: "flex", gap: 16, justifyContent: "center" }}>
                <Link href="/login" className="btn-primary">Đăng nhập</Link>
                <Link href="/register" className="btn-ghost">Đăng ký miễn phí</Link>
              </div>
            </div>
          ) : step === "form" ? (
            /* Form */
            <div className="glass" style={{ borderRadius: 28, padding: 48 }}>
              <h2 style={{ fontFamily: "var(--font-serif)", fontSize: 28, fontWeight: 700, marginBottom: 32 }}>
                Kể cho chúng tôi về chuyến đi của bạn ✦
              </h2>

              {/* Duration */}
              <div style={{ marginBottom: 32 }}>
                <label style={{ fontSize: 13, fontWeight: 600, color: "var(--pink)", textTransform: "uppercase", letterSpacing: "0.08em", display: "block", marginBottom: 12 }}>
                  Thời Gian — {form.duration} ngày
                </label>
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                  {DURATIONS.map(d => (
                    <button key={d} onClick={() => setForm(f => ({ ...f, duration: d }))} style={{
                      padding: "10px 20px", borderRadius: 20, fontSize: 14, cursor: "pointer", border: "1px solid",
                      background: form.duration === d ? "var(--pink)" : "transparent",
                      borderColor: form.duration === d ? "var(--pink)" : "var(--glass-border)",
                      color: "#fff", transition: "all 0.2s",
                    }}>
                      {d} ngày
                    </button>
                  ))}
                </div>
              </div>

              {/* Budget */}
              <div style={{ marginBottom: 32 }}>
                <label style={{ fontSize: 13, fontWeight: 600, color: "var(--pink)", textTransform: "uppercase", letterSpacing: "0.08em", display: "block", marginBottom: 12 }}>
                  Ngân Sách /Người
                </label>
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                  {BUDGETS.map(b => (
                    <button key={b.value} onClick={() => setForm(f => ({ ...f, budget: b.value }))} style={{
                      padding: "10px 20px", borderRadius: 20, fontSize: 14, cursor: "pointer", border: "1px solid",
                      background: form.budget === b.value ? "var(--amber)" : "transparent",
                      borderColor: form.budget === b.value ? "var(--amber)" : "var(--glass-border)",
                      color: form.budget === b.value ? "#000" : "#fff", transition: "all 0.2s",
                    }}>
                      {b.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Group Size */}
              <div style={{ marginBottom: 32 }}>
                <label style={{ fontSize: 13, fontWeight: 600, color: "var(--pink)", textTransform: "uppercase", letterSpacing: "0.08em", display: "block", marginBottom: 12 }}>
                  Số Người — {form.groupSize}
                </label>
                <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                  <button onClick={() => setForm(f => ({ ...f, groupSize: Math.max(1, f.groupSize - 1) }))} style={{ width: 40, height: 40, borderRadius: 10, border: "1px solid var(--glass-border)", background: "transparent", color: "#fff", cursor: "pointer", fontSize: 20 }}>−</button>
                  <span style={{ fontSize: 24, fontWeight: 700 }}>{form.groupSize}</span>
                  <button onClick={() => setForm(f => ({ ...f, groupSize: Math.min(20, f.groupSize + 1) }))} style={{ width: 40, height: 40, borderRadius: 10, border: "1px solid var(--glass-border)", background: "transparent", color: "#fff", cursor: "pointer", fontSize: 20 }}>+</button>
                </div>
              </div>

              {/* Province */}
              <div style={{ marginBottom: 32 }}>
                <label style={{ fontSize: 13, fontWeight: 600, color: "var(--pink)", textTransform: "uppercase", letterSpacing: "0.08em", display: "block", marginBottom: 12 }}>
                  Tỉnh / Vùng Ưu Tiên
                </label>
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                  <button onClick={() => setForm(f => ({ ...f, province: "" }))} style={{
                    padding: "10px 20px", borderRadius: 20, fontSize: 14, cursor: "pointer", border: "1px solid",
                    background: form.province === "" ? "var(--pink)" : "transparent",
                    borderColor: form.province === "" ? "var(--pink)" : "var(--glass-border)",
                    color: "#fff",
                  }}>
                    Linh hoạt
                  </button>
                  {PROVINCES.map(p => (
                    <button key={p} onClick={() => setForm(f => ({ ...f, province: p }))} style={{
                      padding: "10px 20px", borderRadius: 20, fontSize: 14, cursor: "pointer", border: "1px solid",
                      background: form.province === p ? "var(--pink)" : "transparent",
                      borderColor: form.province === p ? "var(--pink)" : "var(--glass-border)",
                      color: "#fff",
                    }}>
                      {p}
                    </button>
                  ))}
                </div>
              </div>

              {/* Interests */}
              <div style={{ marginBottom: 40 }}>
                <label style={{ fontSize: 13, fontWeight: 600, color: "var(--pink)", textTransform: "uppercase", letterSpacing: "0.08em", display: "block", marginBottom: 12 }}>
                  Sở Thích
                </label>
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                  {INTERESTS.map(i => (
                    <button key={i} onClick={() => toggleInterest(i)} style={{
                      padding: "10px 20px", borderRadius: 20, fontSize: 14, cursor: "pointer", border: "1px solid",
                      background: form.interests.includes(i) ? "rgba(255,214,10,0.2)" : "transparent",
                      borderColor: form.interests.includes(i) ? "var(--amber)" : "var(--glass-border)",
                      color: form.interests.includes(i) ? "var(--amber)" : "#fff",
                    }}>
                      {i}
                    </button>
                  ))}
                </div>
              </div>

              <button onClick={handleGenerate} className="btn-primary" style={{ fontSize: 16, padding: "16px 40px", gap: 10 }}>
                <Sparkles size={20} /> Tạo Lịch Trình AI
              </button>
            </div>
          ) : step === "generating" ? (
            /* Generating state */
            <div>
              <div style={{ textAlign: "center", marginBottom: 32 }}>
                <div style={{ display: "inline-flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
                  <Loader2 size={24} style={{ color: "var(--amber)", animation: "spin 1s linear infinite" }} />
                  <span style={{ fontSize: 18, fontWeight: 600 }}>AI đang tạo lịch trình...</span>
                </div>
                <p style={{ color: "var(--text)" }}>Thường mất 15-30 giây</p>
              </div>
              {result && (
                <div className="glass" style={{ borderRadius: 20, padding: 32, whiteSpace: "pre-wrap", color: "var(--text)", fontSize: 14, lineHeight: 1.8, fontFamily: "monospace", maxHeight: 400, overflow: "auto" }}>
                  {result}
                </div>
              )}
            </div>
          ) : (
            /* Result */
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 32, flexWrap: "wrap", gap: 12 }}>
                <h2 style={{ fontFamily: "var(--font-serif)", fontSize: 28, fontWeight: 700 }}>
                  {parsedResult?.title || "Lịch trình của bạn ✦"}
                </h2>
                <div style={{ display: "flex", gap: 12 }}>
                  <button onClick={() => setStep("form")} className="btn-ghost" style={{ padding: "10px 20px", fontSize: 14 }}>
                    Tạo mới
                  </button>
                </div>
              </div>

              {parsedResult ? (
                <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                  {/* Summary */}
                  {parsedResult.summary && (
                    <div className="glass" style={{ borderRadius: 20, padding: 24 }}>
                      <p style={{ color: "var(--text)", lineHeight: 1.8 }}>{parsedResult.summary}</p>
                      {parsedResult.estimatedCost && (
                        <div style={{ marginTop: 16, display: "flex", gap: 16 }}>
                          <span className="badge badge-amber">
                            💰 {Number(parsedResult.estimatedCost.min).toLocaleString("vi-VN")}₫ — {Number(parsedResult.estimatedCost.max).toLocaleString("vi-VN")}₫/người
                          </span>
                          <span className="badge badge-pink">📅 {parsedResult.totalDays} ngày</span>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Highlights */}
                  {parsedResult.highlights?.length > 0 && (
                    <div className="glass" style={{ borderRadius: 20, padding: 24 }}>
                      <h3 style={{ fontFamily: "var(--font-serif)", fontSize: 20, fontWeight: 700, marginBottom: 16 }}>✦ Điểm Nổi Bật</h3>
                      <ul style={{ listStyle: "none", padding: 0, display: "flex", flexDirection: "column", gap: 10 }}>
                        {parsedResult.highlights.map((h: string, i: number) => (
                          <li key={i} style={{ display: "flex", gap: 10, alignItems: "flex-start", color: "rgba(255,255,255,0.85)", fontSize: 15 }}>
                            <span style={{ color: "var(--amber)", fontWeight: 700 }}>✦</span> {h}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Days */}
                  {parsedResult.days?.map((day: any) => (
                    <div key={day.day} className="glass" style={{ borderRadius: 20, padding: 28 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 20 }}>
                        <div style={{ width: 48, height: 48, borderRadius: 14, background: "linear-gradient(135deg, var(--pink), var(--amber))", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: 18, color: "#000" }}>
                          {day.day}
                        </div>
                        <div>
                          <h3 style={{ fontFamily: "var(--font-serif)", fontSize: 20, fontWeight: 700, color: "#fff" }}>{day.title}</h3>
                          <p style={{ fontSize: 13, color: "var(--pink)" }}>📍 {day.location}</p>
                        </div>
                      </div>

                      {day.activities?.length > 0 && (
                        <ul style={{ listStyle: "none", padding: 0, marginBottom: 16, display: "flex", flexDirection: "column", gap: 8 }}>
                          {day.activities.map((a: string, i: number) => (
                            <li key={i} style={{ fontSize: 14, color: "rgba(255,255,255,0.8)", display: "flex", gap: 8, alignItems: "flex-start" }}>
                              <span style={{ color: "var(--amber)" }}>→</span> {a}
                            </li>
                          ))}
                        </ul>
                      )}

                      {day.meals && (
                        <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginTop: 12 }}>
                          {Object.entries(day.meals).map(([meal, food]) => (
                            <span key={meal} className="badge badge-amber" style={{ fontSize: 12 }}>
                              {meal === "breakfast" ? "🌅 Sáng" : meal === "lunch" ? "☀️ Trưa" : "🌙 Tối"}: {food as string}
                            </span>
                          ))}
                        </div>
                      )}

                      {day.accommodation && (
                        <p style={{ marginTop: 12, fontSize: 13, color: "var(--text)" }}>🏠 {day.accommodation}</p>
                      )}

                      {day.tips && (
                        <p style={{ marginTop: 12, fontSize: 13, color: "rgba(255,214,10,0.8)", background: "rgba(255,214,10,0.05)", padding: "8px 12px", borderRadius: 10 }}>
                          💡 {day.tips}
                        </p>
                      )}
                    </div>
                  ))}

                  {/* CTA */}
                  <div style={{ textAlign: "center", padding: "20px 0" }}>
                    <Link href="/tours" className="btn-primary" style={{ fontSize: 16 }}>
                      Đặt Tour Ngay ✦
                    </Link>
                  </div>
                </div>
              ) : (
                /* Raw result fallback */
                <div className="glass" style={{ borderRadius: 20, padding: 32, whiteSpace: "pre-wrap", color: "var(--text)", fontSize: 14, lineHeight: 1.8 }}>
                  {result}
                </div>
              )}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
