"use client";

import { useState, useEffect } from "react";
import { ArrowUp } from "lucide-react";

export function ScrollToTop() {
  const [isVisible, setIsVisible] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      setIsVisible(window.scrollY > 300);
    };

    // Check for chat-open class on body
    const observer = new MutationObserver(() => {
      setIsChatOpen(document.body.classList.contains("chat-open"));
    });

    observer.observe(document.body, { attributes: true, attributeFilter: ["class"] });
    window.addEventListener("scroll", toggleVisibility);

    return () => {
      window.removeEventListener("scroll", toggleVisibility);
      observer.disconnect();
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (!isVisible || isChatOpen) return null;

  return (
    <button
      onClick={scrollToTop}
      aria-label="Quay về đầu trang"
      className="fixed z-[999] bottom-44 right-5 md:bottom-28 md:right-8 w-12 h-12 rounded-full bg-white/10 backdrop-blur-xl border border-white/20 text-amber flex items-center justify-center shadow-2xl transition-all active:scale-90 hover:bg-amber/20 hover:border-amber"
    >
      <ArrowUp size={24} />
    </button>
  );
}
