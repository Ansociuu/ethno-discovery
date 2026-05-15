"use client";
import { useState, useEffect } from "react";
import { X, Loader2, Save } from "lucide-react";

interface DestinationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: any) => void;
  isLoading: boolean;
  initialData?: any;
}

export function DestinationModal({ isOpen, onClose, onSave, isLoading, initialData }: DestinationModalProps) {
  const [formData, setFormData] = useState({
    nameVi: "",
    nameEn: "",
    slug: "",
    province: "Hà Giang",
    description: "",
    coverImage: "",
    images: "[]",
    altitude: 1000,
    bestSeason: "",
    difficulty: "EASY",
    featured: false,
    active: true
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        ...initialData,
        images: typeof initialData.images === 'string' ? initialData.images : JSON.stringify(initialData.images || [])
      });
    } else {
      setFormData({
        nameVi: "",
        nameEn: "",
        slug: "",
        province: "Hà Giang",
        description: "",
        coverImage: "",
        images: "[]",
        altitude: 1000,
        bestSeason: "",
        difficulty: "EASY",
        featured: false,
        active: true
      });
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  const provinces = ["Hà Giang", "Lào Cai", "Sơn La", "Lai Châu", "Điện Biên", "Yên Bái"];
  const difficulties = ["EASY", "MODERATE", "HARD", "EXPERT"];

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-midnight/80 backdrop-blur-sm" onClick={onClose} />
      
      <div className="glass w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-[32px] border border-white/10 shadow-2xl relative z-10 flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-white/10 flex items-center justify-between sticky top-0 bg-midnight/50 backdrop-blur-md z-20">
          <h3 className="font-serif text-2xl font-bold text-white">
            {initialData ? "Chỉnh sửa Điểm Đến" : "Thêm Điểm Đến Mới"}
          </h3>
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full text-white/50 transition-colors">
            <X size={24} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-[10px] font-bold text-pink uppercase tracking-widest mb-2">Tên Tiếng Việt</label>
              <input 
                required
                value={formData.nameVi}
                onChange={e => setFormData({...formData, nameVi: e.target.value})}
                className="input" 
                placeholder="Ví dụ: Đồng Văn"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-pink uppercase tracking-widest mb-2">Tên Tiếng Anh</label>
              <input 
                value={formData.nameEn}
                onChange={e => setFormData({...formData, nameEn: e.target.value})}
                className="input" 
                placeholder="Ví dụ: Dong Van"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-pink uppercase tracking-widest mb-2">Slug (URL)</label>
              <input 
                required
                value={formData.slug}
                onChange={e => setFormData({...formData, slug: e.target.value})}
                className="input" 
                placeholder="ví dụ: dong-van"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-pink uppercase tracking-widest mb-2">Tỉnh / Vùng</label>
              <select 
                value={formData.province}
                onChange={e => setFormData({...formData, province: e.target.value})}
                className="input appearance-none"
              >
                {provinces.map(p => <option key={p} value={p}>{p}</option>)}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-bold text-pink uppercase tracking-widest mb-2">Mô tả</label>
            <textarea 
              rows={4}
              value={formData.description}
              onChange={e => setFormData({...formData, description: e.target.value})}
              className="input resize-none" 
              placeholder="Nhập mô tả về điểm đến..."
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-[10px] font-bold text-pink uppercase tracking-widest mb-2">Độ cao (m)</label>
              <input 
                type="number"
                value={formData.altitude}
                onChange={e => setFormData({...formData, altitude: Number(e.target.value)})}
                className="input" 
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-pink uppercase tracking-widest mb-2">Độ khó (Địa hình)</label>
              <select 
                value={formData.difficulty}
                onChange={e => setFormData({...formData, difficulty: e.target.value})}
                className="input appearance-none"
              >
                {difficulties.map(d => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-bold text-pink uppercase tracking-widest mb-2">Ảnh bìa (URL)</label>
            <input 
              value={formData.coverImage}
              onChange={e => setFormData({...formData, coverImage: e.target.value})}
              className="input" 
              placeholder="https://images.unsplash.com/..."
            />
          </div>

          <div className="flex gap-8 p-4 bg-white/5 rounded-2xl border border-white/5">
            <label className="flex items-center gap-3 cursor-pointer">
              <input 
                type="checkbox" 
                checked={formData.featured}
                onChange={e => setFormData({...formData, featured: e.target.checked})}
                className="w-5 h-5 rounded border-white/10 bg-white/5 text-pink focus:ring-pink" 
              />
              <span className="text-sm font-bold text-white">Nổi bật (Trang chủ)</span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer">
              <input 
                type="checkbox" 
                checked={formData.active}
                onChange={e => setFormData({...formData, active: e.target.checked})}
                className="w-5 h-5 rounded border-white/10 bg-white/5 text-pink focus:ring-pink" 
              />
              <span className="text-sm font-bold text-white">Đang hoạt động</span>
            </label>
          </div>

          {/* Footer Actions */}
          <div className="flex justify-end gap-4 pt-6 border-t border-white/10 sticky bottom-0 bg-midnight/50 backdrop-blur-md pb-2">
            <button 
              type="button"
              onClick={onClose}
              className="btn-ghost py-3 px-8 text-sm"
            >
              Hủy
            </button>
            <button 
              type="submit"
              disabled={isLoading}
              className="btn-primary py-3 px-10 text-sm font-bold flex items-center gap-2"
            >
              {isLoading ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
              Lưu thay đổi
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
