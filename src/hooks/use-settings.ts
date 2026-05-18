import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiFetch, toastApiError } from "@/lib/api";
import { SettingsSchema, type Settings } from "@/lib/schemas";
import { toast } from "sonner";

export function useSettings() {
  return useQuery<Settings>({
    queryKey: ["settings"],
    queryFn: async () => {
      const data = await apiFetch<unknown>("/me/settings");
      return SettingsSchema.parse(data);
    },
  });
}

export function useUpdateSettings() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: Settings) =>
      apiFetch<Settings>("/me/settings", {
        method: "PUT",
        body: JSON.stringify(body),
      }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["settings"] });
      qc.invalidateQueries({ queryKey: ["me"] });
      toast.success("Settings saved.");
    },
    onError: toastApiError,
  });
}
