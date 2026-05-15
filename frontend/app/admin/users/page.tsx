"use client";
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { adminApi } from "@/lib/api";
import { toast } from "sonner";
import { Loader2, ChevronLeft, ChevronRight, ShieldAlert, Shield, ShieldCheck } from "lucide-react";

export default function AdminUsersPage() {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);

  const { data, isLoading } = useQuery({
    queryKey: ["admin-users", page],
    queryFn: () => adminApi.getUsers({ page, limit: 10 }).then(r => r.data),
  });

  const updateRoleMutation = useMutation({
    mutationFn: ({ id, role }: { id: number, role: string }) => adminApi.updateUserRole(id, role),
    onSuccess: () => {
      toast.success("Đã cập nhật phân quyền người dùng");
      queryClient.invalidateQueries({ queryKey: ["admin-users"] });
    },
    onError: () => {
      toast.error("Cập nhật phân quyền thất bại");
    }
  });

  const users = data?.data || [];
  const pagination = data?.pagination || { totalPages: 1 };

  return (
    <AdminLayout title="Quản lý Người Dùng" subtitle="Kiểm soát tài khoản và phân quyền hệ thống">
      <div className="glass rounded-[32px] p-8">
        
        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/10 text-white/40 text-xs uppercase tracking-widest">
                <th className="p-4 font-bold">Người Dùng</th>
                <th className="p-4 font-bold">Email</th>
                <th className="p-4 font-bold text-center">Số Booking</th>
                <th className="p-4 font-bold">Ngày Đăng Ký</th>
                <th className="p-4 font-bold text-center">Quyền Hạn</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={5} className="text-center py-12">
                    <Loader2 className="animate-spin mx-auto text-pink" size={32} />
                  </td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-12 text-white/40">Không có người dùng nào</td>
                </tr>
              ) : (
                users.map((u: any) => (
                  <tr key={u.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-pink/20 to-amber/20 flex items-center justify-center font-bold text-white">
                          {u.name?.[0]?.toUpperCase()}
                        </div>
                        <div className="font-bold text-white">{u.name}</div>
                      </div>
                    </td>
                    <td className="p-4 text-white/70">{u.email}</td>
                    <td className="p-4 text-center font-bold text-amber">
                      {u._count?.bookings || 0}
                    </td>
                    <td className="p-4 text-sm text-white/50">
                      {new Date(u.createdAt).toLocaleDateString("vi-VN")}
                    </td>
                    <td className="p-4 text-center">
                      <div className="flex items-center justify-center gap-2">
                        {u.role === "ADMIN" ? <ShieldAlert size={14} className="text-pink" /> : u.role === "HOST" ? <ShieldCheck size={14} className="text-green-400" /> : <Shield size={14} className="text-white/30" />}
                        <select 
                          value={u.role}
                          onChange={(e) => updateRoleMutation.mutate({ id: u.id, role: e.target.value })}
                          disabled={updateRoleMutation.isPending}
                          className={`bg-white/10 border-none outline-none text-xs font-bold uppercase tracking-widest rounded-xl px-3 py-2 cursor-pointer transition-colors ${
                            u.role === "ADMIN" ? "text-pink" : u.role === "HOST" ? "text-green-400" : "text-white/70"
                          }`}
                        >
                          <option value="USER" className="bg-dark text-white/70">USER</option>
                          <option value="HOST" className="bg-dark text-green-400">HOST</option>
                          <option value="ADMIN" className="bg-dark text-pink">ADMIN</option>
                        </select>
                      </div>
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
