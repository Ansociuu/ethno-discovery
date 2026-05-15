"use client";
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { adminApi } from "@/lib/api";
import { toast } from "sonner";
import { Loader2, Search, ChevronLeft, ChevronRight } from "lucide-react";

export default function AdminBookingsPage() {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState("");

  const { data, isLoading } = useQuery({
    queryKey: ["admin-bookings", page, statusFilter],
    queryFn: () => adminApi.getBookings({ page, limit: 10, status: statusFilter || undefined }).then(r => r.data),
  });

  const updateStatusMutation = useMutation({
    mutationFn: ({ id, status }: { id: number, status: string }) => adminApi.updateBookingStatus(id, status),
    onSuccess: () => {
      toast.success("Đã cập nhật trạng thái đơn đặt chỗ");
      queryClient.invalidateQueries({ queryKey: ["admin-bookings"] });
    },
    onError: () => {
      toast.error("Cập nhật trạng thái thất bại");
    }
  });

  const bookings = data?.data || [];
  const pagination = data?.pagination || { totalPages: 1 };

  return (
    <AdminLayout title="Quản lý Đơn Đặt Chỗ" subtitle="Xem và quản lý tất cả các đơn đặt tour và homestay">
      <div className="glass rounded-[32px] p-8">
        
        {/* Filters */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-8">
          <div className="flex gap-2">
            {["", "PENDING", "CONFIRMED", "CANCELLED"].map(s => (
              <button 
                key={s} 
                onClick={() => { setStatusFilter(s); setPage(1); }}
                className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${statusFilter === s ? "bg-pink text-white" : "bg-white/5 text-white/50 hover:bg-white/10 hover:text-white"}`}
              >
                {s || "Tất cả"}
              </button>
            ))}
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/10 text-white/40 text-xs uppercase tracking-widest">
                <th className="p-4 font-bold">ID</th>
                <th className="p-4 font-bold">Khách Hàng</th>
                <th className="p-4 font-bold">Dịch Vụ</th>
                <th className="p-4 font-bold">Ngày Đặt</th>
                <th className="p-4 font-bold">Tổng Tiền</th>
                <th className="p-4 font-bold text-center">Trạng Thái</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="text-center py-12">
                    <Loader2 className="animate-spin mx-auto text-pink" size={32} />
                  </td>
                </tr>
              ) : bookings.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-12 text-white/40">Không có đơn đặt chỗ nào</td>
                </tr>
              ) : (
                bookings.map((booking: any) => (
                  <tr key={booking.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                    <td className="p-4 font-bold text-white/50">#{booking.id}</td>
                    <td className="p-4">
                      <div className="font-bold text-white">{booking.user?.name}</div>
                      <div className="text-xs text-white/50">{booking.user?.email}</div>
                    </td>
                    <td className="p-4">
                      <div className="font-bold text-white truncate max-w-[200px]">
                        {booking.tour?.title || booking.homestay?.name || "N/A"}
                      </div>
                      <div className="text-[10px] text-amber uppercase font-bold tracking-widest mt-1">
                        {booking.tour ? "TOUR" : "HOMESTAY"}
                      </div>
                    </td>
                    <td className="p-4 text-sm text-white/70">
                      {new Date(booking.createdAt).toLocaleString("vi-VN")}
                    </td>
                    <td className="p-4 font-bold text-amber">
                      {Number(booking.totalPrice).toLocaleString("vi-VN")}₫
                    </td>
                    <td className="p-4 text-center">
                      <select 
                        value={booking.status}
                        onChange={(e) => updateStatusMutation.mutate({ id: booking.id, status: e.target.value })}
                        disabled={updateStatusMutation.isPending}
                        className={`bg-white/10 border-none outline-none text-xs font-bold uppercase tracking-widest rounded-xl px-3 py-2 cursor-pointer transition-colors ${
                          booking.status === "CONFIRMED" ? "text-green-400" : booking.status === "CANCELLED" ? "text-pink" : "text-amber-400"
                        }`}
                      >
                        <option value="PENDING" className="bg-dark text-amber-400">PENDING</option>
                        <option value="CONFIRMED" className="bg-dark text-green-400">CONFIRMED</option>
                        <option value="CANCELLED" className="bg-dark text-pink">CANCELLED</option>
                      </select>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div className="flex items-center justify-between mt-8 border-t border-white/10 pt-6">
            <div className="text-sm text-white/40">
              Trang {page} / {pagination.totalPages}
            </div>
            <div className="flex gap-2">
              <button 
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-white/50 hover:bg-white/10 hover:text-white disabled:opacity-30 transition-all"
              >
                <ChevronLeft size={18} />
              </button>
              <button 
                onClick={() => setPage(p => Math.min(pagination.totalPages, p + 1))}
                disabled={page === pagination.totalPages}
                className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-white/50 hover:bg-white/10 hover:text-white disabled:opacity-30 transition-all"
              >
                <ChevronRight size={18} />
              </button>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
