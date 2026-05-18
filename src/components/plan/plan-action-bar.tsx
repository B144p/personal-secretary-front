"use client";

import { Loader2Icon, Trash2Icon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  useMarkReady,
  useTransitionPlan,
  useSchedulePlan,
  usePausePlan,
  useResumePlan,
  useDeletePlan,
} from "@/hooks/use-plan-mutations";
import type { PlanStatus } from "@/lib/schemas";

interface Props {
  planId: string;
  status: PlanStatus;
  isPaused: boolean;
  onRegenerate: () => void;
}

export function PlanActionBar({ planId, status, isPaused, onRegenerate }: Props) {
  const markReady = useMarkReady(planId);
  const transition = useTransitionPlan(planId);
  const schedule = useSchedulePlan(planId);
  const pause = usePausePlan(planId);
  const resume = useResumePlan(planId);
  const deletePlan = useDeletePlan(planId);

  const isAnyPending =
    markReady.isPending ||
    transition.isPending ||
    schedule.isPending ||
    pause.isPending ||
    resume.isPending ||
    deletePlan.isPending;

  return (
    <div className="flex flex-wrap items-center gap-2">
      {status === "DRAFT" && (
        <>
          <Button
            size="sm"
            onClick={() => markReady.mutate()}
            disabled={isAnyPending}
          >
            {markReady.isPending && <Loader2Icon className="mr-2 size-4 animate-spin" />}
            Mark Ready
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => schedule.mutate()}
            disabled={isAnyPending}
          >
            {schedule.isPending && <Loader2Icon className="mr-2 size-4 animate-spin" />}
            Schedule
          </Button>
          <Button size="sm" variant="outline" onClick={onRegenerate} disabled={isAnyPending}>
            Regenerate
          </Button>
        </>
      )}

      {status === "READY" && (
        <>
          <Button
            size="sm"
            variant="outline"
            onClick={() => transition.mutate("DRAFT")}
            disabled={isAnyPending}
          >
            Back to Draft
          </Button>
          <Button
            size="sm"
            onClick={() => schedule.mutate()}
            disabled={isAnyPending}
          >
            {schedule.isPending && <Loader2Icon className="mr-2 size-4 animate-spin" />}
            Schedule
          </Button>
          <Button size="sm" variant="outline" onClick={onRegenerate} disabled={isAnyPending}>
            Regenerate
          </Button>
        </>
      )}

      {status === "SCHEDULED" && !isPaused && (
        <>
          <Button size="sm" variant="outline" onClick={onRegenerate} disabled={isAnyPending}>
            Regenerate
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => pause.mutate()}
            disabled={isAnyPending}
          >
            {pause.isPending && <Loader2Icon className="mr-2 size-4 animate-spin" />}
            Pause
          </Button>
        </>
      )}

      {status === "SCHEDULED" && isPaused && (
        <Button
          size="sm"
          onClick={() => resume.mutate()}
          disabled={isAnyPending}
        >
          {resume.isPending && <Loader2Icon className="mr-2 size-4 animate-spin" />}
          Resume
        </Button>
      )}

      {status !== "DONE" && (
        <Button
          size="sm"
          variant="destructive"
          onClick={() => {
            if (confirm("Delete this plan? This cannot be undone.")) {
              deletePlan.mutate();
            }
          }}
          disabled={isAnyPending}
        >
          {deletePlan.isPending ? (
            <Loader2Icon className="mr-2 size-4 animate-spin" />
          ) : (
            <Trash2Icon className="mr-2 size-4" />
          )}
          Delete
        </Button>
      )}

      {status === "DONE" && (
        <Button
          size="sm"
          variant="destructive"
          onClick={() => {
            if (confirm("Delete this plan?")) deletePlan.mutate();
          }}
          disabled={deletePlan.isPending}
        >
          <Trash2Icon className="mr-2 size-4" />
          Delete
        </Button>
      )}
    </div>
  );
}
