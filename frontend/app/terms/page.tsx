"use client";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Leaf } from "lucide-react";
import { TermsContent } from "@/components/ui/TermsContent";

export default function TermsPage() {
  return (
    <>
      <Navbar />
      <main className="pt-[120px] min-h-screen bg-midnight pb-20">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center mb-16 animate-fade-up">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-pink to-amber flex items-center justify-center mx-auto mb-6">
              <Leaf size={32} className="text-white" />
            </div>
            <h1 className="font-serif text-5xl font-black text-white mb-4">Điều Khoản Dịch Vụ</h1>
            <p className="text-white/50">Cập nhật lần cuối: 14/05/2026</p>
          </div>

          <div className="glass rounded-[40px] p-10 md:p-16 border-white/10 animate-fade-in">
            <TermsContent />
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
