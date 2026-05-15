"use client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { homestaysApi } from "@/lib/api";
import { toast } from "sonner";
import { Loader2, Trash2, Edit, Plus, Star } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { HomestayModal } from "@/components/admin/HomestayModal";

export default function AdminHomestaysPage() {
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ["admin-homestays"],
    queryFn: () => homestaysApi.getAll().then(r => r.data),
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingHs, setEditingHs] = useState<any>(null);

  const createMutation = useMutation({
    mutationFn: (data: any) => homestaysApi.create(data),
    onSuccess: () => {
      toast.success("Đã tạo homestay mới");
      queryClient.invalidateQueries({ queryKey: ["admin-homestays"] });
      setIsModalOpen(false);
    }
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: any }) => homestaysApi.update(id, data),
    onSuccess: () => {
      toast.success("Đã cập nhật thông tin");
      queryClient.invalidateQueries({ queryKey: ["admin-homestays"] });
      setIsModalOpen(false);
    }
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => homestaysApi.delete(id),
    onSuccess: () => {
      toast.success("Đã xóa homestay thành công");
      queryClient.invalidateQueries({ queryKey: ["admin-homestays"] });
    },
    onError: () => {
      toast.error("Không thể xóa homestay (có thể do đã có đơn đặt chỗ)");
    }
  });

  const handleSave = (formData: any) => {
    if (editingHs) {
      updateMutation.mutate({ id: editingHs.id, data: formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  const handleEdit = (hs: any) => {
    setEditingHs(hs);
    setIsModalOpen(true);
  };

  const handleAdd = () => {
    setEditingHs(null);
    setIsModalOpen(true);
  };

  const homestays = data?.data || [];

  return (
    <AdminLayout title="Quản lý Homestays" subtitle="Danh sách tất cả các điểm lưu trú bản địa">
      <div className="glass rounded-[32px] p-8">
        
        {/* Header Actions */}
        <div className="flex justify-end mb-8">
          <button className="btn-primary flex items-center gap-2 text-sm px-6 py-3" onClick={handleAdd}>
            <Plus size={16} /> Thêm Homestay Mới
          </button>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/10 text-white/40 text-xs uppercase tracking-widest">
                <th className="p-4 font-bold">Homestay</th>
                <th className="p-4 font-bold">Điểm Đến</th>
                <th className="p-4 font-bold text-center">Đánh Giá</th>
                <th className="p-4 font-bold text-right">Giá / Đêm</th>
                <th className="p-4 font-bold text-center">Trạng Thái</th>
                <th className="p-4 font-bold text-center">Thao Tác</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="text-center py-12">
                    <Loader2 className="animate-spin mx-auto text-pink" size={32} />
                  </td>
                </tr>
              ) : homestays.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-12 text-white/40">Không có homestay nào</td>
                </tr>
              ) : (
                homestays.map((h: any) => (
                  <tr key={h.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-4">
                        <div className="w-16 h-12 rounded-xl bg-white/10 overflow-hidden flex-shrink-0">
                          {h.coverImage && <img src={h.coverImage} className="w-full h-full object-cover" />}
                        </div>
                        <div>
                          <div className="font-bold text-white line-clamp-1">{h.name}</div>
                          <div className="text-xs text-white/50 truncate max-w-[200px]">{h.address}</div>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 text-white/70">
                      {h.destination?.nameVi || "Chưa chọn"}
                    </td>
                    <td className="p-4 text-center">
                      <div className="flex items-center justify-center gap-1 font-bold text-amber">
                        <Star size={14} className="fill-amber" />
                        {h.rating} <span className="text-[10px] text-white/30">({h.reviewsCount})</span>
                      </div>
                    </td>
                    <td className="p-4 text-right font-bold text-white">
                      {Number(h.pricePerNight).toLocaleString("vi-VN")}₫
                    </td>
                    <td className="p-4 text-center">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${h.active ? "bg-green-500/20 text-green-400" : "bg-white/10 text-white/50"}`}>
                        {h.active ? "Hoạt động" : "Đã ẩn"}
                      </span>
                    </td>
                    <td className="p-4 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <button 
                          onClick={() => handleEdit(h)}
                          className="p-2 rounded-xl bg-white/5 hover:bg-amber/20 hover:text-amber text-white/50 transition-colors"
                        >
                          <Edit size={16} />
                        </button>
                        <button 
                          onClick={() => {
                            if(confirm("Bạn có chắc muốn xóa homestay này?")) deleteMutation.mutate(h.id);
                          }}
                          disabled={deleteMutation.isPending}
                          className="p-2 rounded-xl bg-white/5 hover:bg-pink/20 hover:text-pink text-white/50 transition-colors disabled:opacity-50"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
      <HomestayModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSave}
        isLoading={createMutation.isPending || updateMutation.isPending}
        initialData={editingHs}
      />
    </AdminLayout>
  );
}
