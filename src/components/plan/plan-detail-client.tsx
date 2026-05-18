"use client";

import { usePlan } from "@/hooks/use-plan";
import { useSettings } from "@/hooks/use-settings";
import { PlanStatusBadge } from "@/components/plan/status-badge";
import { TaskNode } from "@/components/plan/task-node";
import { PlanActionBar } from "@/components/plan/plan-action-bar";
import {
  RegenerateDialog,
  useRegenerateDialog,
} from "@/components/plan/regenerate-dialog";
import { Badge } from "@/components/ui/badge";

export function PlanDetailClient({ planId }: { planId: string }) {
  const { data: plan, isLoading, error } = usePlan(planId);
  const { data: settings } = useSettings();
  const tz = settings?.time_zone ?? "UTC";
  const regenDialog = useRegenerateDialog();

  if (isLoading) return <p className="text-muted-foreground">Loading…</p>;
  if (error || !plan)
    return <p className="text-destructive">Failed to load plan.</p>;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <div className="flex flex-wrap items-center gap-3">
          <h1 className="text-xl font-semibold">{plan.title}</h1>
          <PlanStatusBadge status={plan.status} />
          {plan.is_paused && <Badge variant="outline">Paused</Badge>}
        </div>

        <PlanActionBar
          planId={plan.id}
          status={plan.status}
          isPaused={plan.is_paused}
          onRegenerate={() => regenDialog.trigger(undefined)}
        />
      </div>

      {/* Task tree */}
      <div className="rounded-lg border">
        {plan.tasks.length === 0 ? (
          <p className="p-4 text-sm text-muted-foreground">No tasks yet.</p>
        ) : (
          <div className="divide-y">
            {plan.tasks.map((task) => (
              <TaskNode
                key={task.id}
                task={task}
                planId={plan.id}
                planStatus={plan.status}
                isPaused={plan.is_paused}
                tz={tz}
                onRegenerate={(taskId) => regenDialog.trigger(taskId)}
              />
            ))}
          </div>
        )}
      </div>

      <RegenerateDialog
        planId={plan.id}
        taskId={regenDialog.taskId}
        open={regenDialog.open}
        onClose={regenDialog.close}
      />
    </div>
  );
}
