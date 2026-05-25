"use client";

import { useState } from "react";
import { ChevronDownIcon, ChevronRightIcon, RefreshCwIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { TaskStatusBadge } from "@/components/plan/status-badge";
import { TaskEditPopover } from "@/components/plan/task-edit-popover";
import { Button } from "@/components/ui/button";
import type { PlanStatus, Task } from "@/lib/schemas";
import { formatInTz } from "@/lib/time";

interface Props {
  task: Task;
  planId: string;
  planStatus: PlanStatus;
  isPaused: boolean;
  tz: string;
  onRegenerate: (taskId: string) => void;
}

export function TaskNode({
  task,
  planId,
  planStatus,
  isPaused,
  tz,
  onRegenerate,
}: Props) {
  const [expanded, setExpanded] = useState(true);
  const isLeaf = task.children.length === 0;
  const activeEvent = task.events.find((e) => e.is_active);
  const isDraft = planStatus === "DRAFT";

  return (
    <div className="group">
      <div
        className={cn(
          "flex items-start gap-2 rounded-md px-2 py-1.5 hover:bg-muted/50",
          "transition-colors"
        )}
        style={{ paddingLeft: `${task.depth * 20 + 8}px` }}
      >
        {/* Expand/collapse toggle */}
        {!isLeaf ? (
          <button
            onClick={() => setExpanded((v) => !v)}
            className="mt-0.5 shrink-0 text-muted-foreground"
          >
            {expanded ? (
              <ChevronDownIcon className="size-4" />
            ) : (
              <ChevronRightIcon className="size-4" />
            )}
          </button>
        ) : (
          <span className="mt-0.5 size-4 shrink-0" />
        )}

        {/* Content */}
        <div className="flex flex-1 flex-wrap items-center gap-x-3 gap-y-1 min-w-0">
          <span className="font-medium text-sm truncate">{task.title}</span>
          <TaskStatusBadge status={task.status} />
          {activeEvent && (
            <span className="text-xs text-muted-foreground">
              {formatInTz(activeEvent.start, tz)} –{" "}
              {formatInTz(activeEvent.end, tz, "h:mm a")}
            </span>
          )}
          {task.estimated_minutes && !activeEvent && (
            <span className="text-xs text-muted-foreground">
              ~{task.estimated_minutes}m
            </span>
          )}
        </div>

        {/* Actions */}
        <div className="ml-auto flex shrink-0 items-center gap-1">
          {isDraft && !isPaused && (
            <TaskEditPopover planId={planId} task={task} />
          )}
          {planStatus !== "DONE" && !isPaused && (
            <Button
              variant="ghost"
              size="icon"
              className="size-6 opacity-0 group-hover:opacity-100"
              onClick={() => onRegenerate(task.id)}
              title="Regenerate this subtask"
            >
              <RefreshCwIcon className="size-3" />
            </Button>
          )}
        </div>
      </div>

      {/* Children */}
      {!isLeaf && expanded && (
        <div>
          {task.children.map((child) => (
            <TaskNode
              key={child.id}
              task={child}
              planId={planId}
              planStatus={planStatus}
              isPaused={isPaused}
              tz={tz}
              onRegenerate={onRegenerate}
            />
          ))}
        </div>
      )}
    </div>
  );
}
