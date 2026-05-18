import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { apiFetch, toastApiError, ApiError } from "@/lib/api";
import {
  PlanSchema,
  ScheduleResponseSchema,
  type Plan,
  type TaskPatch,
} from "@/lib/schemas";

export function useGeneratePlan() {
  const qc = useQueryClient();
  const router = useRouter();
  return useMutation({
    mutationFn: async (goal: string) => {
      const data = await apiFetch<unknown>("/plan/generate", {
        method: "POST",
        body: JSON.stringify({ goal }),
      });
      return PlanSchema.parse(data);
    },
    onSuccess: (plan) => {
      qc.invalidateQueries({ queryKey: ["plans"] });
      router.push(`/plans/${plan.id}`);
    },
    onError: toastApiError,
  });
}

export function usePatchTask(planId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ taskId, patch }: { taskId: string; patch: TaskPatch }) =>
      apiFetch(`/plan/${planId}/tasks/${taskId}`, {
        method: "PATCH",
        body: JSON.stringify(patch),
      }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["plan", planId] });
    },
    onError: toastApiError,
  });
}

export function useRegenerate(planId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      taskId,
      reason,
    }: {
      taskId?: string;
      reason: string;
    }) =>
      apiFetch<Plan>(`/plan/${planId}/re_generate`, {
        method: "POST",
        body: JSON.stringify({ taskId, reason }),
      }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["plan", planId] });
    },
    onError: toastApiError,
  });
}

export function useSchedulePlan(planId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: () =>
      apiFetch(`/plan/${planId}/schedule`, { method: "PATCH" }),
    onSuccess: (data) => {
      const parsed = ScheduleResponseSchema.safeParse(data);
      if (parsed.success && parsed.data.unscheduledTaskIds.length > 0) {
        toast.warning(
          `${parsed.data.unscheduledTaskIds.length} task(s) didn't fit in the 30-day window.`
        );
      } else {
        toast.success("Plan scheduled.");
      }
      qc.invalidateQueries({ queryKey: ["plan", planId] });
      qc.invalidateQueries({ queryKey: ["plans"] });
    },
    onError: (err) => {
      if (err instanceof ApiError && err.code === "ANOTHER_PLAN_SCHEDULED") {
        // Find the currently scheduled plan from the cache to offer a direct link
        const plans = qc.getQueryData<import("@/lib/schemas").Plan[]>(["plans"]);
        const scheduled = plans?.find((p) => p.status === "SCHEDULED" && !p.is_paused);
        toast.error("You already have an active scheduled plan.", {
          action: scheduled
            ? {
                label: "View it",
                onClick: () => {
                  window.location.href = `/plans/${scheduled.id}`;
                },
              }
            : undefined,
        });
        return;
      }
      toastApiError(err);
    },
  });
}

export function useMarkReady(planId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: () =>
      apiFetch(`/plan/${planId}/approve`, { method: "PATCH" }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["plan", planId] });
      qc.invalidateQueries({ queryKey: ["plans"] });
    },
    onError: toastApiError,
  });
}

export function useTransitionPlan(planId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (to: "DRAFT" | "READY") =>
      apiFetch(`/plan/${planId}/transition`, {
        method: "PATCH",
        body: JSON.stringify({ to }),
      }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["plan", planId] });
      qc.invalidateQueries({ queryKey: ["plans"] });
    },
    onError: toastApiError,
  });
}

export function usePausePlan(planId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: () =>
      apiFetch(`/plan/${planId}/pause`, { method: "PATCH" }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["plan", planId] });
      qc.invalidateQueries({ queryKey: ["plans"] });
    },
    onError: toastApiError,
  });
}

export function useResumePlan(planId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: () =>
      apiFetch(`/plan/${planId}/resume`, { method: "PATCH" }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["plan", planId] });
      qc.invalidateQueries({ queryKey: ["plans"] });
    },
    onError: toastApiError,
  });
}

export function useDeletePlan(planId: string) {
  const qc = useQueryClient();
  const router = useRouter();
  return useMutation({
    mutationFn: () =>
      apiFetch(`/plan/${planId}`, { method: "DELETE" }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["plans"] });
      router.push("/plans");
    },
    onError: toastApiError,
  });
}
