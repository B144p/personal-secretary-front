"use client";

import Link from "next/link";
import { usePlans } from "@/hooks/use-plans";
import { useSettings } from "@/hooks/use-settings";
import { PlanStatusBadge } from "@/components/plan/status-badge";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatInTz } from "@/lib/time";
import type { Task } from "@/lib/schemas";
import { PlusIcon } from "lucide-react";

function countTasks(tasks: Task[]): number {
  return tasks.reduce(
    (sum, t) => sum + 1 + countTasks(t.children),
    0
  );
}

function countHeldLeaves(tasks: Task[]): number {
  return tasks.reduce((sum, t) => {
    if (t.children.length === 0) {
      return sum + (t.status === "HOLD" ? 1 : 0);
    }
    return sum + countHeldLeaves(t.children);
  }, 0);
}

export default function PlansPage() {
  const { data: plans, isLoading, error } = usePlans();
  const { data: settings } = useSettings();
  const tz = settings?.time_zone ?? "UTC";

  if (isLoading) {
    return <p className="text-muted-foreground">Loading plans…</p>;
  }

  if (error) {
    return (
      <p className="text-destructive">Failed to load plans. Please refresh.</p>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Plans</h1>
        <Button asChild size="sm">
          <Link href="/plans/new">
            <PlusIcon className="size-4" />
            New Plan
          </Link>
        </Button>
      </div>

      {!plans?.length ? (
        <div className="flex flex-col items-center gap-4 rounded-lg border border-dashed py-16 text-center">
          <p className="text-muted-foreground">No plans yet.</p>
          <Button asChild size="sm">
            <Link href="/plans/new">Create your first plan</Link>
          </Button>
        </div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Goal</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Tasks</TableHead>
              <TableHead>Created</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {plans.map((plan) => {
              const heldCount = countHeldLeaves(plan.tasks);
              return (
                <TableRow key={plan.id}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Link
                        href={`/plans/${plan.id}`}
                        className="font-medium hover:underline"
                      >
                        {plan.title}
                      </Link>
                      {plan.is_paused && (
                        <Badge variant="outline">Paused</Badge>
                      )}
                      {heldCount > 0 && (
                        <Badge variant="outline">{heldCount} on hold</Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <PlanStatusBadge status={plan.status} />
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {countTasks(plan.tasks)}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {formatInTz(plan.created_at, tz, "MMM d, yyyy")}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      )}
    </div>
  );
}
