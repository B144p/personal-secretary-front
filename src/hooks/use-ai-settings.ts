import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiFetch, toastApiError } from "@/lib/api";
import {
  AiSettingsSchema,
  type AiSettings,
  type UpdateAiModels,
} from "@/lib/schemas";
import { toast } from "sonner";

export function useAiSettings() {
  return useQuery<AiSettings>({
    queryKey: ["ai-settings"],
    queryFn: async () => {
      const data = await apiFetch<unknown>("/me/ai-settings");
      return AiSettingsSchema.parse(data);
    },
    staleTime: 5 * 60 * 1000,
  });
}

export function useUpdateAiModels() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: UpdateAiModels) =>
      apiFetch<AiSettings>("/me/ai-settings/models", {
        method: "PUT",
        body: JSON.stringify(body),
      }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["ai-settings"] });
      toast.success("AI model settings saved.");
    },
    onError: toastApiError,
  });
}
