import { Badge } from "@/components/ui/badge";
import type { PlanSource, PlanStatus, TaskStatus } from "@/lib/schemas";

const planColors: Record<PlanStatus, string> = {
  DRAFT: "border-transparent bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300",
  READY: "border-transparent bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300",
  SCHEDULED: "border-transparent bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300",
  HOLD: "border-transparent bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300",
  DONE: "border-transparent bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300",
};

const planLabels: Record<PlanStatus, string> = {
  DRAFT: "Draft",
  READY: "Ready",
  SCHEDULED: "Scheduled",
  HOLD: "Hold",
  DONE: "Done",
};

const taskLabels: Record<TaskStatus, string> = {
  PENDING: "Pending",
  IN_PROGRESS: "In Progress",
  DONE: "Done",
  HOLD: "Hold",
  CANCELLED: "Cancelled",
};

export function PlanStatusBadge({ status }: { status: PlanStatus }) {
  return (
    <Badge variant="outline" className={planColors[status]}>
      {planLabels[status]}
    </Badge>
  );
}

export function TaskStatusBadge({ status }: { status: TaskStatus }) {
  const variantMap: Record<TaskStatus, "default" | "secondary" | "outline" | "destructive"> = {
    PENDING: "outline",
    IN_PROGRESS: "default",
    DONE: "secondary",
    HOLD: "secondary",
    CANCELLED: "destructive",
  };
  return <Badge variant={variantMap[status]}>{taskLabels[status]}</Badge>;
}

// Where a plan came from. Hues stay clear of the status colors above.
const sourceColors: Record<PlanSource, string> = {
  GENERATE: "border-transparent bg-violet-100 text-violet-700 dark:bg-violet-900/40 dark:text-violet-300",
  CLAUDE_CODE: "border-transparent bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300",
  AGENT: "border-transparent bg-teal-100 text-teal-700 dark:bg-teal-900/40 dark:text-teal-300",
  CALENDAR: "border-transparent bg-sky-100 text-sky-700 dark:bg-sky-900/40 dark:text-sky-300",
};

export const sourceLabels: Record<PlanSource, string> = {
  GENERATE: "Generated",
  CLAUDE_CODE: "Claude Code",
  AGENT: "Agent",
  CALENDAR: "Calendar",
};

export function PlanSourceBadge({ source }: { source: PlanSource }) {
  return (
    <Badge variant="outline" className={sourceColors[source]}>
      {sourceLabels[source]}
    </Badge>
  );
}

