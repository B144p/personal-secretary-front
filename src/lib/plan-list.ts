import type { Plan, PlanStatus, Task } from "@/lib/schemas";

// Pure helpers for the plans list: step progress and column sorting.

export interface StepProgress {
  done: number;
  // Steps still counted as work: all steps minus held and cancelled ones
  // (same rule as the backend's percent_done).
  counted: number;
  total: number;
  hold: number;
  cancelled: number;
}

// Leaf tasks only: parents just group the steps you actually tick off.
export function stepProgress(tasks: Task[]): StepProgress {
  const p = { done: 0, counted: 0, total: 0, hold: 0, cancelled: 0 };
  const walk = (ts: Task[]) => {
    for (const t of ts) {
      if (t.children.length) {
        walk(t.children);
        continue;
      }
      p.total++;
      if (t.status === "HOLD") p.hold++;
      else if (t.status === "CANCELLED") p.cancelled++;
      else {
        p.counted++;
        if (t.status === "DONE") p.done++;
      }
    }
  };
  walk(tasks);
  return p;
}

// The later of the last plan activity (step updates, imports) and the plan
// row's own update, so every kind of plan gets a meaningful time.
export function updatedAt(plan: Plan): string {
  const a = plan.last_activity_at;
  const b = plan.updated_at;
  if (!a) return b ?? plan.created_at;
  if (!b) return a;
  return a > b ? a : b;
}

export type SortKey =
  | "title"
  | "source"
  | "status"
  | "tasks"
  | "created"
  | "updated";
export type SortDir = "asc" | "desc";

// Lifecycle order, not alphabetical.
const STATUS_ORDER: Record<PlanStatus, number> = {
  DRAFT: 0,
  READY: 1,
  SCHEDULED: 2,
  HOLD: 3,
  DONE: 4,
};

const ratio = (p: StepProgress) => (p.counted ? p.done / p.counted : 0);

export function sortPlans(
  plans: Plan[],
  key: SortKey,
  dir: SortDir,
  sourceLabel: (p: Plan) => string,
): Plan[] {
  const value = (p: Plan): string | number => {
    switch (key) {
      case "title":
        return p.title.toLowerCase();
      case "source":
        return sourceLabel(p);
      case "status":
        return STATUS_ORDER[p.status];
      case "tasks": {
        // By progress, then by size.
        const s = stepProgress(p.tasks);
        return ratio(s) * 10_000 + s.counted;
      }
      case "created":
        return p.created_at;
      case "updated":
        return updatedAt(p);
    }
  };
  const sign = dir === "asc" ? 1 : -1;
  return [...plans].sort((a, b) => {
    const va = value(a);
    const vb = value(b);
    if (va < vb) return -sign;
    if (va > vb) return sign;
    // Ties: most recently updated first, so the order is stable.
    return updatedAt(b).localeCompare(updatedAt(a));
  });
}
