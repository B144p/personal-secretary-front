"use client";

import Link from "next/link";
import { useState } from "react";
import { Loader2Icon } from "lucide-react";
import { usePlanProgress, useSubmitFeedback } from "@/hooks/use-plan-progress";
import { useSettings } from "@/hooks/use-settings";
import { TaskStatusBadge } from "@/components/plan/status-badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ApiError } from "@/lib/api";
import type { Task, FeedbackStatus } from "@/lib/schemas";

function collectLeaves(tasks: Task[]): Task[] {
  return tasks.flatMap((t) =>
    t.children.length === 0 ? [t] : collectLeaves(t.children)
  );
}

const STATUS_OPTIONS: { value: FeedbackStatus; label: string }[] = [
  { value: "PENDING", label: "Pending" },
  { value: "IN_PROGRESS", label: "In Progress" },
  { value: "DONE", label: "Done" },
  { value: "HOLD", label: "Hold" },
];

export default function FeedbackPage() {
  const { data: progress, isLoading } = usePlanProgress();
  const { data: settings } = useSettings();
  const { mutate: submit, isPending, error } = useSubmitFeedback();

  const [statusMap, setStatusMap] = useState<Record<string, FeedbackStatus>>({});
  const [contextText, setContextText] = useState("");

  const plan = progress?.plan;
  const leaves = plan ? collectLeaves(plan.tasks) : [];
  const noOpError =
    error instanceof ApiError && error.code === "NO_OP_FEEDBACK";

  if (isLoading) {
    return <p className="text-muted-foreground">Loading…</p>;
  }

  if (!plan) {
    return (
      <div className="flex flex-col items-center gap-4 py-16 text-center">
        <p className="text-muted-foreground">No active scheduled plan.</p>
        <Button asChild size="sm">
          <Link href="/plans/new">Create a plan</Link>
        </Button>
      </div>
    );
  }

  function handleSubmit() {
    const statusChanges = Object.entries(statusMap)
      .filter(([taskId, newStatus]) => {
        const leaf = leaves.find((l) => l.id === taskId);
        return leaf && leaf.status !== newStatus;
      })
      .map(([taskId, newStatus]) => ({ taskId, newStatus }));

    submit({ statusChanges, contextText: contextText || undefined });
  }

  const tz = settings?.time_zone ?? "UTC";
  void tz;

  return (
    <div className="mx-auto max-w-xl space-y-6">
      <div>
        <h1 className="text-xl font-semibold">Daily Feedback</h1>
        <p className="text-sm text-muted-foreground">{plan.title}</p>
      </div>

      <div className="space-y-3">
        {leaves.map((leaf) => {
          const current = statusMap[leaf.id] ?? leaf.status;
          return (
            <div
              key={leaf.id}
              className="flex items-center justify-between gap-4 rounded-lg border px-4 py-3"
            >
              <div className="flex flex-1 flex-col gap-1 min-w-0">
                <span className="text-sm font-medium truncate">{leaf.title}</span>
                <TaskStatusBadge status={leaf.status} />
              </div>
              <Select
                value={current}
                onValueChange={(v) =>
                  setStatusMap((m) => ({ ...m, [leaf.id]: v as FeedbackStatus }))
                }
              >
                <SelectTrigger className="w-36">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {STATUS_OPTIONS.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          );
        })}
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Context (optional)</label>
        <Textarea
          rows={3}
          placeholder="Got sidetracked by a bug at work; tomorrow is lighter."
          value={contextText}
          onChange={(e) => setContextText(e.target.value)}
        />
      </div>

      {noOpError && (
        <p className="text-sm text-muted-foreground">
          No changes to submit — update at least one task status first.
        </p>
      )}

      <Button onClick={handleSubmit} disabled={isPending}>
        {isPending && <Loader2Icon className="mr-2 size-4 animate-spin" />}
        Submit Feedback
      </Button>
    </div>
  );
}
