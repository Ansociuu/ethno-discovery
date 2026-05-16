"use client";
import { Lock, Eye, Database, Share2 } from "lucide-react";

export function PrivacyContent() {
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
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      {points.map((point, i) => (
        <div key={i} className="space-y-4 p-6 rounded-[24px] bg-white/5 border border-white/5 hover:border-pink/30 transition-all group">
          <div className="w-12 h-12 rounded-xl bg-pink/10 flex items-center justify-center group-hover:scale-110 transition-transform">
            <point.icon size={24} className="text-pink" />
          </div>
          <h3 className="text-xl font-bold text-white">{point.title}</h3>
          <p className="text-text text-sm leading-relaxed">{point.content}</p>
        </div>
      ))}
      <div className="md:col-span-2 mt-4 text-center text-white/30 text-xs">
        Mọi thắc mắc về chính sách bảo mật, vui lòng liên hệ chúng tôi qua email: <span className="text-pink">privacy@ethnodiscovery.vn</span>
      </div>
    </div>
  );
}
