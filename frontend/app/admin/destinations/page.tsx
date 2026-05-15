"use client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { destinationsApi } from "@/lib/api";
import { toast } from "sonner";
import { Loader2, Trash2, Edit, Plus, Image as ImageIcon } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { DestinationModal } from "@/components/admin/DestinationModal";

export default function AdminDestinationsPage() {
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ["admin-destinations"],
    queryFn: () => destinationsApi.getAll().then(r => r.data),
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingDest, setEditingDest] = useState<any>(null);

  const createMutation = useMutation({
    mutationFn: (data: any) => destinationsApi.create(data),
    onSuccess: () => {
      toast.success("Đã tạo điểm đến mới");
      queryClient.invalidateQueries({ queryKey: ["admin-destinations"] });
      setIsModalOpen(false);
    }
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: any }) => destinationsApi.update(id, data),
    onSuccess: () => {
      toast.success("Đã cập nhật thông tin");
      queryClient.invalidateQueries({ queryKey: ["admin-destinations"] });
      setIsModalOpen(false);
    }
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => destinationsApi.delete(id),
    onSuccess: () => {
      toast.success("Đã xóa điểm đến thành công");
      queryClient.invalidateQueries({ queryKey: ["admin-destinations"] });
    },
    onError: () => {
      toast.error("Không thể xóa (có thể do đang có Tour/Homestay liên kết)");
    }
  });

  const handleSave = (formData: any) => {
    if (editingDest) {
      updateMutation.mutate({ id: editingDest.id, data: formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  const handleEdit = (dest: any) => {
    setEditingDest(dest);
    setIsModalOpen(true);
  };

  const handleAdd = () => {
    setEditingDest(null);
    setIsModalOpen(true);
  };

  const destinations = data?.data || [];

  return (
    <AdminLayout title="Quản lý Điểm Đến" subtitle="Các khu vực, tỉnh thành có hỗ trợ trên nền tảng">
      <div className="glass rounded-[32px] p-8">
        
        {/* Header Actions */}
        <div className="flex justify-end mb-8">
          <button className="btn-primary flex items-center gap-2 text-sm px-6 py-3" onClick={handleAdd}>
            <Plus size={16} /> Thêm Điểm Đến Mới
          </button>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/10 text-white/40 text-xs uppercase tracking-widest">
                <th className="p-4 font-bold">Điểm Đến</th>
                <th className="p-4 font-bold">Tỉnh / Vùng</th>
                <th className="p-4 font-bold text-center">Thư Viện Ảnh</th>
                <th className="p-4 font-bold text-center">Trạng Thái</th>
                <th className="p-4 font-bold text-center">Thao Tác</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={5} className="text-center py-12">
                    <Loader2 className="animate-spin mx-auto text-pink" size={32} />
                  </td>
                </tr>
              ) : destinations.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-12 text-white/40">Không có điểm đến nào</td>
                </tr>
              ) : (
                destinations.map((d: any) => (
                  <tr key={d.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-4">
                        <div className="w-16 h-12 rounded-xl bg-white/10 overflow-hidden flex-shrink-0">
                          {d.coverImage && <img src={d.coverImage} className="w-full h-full object-cover" />}
                        </div>
                        <div>
                          <div className="font-bold text-white">{d.nameVi}</div>
                          <div className="text-xs text-white/50">{d.nameEn || d.slug}</div>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 text-white/70">
                      {d.province}
                    </td>
                    <td className="p-4 text-center">
                      <div className="flex items-center justify-center gap-2 text-white/50 text-sm">
                        <ImageIcon size={16} /> {Array.isArray(d.images) ? d.images.length : 0} ảnh
                      </div>
                    </td>
                    <td className="p-4 text-center">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${d.active ? "bg-green-500/20 text-green-400" : "bg-white/10 text-white/50"}`}>
                        {d.active ? "Hoạt động" : "Đã ẩn"}
                      </span>
                    </td>
                    <td className="p-4 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <button 
                          onClick={() => handleEdit(d)}
                          className="p-2 rounded-xl bg-white/5 hover:bg-amber/20 hover:text-amber text-white/50 transition-colors"
                        >
                          <Edit size={16} />
                        </button>
                        <button 
                          onClick={() => {
                            if(confirm("Bạn có chắc muốn xóa điểm đến này? Cảnh báo: Việc này có thể ảnh hưởng đến các Tour/Homestay trực thuộc!")) deleteMutation.mutate(d.id);
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
      <DestinationModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSave}
        isLoading={createMutation.isPending || updateMutation.isPending}
        initialData={editingDest}
      />
    </AdminLayout>
  );
}
