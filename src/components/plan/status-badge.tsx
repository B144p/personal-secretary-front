import { Badge } from "@/components/ui/badge";
import type { PlanStatus, TaskStatus } from "@/lib/schemas";

const planVariants: Record<PlanStatus, "default" | "secondary" | "outline" | "destructive"> = {
  DRAFT: "secondary",
  READY: "outline",
  SCHEDULED: "default",
  DONE: "secondary",
};

const planLabels: Record<PlanStatus, string> = {
  DRAFT: "Draft",
  READY: "Ready",
  SCHEDULED: "Scheduled",
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
    <Badge variant={planVariants[status]}>{planLabels[status]}</Badge>
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
