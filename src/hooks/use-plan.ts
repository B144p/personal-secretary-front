import { useQuery } from "@tanstack/react-query";
import { apiFetch } from "@/lib/api";
import { PlanSchema, type Plan } from "@/lib/schemas";

export function usePlan(id: string) {
  return useQuery<Plan>({
    queryKey: ["plan", id],
    queryFn: async () => {
      const data = await apiFetch<unknown>(`/plan/${id}`);
      return PlanSchema.parse(data);
    },
  });
}
