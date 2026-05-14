"use client";

import { useState, useEffect } from "react";
import { ArrowUp } from "lucide-react";

export function ScrollToTop() {
  const [isVisible, setIsVisible] = useState(false);

  // Show button when page is scrolled down
  useEffect(() => {
    const toggleVisibility = () => {
      if (window.scrollY > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", toggleVisibility);
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  if (!isVisible) return null;

  return (
    <button
      onClick={scrollToTop}
      aria-label="Quay về đầu trang"
      style={{
        position: "fixed",
        bottom: "100px", // Just above the Customer Care Widget (which is at 30px, height 60px -> 90px)
        right: "35px",
        width: "50px",
        height: "50px",
        borderRadius: "25px",
        background: "rgba(255, 255, 255, 0.1)",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
        border: "1px solid rgba(255, 255, 255, 0.2)",
        color: "var(--amber)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        cursor: "pointer",
        zIndex: 9998,
        transition: "all 0.3s ease",
        boxShadow: "0 4px 15px rgba(0, 0, 0, 0.3)",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = "rgba(255, 214, 10, 0.2)";
        e.currentTarget.style.border = "1px solid var(--amber)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = "rgba(255, 255, 255, 0.1)";
        e.currentTarget.style.border = "1px solid rgba(255, 255, 255, 0.2)";
      }}
    >
      <ArrowUp size={24} />
    </button>
  );
}
