"use client";
import { useState, useEffect } from "react";
import { X, Loader2, Save, Plus, Trash2 } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { destinationsApi } from "@/lib/api";

interface TourModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: any) => void;
  isLoading: boolean;
  initialData?: any;
}

export function TourModal({ isOpen, onClose, onSave, isLoading, initialData }: TourModalProps) {
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    description: "",
    destinationId: "",
    durationDays: 3,
    maxGroupSize: 10,
    pricePerPerson: 0,
    coverImage: "",
    images: "[]",
    includes: "[]",
    excludes: "[]",
    itinerary: "[]",
    featured: false,
    active: true
  });

  const { data: destsData } = useQuery({
    queryKey: ["admin-destinations-list"],
    queryFn: () => destinationsApi.getAll({ limit: 100 }).then(r => r.data),
    enabled: isOpen
  });

  const destinations = destsData?.data || [];

  useEffect(() => {
    if (initialData) {
      setFormData({
        ...initialData,
        destinationId: initialData.destinationId?.toString() || "",
        images: typeof initialData.images === 'string' ? initialData.images : JSON.stringify(initialData.images || []),
        includes: typeof initialData.includes === 'string' ? initialData.includes : JSON.stringify(initialData.includes || []),
        excludes: typeof initialData.excludes === 'string' ? initialData.excludes : JSON.stringify(initialData.excludes || []),
        itinerary: typeof initialData.itinerary === 'string' ? initialData.itinerary : JSON.stringify(initialData.itinerary || [])
      });
    } else {
      setFormData({
        title: "",
        slug: "",
        description: "",
        destinationId: "",
        durationDays: 3,
        maxGroupSize: 10,
        pricePerPerson: 0,
        coverImage: "",
        images: "[]",
        includes: "[]",
        excludes: "[]",
        itinerary: "[]",
        featured: false,
        active: true
      });
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      ...formData,
      destinationId: Number(formData.destinationId),
      pricePerPerson: Number(formData.pricePerPerson),
      durationDays: Number(formData.durationDays),
      maxGroupSize: Number(formData.maxGroupSize)
    });
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-midnight/80 backdrop-blur-sm" onClick={onClose} />
      
      <div className="glass w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-[32px] border border-white/10 shadow-2xl relative z-10 flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-white/10 flex items-center justify-between sticky top-0 bg-midnight/50 backdrop-blur-md z-20">
          <h3 className="font-serif text-2xl font-bold text-white">
            {initialData ? "Chỉnh sửa Tour" : "Thêm Tour Mới"}
          </h3>
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full text-white/50 transition-colors">
            <X size={24} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-8 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="block text-[10px] font-bold text-pink uppercase tracking-widest mb-2">Tiêu đề Tour</label>
              <input 
                required
                value={formData.title}
                onChange={e => setFormData({...formData, title: e.target.value})}
                className="input" 
                placeholder="Ví dụ: Khám phá Cao nguyên đá Đồng Văn 4N3Đ"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-pink uppercase tracking-widest mb-2">Slug (URL)</label>
              <input 
                required
                value={formData.slug}
                onChange={e => setFormData({...formData, slug: e.target.value})}
                className="input" 
                placeholder="ví dụ: kham-pha-dong-van"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-pink uppercase tracking-widest mb-2">Điểm Đến</label>
              <select 
                required
                value={formData.destinationId}
                onChange={e => setFormData({...formData, destinationId: e.target.value})}
                className="input appearance-none"
              >
                <option value="">Chọn điểm đến...</option>
                {destinations.map((d: any) => <option key={d.id} value={d.id}>{d.nameVi}</option>)}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-[10px] font-bold text-pink uppercase tracking-widest mb-2">Thời gian (Ngày)</label>
              <input 
                type="number"
                value={formData.durationDays}
                onChange={e => setFormData({...formData, durationDays: Number(e.target.value)})}
                className="input" 
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-pink uppercase tracking-widest mb-2">Số người tối đa</label>
              <input 
                type="number"
                value={formData.maxGroupSize}
                onChange={e => setFormData({...formData, maxGroupSize: Number(e.target.value)})}
                className="input" 
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-pink uppercase tracking-widest mb-2">Giá / Người (₫)</label>
              <input 
                type="number"
                value={formData.pricePerPerson}
                onChange={e => setFormData({...formData, pricePerPerson: Number(e.target.value)})}
                className="input" 
              />
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-bold text-pink uppercase tracking-widest mb-2">Mô tả ngắn</label>
            <textarea 
              rows={4}
              value={formData.description}
              onChange={e => setFormData({...formData, description: e.target.value})}
              className="input resize-none" 
              placeholder="Nhập mô tả về chuyến đi..."
            />
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

          <div className="space-y-4">
             <label className="block text-[10px] font-bold text-pink uppercase tracking-widest">Dữ liệu chi tiết (JSON format)</label>
             <p className="text-[10px] text-white/30 italic">Lưu ý: Nhập đúng định dạng mảng JSON [ "mục 1", "mục 2" ]</p>
             
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-[10px] text-white/50 mb-2 uppercase">Bao gồm (Includes)</label>
                  <textarea 
                    value={formData.includes}
                    onChange={e => setFormData({...formData, includes: e.target.value})}
                    className="input text-xs font-mono h-32"
                  />
                </div>
                <div>
                  <label className="block text-[10px] text-white/50 mb-2 uppercase">Không bao gồm (Excludes)</label>
                  <textarea 
                    value={formData.excludes}
                    onChange={e => setFormData({...formData, excludes: e.target.value})}
                    className="input text-xs font-mono h-32"
                  />
                </div>
             </div>
             
             <div>
                <label className="block text-[10px] text-white/50 mb-2 uppercase">Lịch trình (Itinerary - JSON Array)</label>
                <textarea 
                  value={formData.itinerary}
                  onChange={e => setFormData({...formData, itinerary: e.target.value})}
                  className="input text-xs font-mono h-48"
                  placeholder='[{"day":1, "title":"...", "activities":["..."]}]'
                />
             </div>
          </div>

          <div className="flex gap-8 p-4 bg-white/5 rounded-2xl border border-white/5">
            <label className="flex items-center gap-3 cursor-pointer">
              <input 
                type="checkbox" 
                checked={formData.featured}
                onChange={e => setFormData({...formData, featured: e.target.checked})}
                className="w-5 h-5 rounded border-white/10 bg-white/5 text-pink focus:ring-pink" 
              />
              <span className="text-sm font-bold text-white">Tour nổi bật</span>
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
