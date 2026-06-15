import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { apiFetch, toastApiError } from "@/lib/api";
import { AdminUserSchema, type AdminUser } from "@/lib/schemas";
import { z } from "zod";

export function useAdminUsers() {
  return useQuery<AdminUser[]>({
    queryKey: ["admin", "users"],
    queryFn: async () => {
      const data = await apiFetch<unknown[]>("/admin/users");
      return z.array(AdminUserSchema).parse(data);
    },
  });
}

export function useApproveUser() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) =>
      apiFetch(`/admin/users/${id}/approve`, { method: "PATCH" }),
    onSuccess: () => {
      toast.success("User approved.");
      qc.invalidateQueries({ queryKey: ["admin", "users"] });
    },
    onError: toastApiError,
  });
}

export function useRejectUser() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) =>
      apiFetch(`/admin/users/${id}/reject`, { method: "PATCH" }),
    onSuccess: () => {
      toast.success("User rejected.");
      qc.invalidateQueries({ queryKey: ["admin", "users"] });
    },
    onError: toastApiError,
  });
}
