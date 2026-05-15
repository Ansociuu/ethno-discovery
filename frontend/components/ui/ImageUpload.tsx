"use client";
import { useState } from "react";
import { Upload, X, Loader2, Image as ImageIcon } from "lucide-react";
import { uploadApi } from "@/lib/api";
import { toast } from "sonner";

interface ImageUploadProps {
  value: string;
  onChange: (url: string) => void;
  label?: string;
}

export function ImageUpload({ value, onChange, label }: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check file size (limit 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Ảnh không được vượt quá 5MB");
      return;
    }

    try {
      setIsUploading(true);
      const res = await uploadApi.uploadSingle(file);
      const url = res.data.data.url;
      onChange(url);
      toast.success("Tải ảnh lên thành công");
    } catch (error) {
      console.error(error);
      toast.error("Tải ảnh thất bại. Vui lòng thử lại");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-4">
      {label && <label className="block text-[10px] font-bold text-pink uppercase tracking-widest">{label}</label>}
      
      <div className="relative group">
        {value ? (
          <div className="relative w-full aspect-video rounded-2xl overflow-hidden border border-white/10 group">
            <img src={value} alt="Preview" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
              <button 
                type="button"
                onClick={() => onChange("")}
                className="p-3 bg-pink rounded-full text-white shadow-xl hover:scale-110 transition-transform"
              >
                <X size={20} />
              </button>
            </div>
          </div>
        ) : (
          <label className="flex flex-col items-center justify-center w-full aspect-video rounded-2xl border-2 border-dashed border-white/10 bg-white/5 hover:bg-white/10 hover:border-pink/50 transition-all cursor-pointer">
            {isUploading ? (
              <div className="flex flex-col items-center gap-3">
                <Loader2 className="animate-spin text-pink" size={32} />
                <span className="text-xs text-white/40 font-bold uppercase tracking-widest">Đang tải lên...</span>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-pink/10 flex items-center justify-center text-pink">
                  <Upload size={24} />
                </div>
                <div className="text-center">
                  <span className="text-sm font-bold text-white block">Tải ảnh lên từ máy</span>
                  <span className="text-[10px] text-white/30 uppercase tracking-widest font-bold">JPG, PNG hoặc WebP (Max 5MB)</span>
                </div>
              </div>
            )}
            <input 
              type="file" 
              className="hidden" 
              accept="image/*" 
              onChange={handleUpload}
              disabled={isUploading}
            />
          </label>
        )}
      </div>

      {/* URL Fallback Input */}
      <div className="relative">
        <ImageIcon size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" />
        <input 
          type="text"
          value={value}
          onChange={e => onChange(e.target.value)}
          className="input pl-10 py-3 text-xs" 
          placeholder="Hoặc nhập link ảnh (Unsplash, Pexels...)"
        />
      </div>
    </div>
  );
}
