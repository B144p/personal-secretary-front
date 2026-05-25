import { useQuery } from "@tanstack/react-query";
import { apiFetch } from "@/lib/api";
import { PlanSchema, type Plan } from "@/lib/schemas";
import { z } from "zod";

export function usePlans() {
  return useQuery<Plan[]>({
    queryKey: ["plans"],
    queryFn: async () => {
      const data = await apiFetch<unknown[]>("/plan");
      return z.array(PlanSchema).parse(data);
    },
  });
}
