"use client";
import { CreditCard } from "lucide-react";

interface StickyBookingBarProps {
  price: number;
  label: string;
  onBook: () => void;
  isLoading?: boolean;
  unit?: string;
}

export function StickyBookingBar({ price, label, onBook, isLoading, unit = "/ khách" }: StickyBookingBarProps) {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-[100] md:hidden bg-midnight/90 backdrop-blur-xl border-t border-glass-border p-4 flex items-center justify-between animate-fade-up">
      <div className="flex flex-col">
        <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Giá từ</span>
        <div className="flex items-baseline gap-1">
          <span className="text-xl font-black text-amber">
            {price.toLocaleString("vi-VN")}₫
          </span>
          <span className="text-[10px] text-white/30">{unit}</span>
        </div>
      </div>
      
      <button 
        onClick={onBook}
        disabled={isLoading}
        className="btn-primary py-3 px-8 rounded-xl font-black text-sm shadow-lg shadow-pink/20"
      >
        {isLoading ? "Đang xử lý..." : label}
      </button>
    </div>
  );
}
