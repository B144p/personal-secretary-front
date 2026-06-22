"use client";

import { ClockIcon, PlusIcon } from "lucide-react";
import { usePlan } from "@/hooks/use-plan";
import { useSettings } from "@/hooks/use-settings";
import { PlanStatusBadge } from "@/components/plan/status-badge";
import { TaskNode } from "@/components/plan/task-node";
import { PlanActionBar } from "@/components/plan/plan-action-bar";
import {
  RegenerateDialog,
  useRegenerateDialog,
} from "@/components/plan/regenerate-dialog";
import { AddTaskDialog, useAddTaskDialog } from "@/components/plan/add-task-dialog";
import {
  DeleteTaskDialog,
  useDeleteTaskDialog,
} from "@/components/plan/delete-task-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatDuration } from "@/lib/time";
import type { Task } from "@/lib/schemas";

function sumLeafMinutes(tasks: Task[]): number {
  return tasks.reduce(
    (sum, t) =>
      t.children.length === 0
        ? sum + (t.estimated_minutes ?? 0)
        : sum + sumLeafMinutes(t.children),
    0
  );
}

export function PlanDetailClient({ planId }: { planId: string }) {
  const { data: plan, isLoading, error } = usePlan(planId);
  const { data: settings } = useSettings();
  const tz = settings?.time_zone ?? "UTC";
  const regenDialog = useRegenerateDialog();
  const addDialog = useAddTaskDialog();
  const delDialog = useDeleteTaskDialog();

  if (isLoading) return <p className="text-muted-foreground">Loading…</p>;
  if (error || !plan)
    return <p className="text-destructive">Failed to load plan.</p>;

  const canEdit = plan.status === "DRAFT" && !plan.is_paused;
  const totalMinutes = sumLeafMinutes(plan.tasks);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <div className="flex flex-wrap items-center gap-3">
          <h1 className="text-xl font-semibold">{plan.title}</h1>
          <PlanStatusBadge status={plan.status} />
          {totalMinutes > 0 && (
            <Badge variant="outline" className="gap-1">
              <ClockIcon className="size-3" />
              {formatDuration(totalMinutes)}
            </Badge>
          )}
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
        <div className="flex items-center justify-between border-b px-4 py-2">
          <span className="text-sm font-medium">Steps</span>
          {canEdit && (
            <Button
              size="sm"
              variant="outline"
              onClick={() => addDialog.trigger(undefined)}
            >
              <PlusIcon className="mr-2 size-4" />
              Add step
            </Button>
          )}
        </div>
        {plan.tasks.length === 0 ? (
          <div className="p-4 text-sm text-muted-foreground">
            No tasks yet.
            {canEdit && (
              <Button
                size="sm"
                variant="link"
                className="px-1"
                onClick={() => addDialog.trigger(undefined)}
              >
                Add the first step
              </Button>
            )}
          </div>
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
                onAddSubtask={(taskId) => addDialog.trigger(taskId)}
                onDelete={(task) => delDialog.trigger(task)}
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
      <AddTaskDialog
        planId={plan.id}
        parentTaskId={addDialog.parentTaskId}
        open={addDialog.open}
        onClose={addDialog.close}
      />
      <DeleteTaskDialog
        planId={plan.id}
        task={delDialog.task}
        open={delDialog.open}
        onClose={delDialog.close}
      />
    </div>
  );
}
