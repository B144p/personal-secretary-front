import { Badge } from "@/components/ui/badge";
import type { PlanStatus, TaskStatus } from "@/lib/schemas";

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
  };
  return <Badge variant={variantMap[status]}>{taskLabels[status]}</Badge>;
}
