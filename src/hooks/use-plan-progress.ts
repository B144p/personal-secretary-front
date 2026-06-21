import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { apiFetch, toastApiError, ApiError } from "@/lib/api";
import {
  PlanProgressSchema,
  FeedbackResponseSchema,
  type PlanProgress,
  type FeedbackBody,
} from "@/lib/schemas";

export function usePlanProgress() {
  return useQuery<PlanProgress>({
    queryKey: ["plan-progress"],
    queryFn: async () => {
      const data = await apiFetch<unknown>("/plan-progress");
      return PlanProgressSchema.parse(data);
    },
  });
}

export function useSubmitFeedback() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (body: FeedbackBody) => {
      const data = await apiFetch<unknown>("/plan-progress", {
        method: "PATCH",
        body: JSON.stringify(body),
      });
      return FeedbackResponseSchema.parse(data);
    },
    onSuccess: (result) => {
      if (result.rescheduleFailed) {
        toast.warning("Feedback saved, but couldn't update the calendar. Please try again shortly.");
      } else if (result.planStatus === "DONE") {
        toast.success("Plan complete! All tasks are done.");
      } else if (result.rescheduled > 0) {
        toast.success(`Feedback submitted. ${result.rescheduled} task(s) rescheduled.`);
      } else {
        toast.success("Feedback submitted.");
      }
      qc.invalidateQueries({ queryKey: ["plan-progress"] });
      qc.invalidateQueries({ queryKey: ["plans"] });
      if (result.planStatus !== "DONE") {
        qc.invalidateQueries({ queryKey: ["plan"] });
      }
    },
    onError: (err) => {
      if (err instanceof ApiError && err.code === "NO_OP_FEEDBACK") {
        // handled inline in the form
        return;
      }
      toastApiError(err);
    },
  });
}
