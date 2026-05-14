"use client";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Leaf, Lock, Eye, Database, Share2 } from "lucide-react";

export default function PrivacyPage() {
  const points = [
    {
      title: "Thông tin thu thập",
      icon: Database,
      content: "Chúng tôi thu thập tên, email, số điện thoại và lịch sử đặt chỗ của bạn để cung cấp dịch vụ cá nhân hoá tốt nhất."
    },
    {
      title: "Mục đích sử dụng",
      icon: Eye,
      content: "Thông tin của bạn được dùng để xác nhận đơn hàng, gửi thông báo qua email, và cải thiện trải nghiệm người dùng với AI Planner."
    },
    {
      title: "Bảo mật dữ liệu",
      icon: Lock,
      content: "Dữ liệu được mã hoá và lưu trữ trên các máy chủ bảo mật. Chúng tôi cam kết không chia sẻ thông tin cá nhân của bạn cho bên thứ ba vì mục đích quảng cáo."
    },
    {
      title: "Quyền của bạn",
      icon: Share2,
      content: "Bạn có quyền truy cập, chỉnh sửa hoặc yêu cầu xoá dữ liệu cá nhân của mình bất cứ lúc nào thông qua Dashboard hoặc liên hệ hỗ trợ."
    }
  ];

  return (
    <>
      <Navbar />
      <main className="pt-[120px] min-h-screen bg-midnight pb-20">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center mb-16 animate-fade-up">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-pink to-amber flex items-center justify-center mx-auto mb-6">
              <Leaf size={32} className="text-white" />
            </div>
            <h1 className="font-serif text-5xl font-black text-white mb-4">Chính Sách Bảo Mật</h1>
            <p className="text-white/50">Sự riêng tư của bạn là ưu tiên hàng đầu của chúng tôi.</p>
          </div>

          <div className="glass rounded-[40px] p-10 md:p-16 border-white/10 grid grid-cols-1 md:grid-cols-2 gap-12 animate-fade-in">
            {points.map((point, i) => (
              <div key={i} className="space-y-4 p-6 rounded-[24px] bg-white/5 border border-white/5 hover:border-pink/30 transition-all group">
                <div className="w-12 h-12 rounded-xl bg-pink/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <point.icon size={24} className="text-pink" />
                </div>
                <h3 className="text-xl font-bold text-white">{point.title}</h3>
                <p className="text-text text-sm leading-relaxed">{point.content}</p>
              </div>
            ))}
          </div>
          
          <div className="mt-12 text-center text-white/30 text-sm max-w-2xl mx-auto">
            Mọi thắc mắc về chính sách bảo mật, vui lòng liên hệ chúng tôi qua email: <span className="text-pink">privacy@ethnodiscovery.vn</span>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
