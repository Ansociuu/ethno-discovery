"use client";
import { useState, useEffect } from "react";
import { X, Loader2, Save } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { destinationsApi } from "@/lib/api";
import { ImageUpload } from "@/components/ui/ImageUpload";

interface HomestayModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: any) => void;
  isLoading: boolean;
  initialData?: any;
}

export function HomestayModal({ isOpen, onClose, onSave, isLoading, initialData }: HomestayModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    description: "",
    destinationId: "",
    address: "",
    pricePerNight: 0,
    maxGuests: 10,
    coverImage: "",
    images: "[]",
    amenities: "[]",
    featured: false,
    active: true
  });

  const { data: destsData } = useQuery({
    queryKey: ["admin-destinations-list-hs"],
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
        amenities: typeof initialData.amenities === 'string' ? initialData.amenities : JSON.stringify(initialData.amenities || [])
      });
    } else {
      setFormData({
        name: "",
        slug: "",
        description: "",
        destinationId: "",
        address: "",
        pricePerNight: 0,
        maxGuests: 10,
        coverImage: "",
        images: "[]",
        amenities: "[]",
        featured: false,
        active: true
      });
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Sanitize and parse data
    const { destination, reviews, _count, createdAt, updatedAt, ...sanitizedData } = formData as any;
    
    const parseJson = (str: string) => {
      try { return typeof str === 'string' ? JSON.parse(str) : str; }
      catch (e) { return []; }
    };

    onSave({
      ...sanitizedData,
      destinationId: Number(formData.destinationId),
      pricePerNight: Number(formData.pricePerNight),
      maxGuests: Number(formData.maxGuests),
      images: parseJson(formData.images),
      amenities: parseJson(formData.amenities)
    });
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-midnight/80 backdrop-blur-sm" onClick={onClose} />
      
      <div className="glass w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-[32px] border border-white/10 shadow-2xl relative z-10 flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-white/10 flex items-center justify-between sticky top-0 bg-midnight/50 backdrop-blur-md z-20">
          <h3 className="font-serif text-2xl font-bold text-white">
            {initialData ? "Chỉnh sửa Homestay" : "Thêm Homestay Mới"}
          </h3>
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full text-white/50 transition-colors">
            <X size={24} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="block text-[10px] font-bold text-pink uppercase tracking-widest mb-2">Tên Homestay</label>
              <input 
                required
                value={formData.name}
                onChange={e => setFormData({...formData, name: e.target.value})}
                className="input" 
                placeholder="Ví dụ: Bản Cát Cát Homestay"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-pink uppercase tracking-widest mb-2">Slug (URL)</label>
              <input 
                required
                value={formData.slug}
                onChange={e => setFormData({...formData, slug: e.target.value})}
                className="input" 
                placeholder="ví dụ: ban-cat-cat-homestay"
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

          <div>
            <label className="block text-[10px] font-bold text-pink uppercase tracking-widest mb-2">Địa chỉ chi tiết</label>
            <input 
              required
              value={formData.address}
              onChange={e => setFormData({...formData, address: e.target.value})}
              className="input" 
              placeholder="Bản Cát Cát, Sa Pa, Lào Cai"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-[10px] font-bold text-pink uppercase tracking-widest mb-2">Giá / Đêm (₫)</label>
              <input 
                type="number"
                value={formData.pricePerNight}
                onChange={e => setFormData({...formData, pricePerNight: Number(e.target.value)})}
                className="input" 
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-pink uppercase tracking-widest mb-2">Số khách tối đa</label>
              <input 
                type="number"
                value={formData.maxGuests}
                onChange={e => setFormData({...formData, maxGuests: Number(e.target.value)})}
                className="input" 
              />
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-bold text-pink uppercase tracking-widest mb-2">Mô tả</label>
            <textarea 
              rows={4}
              value={formData.description}
              onChange={e => setFormData({...formData, description: e.target.value})}
              className="input resize-none" 
              placeholder="Nhập mô tả về homestay..."
            />
          </div>

          <ImageUpload 
            label="Ảnh bìa"
            value={formData.coverImage}
            onChange={url => setFormData({...formData, coverImage: url})}
          />

          <div>
            <label className="block text-[10px] font-bold text-pink uppercase tracking-widest mb-2">Tiện ích (JSON Array)</label>
            <input 
              value={formData.amenities}
              onChange={e => setFormData({...formData, amenities: e.target.value})}
              className="input font-mono text-xs" 
              placeholder='["WiFi", "Bữa sáng", "Nước nóng"]'
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
              <span className="text-sm font-bold text-white">Nổi bật (Superhost)</span>
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
