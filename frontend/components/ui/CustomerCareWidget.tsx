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
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="btn-primary"
        style={{
          position: "fixed",
          bottom: "30px",
          right: "30px",
          width: "60px",
          height: "60px",
          borderRadius: "30px",
          padding: 0,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          boxShadow: "0 10px 25px rgba(255, 214, 10, 0.4)",
          zIndex: 9999,
          animation: !isOpen ? "pulse 2s infinite" : "none",
        }}
      >
        {isOpen ? <X size={28} /> : <MessageCircle size={28} />}
      </button>

      {/* Widget Panel */}
      {isOpen && (
        <div
          className="glass"
          style={{
            position: "fixed",
            bottom: "100px",
            right: "30px",
            width: "350px",
            height: "500px",
            borderRadius: "24px",
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
            zIndex: 9998,
            boxShadow: "0 20px 40px rgba(0,0,0,0.5)",
            border: "1px solid var(--amber)",
          }}
        >
          {/* Header */}
          <div style={{ background: "rgba(255, 214, 10, 0.15)", padding: "20px", borderBottom: "1px solid var(--glass-border)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <h3 style={{ fontSize: 18, fontWeight: 700, color: "#fff", margin: 0, display: "flex", alignItems: "center", gap: 8 }}>
                EthnoDiscovery Care <div style={{ width: 8, height: 8, background: "#10B981", borderRadius: 4 }}></div>
              </h3>
              <p style={{ fontSize: 13, color: "var(--amber)", margin: "4px 0 0 0" }}>Luôn sẵn sàng hỗ trợ bạn</p>
            </div>
          </div>

          {/* Tabs */}
          <div style={{ display: "flex", borderBottom: "1px solid var(--glass-border)" }}>
            <button 
              onClick={() => setActiveTab("chat")}
              style={{ flex: 1, padding: "12px", background: "transparent", border: "none", color: activeTab === "chat" ? "var(--amber)" : "#888", fontWeight: activeTab === "chat" ? 600 : 400, borderBottom: activeTab === "chat" ? "2px solid var(--amber)" : "2px solid transparent", cursor: "pointer", transition: "all 0.2s" }}
            >
              Chat AI
            </button>
            <button 
              onClick={() => setActiveTab("contact")}
              style={{ flex: 1, padding: "12px", background: "transparent", border: "none", color: activeTab === "contact" ? "var(--amber)" : "#888", fontWeight: activeTab === "contact" ? 600 : 400, borderBottom: activeTab === "contact" ? "2px solid var(--amber)" : "2px solid transparent", cursor: "pointer", transition: "all 0.2s" }}
            >
              Liên hệ
            </button>
          </div>

          {/* Tab Content */}
          <div style={{ flex: 1, overflow: "hidden", display: "flex", flexDirection: "column", position: "relative" }}>
            
            {/* Chat View */}
            {activeTab === "chat" && (
              <>
                <div style={{ flex: 1, overflowY: "auto", padding: "20px", display: "flex", flexDirection: "column", gap: 16 }}>
                  {messages.map((msg, idx) => (
                    <div key={idx} style={{ display: "flex", gap: 12, flexDirection: msg.role === "user" ? "row-reverse" : "row" }}>
                      <div style={{ width: 32, height: 32, borderRadius: 16, background: msg.role === "user" ? "rgba(255,255,255,0.1)" : "rgba(255, 214, 10, 0.2)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                        {msg.role === "user" ? <User size={16} color="#fff" /> : <Bot size={16} color="var(--amber)" />}
                      </div>
                      <div style={{ background: msg.role === "user" ? "var(--amber)" : "rgba(255,255,255,0.05)", color: msg.role === "user" ? "#000" : "#fff", padding: "12px 16px", borderRadius: "16px", borderTopRightRadius: msg.role === "user" ? 4 : 16, borderTopLeftRadius: msg.role === "assistant" ? 4 : 16, fontSize: 14, lineHeight: 1.6, maxWidth: "80%", wordWrap: "break-word" }}>
                        {msg.content}
                      </div>
                    </div>
                  ))}
                  {isTyping && (
                    <div style={{ display: "flex", gap: 12 }}>
                      <div style={{ width: 32, height: 32, borderRadius: 16, background: "rgba(255, 214, 10, 0.2)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <Bot size={16} color="var(--amber)" />
                      </div>
                      <div style={{ background: "rgba(255,255,255,0.05)", padding: "12px 16px", borderRadius: "16px", borderTopLeftRadius: 4, display: "flex", alignItems: "center" }}>
                        <Loader2 size={16} className="animate-spin" color="var(--amber)" />
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>
                <div style={{ padding: "16px", borderTop: "1px solid var(--glass-border)", background: "rgba(10, 10, 15, 0.9)", display: "flex", gap: 10 }}>
                  <input 
                    type="text" 
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSend()}
                    placeholder="Nhập tin nhắn..."
                    style={{ flex: 1, background: "rgba(255,255,255,0.05)", border: "1px solid var(--glass-border)", color: "#fff", borderRadius: 20, padding: "10px 16px", outline: "none", fontSize: 14 }}
                  />
                  <button onClick={handleSend} disabled={!input.trim() || isTyping} className="btn-primary" style={{ width: 42, height: 42, borderRadius: 21, padding: 0, display: "flex", justifyContent: "center", alignItems: "center", opacity: !input.trim() || isTyping ? 0.5 : 1 }}>
                    <Send size={16} />
                  </button>
                </div>
              </>
            )}

            {/* Contact View */}
            {activeTab === "contact" && (
              <div style={{ padding: "30px 20px", display: "flex", flexDirection: "column", gap: 20, height: "100%" }}>
                <p style={{ color: "#aaa", fontSize: 14, textAlign: "center", marginBottom: 10 }}>
                  Đội ngũ của chúng tôi luôn sẵn sàng hỗ trợ bạn từ 8:00 đến 22:00 hàng ngày.
                </p>

                {/* Zalo Button */}
                <Link href="https://zalo.me/0364603462" target="_blank" style={{ display: "flex", alignItems: "center", gap: 16, background: "rgba(255,255,255,0.05)", padding: "20px", borderRadius: 16, textDecoration: "none", border: "1px solid var(--glass-border)", transition: "all 0.3s" }}>
                  <div style={{ width: 48, height: 48, background: "#0068FF", borderRadius: 24, display: "flex", justifyContent: "center", alignItems: "center" }}>
                    <MessageCircle size={24} color="#fff" />
                  </div>
                  <div>
                    <h4 style={{ color: "#fff", margin: "0 0 4px 0", fontSize: 16 }}>Chat qua Zalo</h4>
                    <p style={{ color: "var(--amber)", margin: 0, fontSize: 14, fontWeight: 600 }}>0364 603 462</p>
                  </div>
                </Link>

                {/* Hotline Button */}
                <Link href="tel:0364603462" style={{ display: "flex", alignItems: "center", gap: 16, background: "rgba(255,255,255,0.05)", padding: "20px", borderRadius: 16, textDecoration: "none", border: "1px solid var(--glass-border)", transition: "all 0.3s" }}>
                  <div style={{ width: 48, height: 48, background: "rgba(255, 214, 10, 0.2)", borderRadius: 24, display: "flex", justifyContent: "center", alignItems: "center" }}>
                    <Phone size={24} color="var(--amber)" />
                  </div>
                  <div>
                    <h4 style={{ color: "#fff", margin: "0 0 4px 0", fontSize: 16 }}>Gọi Hotline</h4>
                    <p style={{ color: "var(--amber)", margin: 0, fontSize: 14, fontWeight: 600 }}>0364 603 462</p>
                  </div>
                </Link>
                
                <div style={{ marginTop: "auto", textAlign: "center", fontSize: 12, color: "#666" }}>
                  Cam kết phản hồi trong vòng 5 phút.
                </div>
              </div>
            )}
          </div>
        </div>
      )}
      
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes pulse {
          0% { box-shadow: 0 0 0 0 rgba(255, 214, 10, 0.7); }
          70% { box-shadow: 0 0 0 15px rgba(255, 214, 10, 0); }
          100% { box-shadow: 0 0 0 0 rgba(255, 214, 10, 0); }
        }
      `}} />
    </>
  );
}
