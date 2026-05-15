"use client";
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { toursApi } from "@/lib/api";
import { toast } from "sonner";
import { Loader2, Trash2, Edit, Plus } from "lucide-react";
import Link from "next/link";

export default function AdminToursPage() {
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ["admin-tours"],
    queryFn: () => toursApi.getAll().then(r => r.data),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => toursApi.delete(id),
    onSuccess: () => {
      toast.success("Đã xóa tour thành công");
      queryClient.invalidateQueries({ queryKey: ["admin-tours"] });
    },
    onError: () => {
      toast.error("Không thể xóa tour (có thể do đã có đơn đặt chỗ)");
    }
  });

  const tours = data?.data || [];

  return (
    <AdminLayout title="Quản lý Tours" subtitle="Danh sách tất cả các chuyến đi trên nền tảng">
      <div className="glass rounded-[32px] p-8">
        
        {/* Header Actions */}
        <div className="flex justify-end mb-8">
          <button className="btn-primary flex items-center gap-2 text-sm px-6 py-3" onClick={() => toast.info("Tính năng thêm mới sẽ được phát triển trong bản cập nhật sau")}>
            <Plus size={16} /> Thêm Tour Mới
          </button>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/10 text-white/40 text-xs uppercase tracking-widest">
                <th className="p-4 font-bold">Tour</th>
                <th className="p-4 font-bold">Điểm Đến</th>
                <th className="p-4 font-bold text-center">Thời Gian</th>
                <th className="p-4 font-bold text-right">Giá / Người</th>
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
              ) : tours.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-12 text-white/40">Không có tour nào</td>
                </tr>
              ) : (
                tours.map((t: any) => (
                  <tr key={t.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-4">
                        <div className="w-16 h-12 rounded-xl bg-white/10 overflow-hidden flex-shrink-0">
                          {t.coverImage && <img src={t.coverImage} className="w-full h-full object-cover" />}
                        </div>
                        <div>
                          <div className="font-bold text-white line-clamp-1">{t.title}</div>
                          <div className="text-xs text-white/50">{t.slug}</div>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 text-white/70">
                      {t.destination?.nameVi || "Chưa chọn"}
                    </td>
                    <td className="p-4 text-center font-bold text-amber">
                      {t.durationDays} ngày
                    </td>
                    <td className="p-4 text-right font-bold text-white">
                      {Number(t.pricePerPerson).toLocaleString("vi-VN")}₫
                    </td>
                    <td className="p-4 text-center">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${t.active ? "bg-green-500/20 text-green-400" : "bg-white/10 text-white/50"}`}>
                        {t.active ? "Hoạt động" : "Đã ẩn"}
                      </span>
                    </td>
                    <td className="p-4 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <Link href={`/tours/${t.id}`} target="_blank" className="p-2 rounded-xl bg-white/5 hover:bg-amber/20 hover:text-amber text-white/50 transition-colors">
                          <Edit size={16} />
                        </Link>
                        <button 
                          onClick={() => {
                            if(confirm("Bạn có chắc muốn xóa tour này?")) deleteMutation.mutate(t.id);
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
    </AdminLayout>
  );
}
