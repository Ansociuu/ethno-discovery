"use client";

import { useState, useRef, useEffect } from "react";
import { MessageCircle, X, Send, Phone, User, Bot, Loader2 } from "lucide-react";
import Link from "next/link";

type Message = {
  role: "user" | "assistant";
  content: string;
};

export function CustomerCareWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"chat" | "contact">("chat");
  const [messages, setMessages] = useState<Message[]>([
    { role: "assistant", content: "Xin chào! Tôi là Trợ lý Ảo của EthnoDiscovery. Bạn cần hỗ trợ thông tin gì về việc đặt tour hay homestay hôm nay?" }
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Auto-scroll to bottom of chat
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isTyping]);

  // Handle body scroll and visibility of other elements
  useEffect(() => {
    if (isOpen) {
      document.body.classList.add("chat-open");
    } else {
      document.body.classList.remove("chat-open");
    }
    return () => document.body.classList.remove("chat-open");
  }, [isOpen]);

  const handleSend = async () => {
    if (!input.trim() || isTyping) return;

    const userMsg = input.trim();
    setInput("");
    
    const newMessages = [...messages, { role: "user" as const, content: userMsg }];
    setMessages(newMessages);
    setIsTyping(true);

    try {
      const token = localStorage.getItem("token"); // Optional: if we want to attach auth
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/ai/chatbot`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        },
        body: JSON.stringify({ messages: newMessages }),
      });

      if (!res.ok) throw new Error("Lỗi kết nối API");
      if (!res.body) throw new Error("No stream");

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";
      let aiResponse = "";

      // Add a placeholder message for the AI
      setMessages((prev) => [...prev, { role: "assistant", content: "" }]);

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        
        const parts = buffer.split('\n\n');
        buffer = parts.pop() || "";
        
        for (const part of parts) {
          const lines = part.split('\n').filter(l => l.startsWith('data: '));
          for (const line of lines) {
            try {
              const json = JSON.parse(line.slice(6));
              if (json.error) throw new Error(json.error);
              if (json.chunk) {
                aiResponse += json.chunk;
                // Update the last message
                setMessages((prev) => {
                  const updated = [...prev];
                  updated[updated.length - 1].content = aiResponse;
                  return updated;
                });
              }
            } catch (e: any) {
              if (!(e instanceof SyntaxError)) {
                console.error("Stream error:", e);
              }
            }
          }
        }
      }
    } catch (error) {
      console.error(error);
      setMessages((prev) => [...prev, { role: "assistant", content: "Xin lỗi, hệ thống AI đang bận. Vui lòng thử lại hoặc liên hệ Hotline để được hỗ trợ trực tiếp." }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <>
      {/* Floating Action Button */}
      <div
        className={`fixed z-[999] transition-all duration-300 ${
          isOpen ? "opacity-0 invisible scale-90" : "opacity-100 visible scale-100"
        } bottom-[100px] right-5 md:bottom-8 md:right-8`}
        style={{ animation: !isOpen ? "pulse 2s infinite" : "none" }}
      >
        <button
          onClick={() => setIsOpen(true)}
          className="w-[60px] h-[60px] rounded-[30px] flex items-center justify-center transition-all active:scale-95 bg-gradient-to-tr from-[#FF3CAC] to-[#EE1D52] text-white shadow-[0_10px_25px_rgba(255,60,172,0.4)] hover:scale-105"
        >
          <MessageCircle size={28} />
        </button>
      </div>

      {/* Widget Panel */}
      <div
        className={`fixed z-[9998] transition-all duration-500 ease-in-out bg-midnight/95 backdrop-blur-2xl border-amber/30 border shadow-2xl overflow-hidden flex flex-col
          ${isOpen 
            ? "opacity-100 translate-y-0 visible" 
            : "opacity-0 translate-y-10 invisible pointer-events-none"}
          /* Mobile: Bottom Sheet Style */
          bottom-0 left-0 right-0 h-[80vh] rounded-t-[32px] md:rounded-[24px]
          /* Desktop: Floating Panel Style */
          md:bottom-24 md:right-8 md:left-auto md:w-[380px] md:h-[600px] md:max-h-[70vh]
        `}
      >
        {/* Header */}
        <div className="bg-amber/10 p-5 md:p-6 border-b border-white/10 flex justify-between items-center shrink-0">
          <div>
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              EthnoDiscovery Care <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
            </h3>
            <p className="text-xs text-amber mt-1 opacity-80">Luôn sẵn sàng hỗ trợ bạn</p>
          </div>
          <button 
            onClick={() => setIsOpen(false)}
            className="w-10 h-10 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors text-white"
          >
            <X size={20} />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-white/5 shrink-0 bg-white/5">
          <button 
            onClick={() => setActiveTab("chat")}
            className={`flex-1 py-4 text-sm font-medium transition-all border-b-2 ${
              activeTab === "chat" ? "text-amber border-amber bg-amber/5" : "text-white/40 border-transparent"
            }`}
          >
            Chat AI
          </button>
          <button 
            onClick={() => setActiveTab("contact")}
            className={`flex-1 py-4 text-sm font-medium transition-all border-b-2 ${
              activeTab === "contact" ? "text-amber border-amber bg-amber/5" : "text-white/40 border-transparent"
            }`}
          >
            Liên hệ
          </button>
        </div>

        {/* Tab Content */}
        <div className="flex-1 overflow-hidden flex flex-col relative pb-safe">
          
          {/* Chat View */}
          {activeTab === "chat" && (
            <>
              <div className="flex-1 overflow-y-auto p-5 flex flex-col gap-5 scrollbar-hide">
                {messages.map((msg, idx) => (
                  <div key={idx} className={`flex gap-3 ${msg.role === "user" ? "flex-row-reverse" : "flex-row"}`}>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 shadow-sm ${
                      msg.role === "user" ? "bg-white/10" : "bg-amber/20"
                    }`}>
                      {msg.role === "user" ? <User size={16} className="text-white" /> : <Bot size={16} className="text-amber" />}
                    </div>
                    <div className={`p-4 rounded-2xl max-w-[85%] text-sm leading-relaxed shadow-sm ${
                      msg.role === "user" 
                        ? "bg-amber text-black rounded-tr-none font-medium" 
                        : "bg-white/5 text-white border border-white/5 rounded-tl-none"
                    }`}>
                      {msg.content}
                    </div>
                  </div>
                ))}
                {isTyping && (
                  <div className="flex gap-3">
                    <div className="w-8 h-8 rounded-full bg-amber/20 flex items-center justify-center">
                      <Bot size={16} className="text-amber" />
                    </div>
                    <div className="bg-white/5 px-4 py-3 rounded-2xl rounded-tl-none flex items-center border border-white/5">
                      <Loader2 size={16} className="animate-spin text-amber" />
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} className="h-4" />
              </div>

              {/* Input Area */}
              <div className="p-4 md:p-5 border-t border-white/10 bg-midnight/50 backdrop-blur-md">
                <div className="flex gap-3 items-center bg-white/5 p-1.5 rounded-full border border-white/10 focus-within:border-amber/50 transition-colors">
                  <input 
                    type="text" 
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSend()}
                    placeholder="Bạn cần hỗ trợ gì?"
                    className="flex-1 bg-transparent border-none text-white px-4 py-2 outline-none text-sm placeholder:text-white/20"
                  />
                  <button 
                    onClick={handleSend} 
                    disabled={!input.trim() || isTyping} 
                    className="btn-primary w-10 h-10 rounded-full p-0 flex items-center justify-center shrink-0 disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    <Send size={16} />
                  </button>
                </div>
              </div>
            </>
          )}

          {/* Contact View */}
          {activeTab === "contact" && (
            <div className="p-8 flex flex-col gap-5 h-full overflow-y-auto">
              <p className="text-white/50 text-sm text-center mb-4 leading-relaxed">
                Đội ngũ của chúng tôi luôn sẵn sàng hỗ trợ bạn từ 8:00 đến 22:00 hàng ngày.
              </p>

              {/* Zalo Button */}
              <Link href="https://zalo.me/0364603462" target="_blank" className="flex items-center gap-4 bg-white/5 p-5 rounded-3xl border border-white/5 hover:border-blue-500/50 hover:bg-blue-500/5 transition-all group">
                <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                  <MessageCircle size={24} className="text-white" />
                </div>
                <div>
                  <h4 className="text-white font-bold text-base">Chat qua Zalo</h4>
                  <p className="text-amber text-sm font-semibold mt-0.5">0364 603 462</p>
                </div>
              </Link>

              {/* Hotline Button */}
              <Link href="tel:0364603462" className="flex items-center gap-4 bg-white/5 p-5 rounded-3xl border border-white/5 hover:border-amber/50 hover:bg-amber/5 transition-all group">
                <div className="w-12 h-12 bg-amber/20 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                  <Phone size={24} className="text-amber" />
                </div>
                <div>
                  <h4 className="text-white font-bold text-base">Gọi Hotline</h4>
                  <p className="text-amber text-sm font-semibold mt-0.5">0364 603 462</p>
                </div>
              </Link>
              
              <div className="mt-auto text-center py-4">
                <span className="text-[11px] text-white/30 uppercase tracking-widest font-bold">Cam kết phản hồi trong 5 phút</span>
              </div>
            </div>
          )}
        </div>
      </div>
      
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes pulse {
          0% { box-shadow: 0 0 0 0 rgba(255, 214, 10, 0.4); }
          70% { box-shadow: 0 0 0 15px rgba(255, 214, 10, 0); }
          100% { box-shadow: 0 0 0 0 rgba(255, 214, 10, 0); }
        }
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
      `}} />
    </>
  );
}
