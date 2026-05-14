"use client";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Leaf, ShieldCheck, UserCheck, Scale, FileText } from "lucide-react";

export default function TermsPage() {
  const sections = [
    {
      title: "1. Chấp nhận điều khoản",
      icon: UserCheck,
      content: "Bằng cách truy cập và sử dụng dịch vụ của EthnoDiscovery, bạn đồng ý tuân thủ các điều khoản và điều kiện này. Nếu bạn không đồng ý, vui lòng ngừng sử dụng dịch vụ."
    },
    {
      title: "2. Đặt chỗ và Thanh toán",
      icon: Scale,
      content: "Các đơn đặt chỗ (Tours/Homestays) chỉ được xác nhận chính thức sau khi thanh toán thành công. Chúng tôi sử dụng hệ thống SePay tự động để đối soát giao dịch."
    },
    {
      title: "3. Chính sách hoàn huỷ",
      icon: FileText,
      content: "Việc huỷ đơn hàng phải được thực hiện trước ít nhất 7 ngày để được hoàn tiền 100%. Huỷ trong vòng 3-7 ngày sẽ được hoàn 50%. Huỷ dưới 3 ngày sẽ không được hoàn tiền."
    },
    {
      title: "4. Trách nhiệm của khách hàng",
      icon: ShieldCheck,
      content: "Khách hàng có trách nhiệm cung cấp thông tin chính xác, tuân thủ các quy định văn hoá bản địa tại các điểm đến và tự bảo quản tài sản cá nhân."
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
            <h1 className="font-serif text-5xl font-black text-white mb-4">Điều Khoản Dịch Vụ</h1>
            <p className="text-white/50">Cập nhật lần cuối: 14/05/2026</p>
          </div>

          <div className="glass rounded-[40px] p-10 md:p-16 border-white/10 space-y-12 animate-fade-in">
            {sections.map((section, i) => (
              <div key={i} className="relative pl-16">
                <div className="absolute left-0 top-0 w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center border border-white/10">
                  <section.icon size={24} className="text-pink" />
                </div>
                <h3 className="text-xl font-bold text-white mb-4">{section.title}</h3>
                <p className="text-text leading-relaxed">{section.content}</p>
              </div>
            ))}
            
            <div className="pt-10 border-t border-white/10">
              <p className="text-sm text-white/30 text-center italic">
                EthnoDiscovery có quyền thay đổi các điều khoản này bất cứ lúc nào. Việc bạn tiếp tục sử dụng dịch vụ đồng nghĩa với việc chấp nhận các thay đổi đó.
              </p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
