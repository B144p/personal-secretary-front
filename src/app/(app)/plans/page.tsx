"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { usePlans } from "@/hooks/use-plans";
import { useSettings } from "@/hooks/use-settings";
import {
  PlanSourceBadge,
  PlanStatusBadge,
  sourceLabels,
} from "@/components/plan/status-badge";
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
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { formatInTz } from "@/lib/time";
import {
  sortPlans,
  stepProgress,
  updatedAt,
  type SortDir,
  type SortKey,
} from "@/lib/plan-list";
import { cn } from "@/lib/utils";
import {
  ArrowDownIcon,
  ArrowUpDownIcon,
  ArrowUpIcon,
  PlusIcon,
} from "lucide-react";

// A header that sorts by its column; a second click flips the direction.
function SortHead({
  label,
  column,
  sort,
  onSort,
  className,
}: {
  label: string;
  column: SortKey;
  sort: { key: SortKey; dir: SortDir };
  onSort: (key: SortKey) => void;
  className?: string;
}) {
  const active = sort.key === column;
  const Icon = !active
    ? ArrowUpDownIcon
    : sort.dir === "asc"
      ? ArrowUpIcon
      : ArrowDownIcon;
  return (
    <TableHead
      className={className}
      aria-sort={active ? (sort.dir === "asc" ? "ascending" : "descending") : "none"}
    >
      <button
        type="button"
        onClick={() => onSort(column)}
        className={cn(
          "inline-flex items-center gap-1 rounded-sm hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
          active && "text-foreground",
        )}
      >
        {label}
        <Icon className={cn("size-3.5", !active && "opacity-40")} />
      </button>
    </TableHead>
  );
}

// Text columns start A→Z; status in lifecycle order; numbers and dates
// start with the largest / newest.
const FIRST_DIR: Record<SortKey, SortDir> = {
  title: "asc",
  source: "asc",
  status: "asc",
  tasks: "desc",
  created: "desc",
  updated: "desc",
};

export default function PlansPage() {
  const { data: plans, isLoading, error } = usePlans();
  const { data: settings } = useSettings();
  const tz = settings?.time_zone ?? "UTC";
  // Newest activity first, the same order the backend returns.
  const [sort, setSort] = useState<{ key: SortKey; dir: SortDir }>({
    key: "updated",
    dir: "desc",
  });
  const onSort = (key: SortKey) =>
    setSort((s) =>
      s.key === key
        ? { key, dir: s.dir === "asc" ? "desc" : "asc" }
        : { key, dir: FIRST_DIR[key] },
    );
  const sorted = useMemo(
    () =>
      sortPlans(plans ?? [], sort.key, sort.dir, (p) => sourceLabels[p.source_type]),
    [plans, sort],
  );

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
        <Table className="min-w-[760px] table-fixed">
          <TableHeader>
            <TableRow>
              <SortHead label="Goal" column="title" sort={sort} onSort={onSort} />
              <SortHead label="Source" column="source" sort={sort} onSort={onSort} className="w-32" />
              <SortHead label="Status" column="status" sort={sort} onSort={onSort} className="w-28" />
              <SortHead label="Tasks" column="tasks" sort={sort} onSort={onSort} className="w-24" />
              <SortHead label="Created" column="created" sort={sort} onSort={onSort} className="w-32" />
              <SortHead label="Updated" column="updated" sort={sort} onSort={onSort} className="w-32" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {sorted.map((plan) => {
              const steps = stepProgress(plan.tasks);
              const heldCount = steps.hold;
              return (
                <TableRow key={plan.id}>
                  <TableCell>
                    <div className="flex min-w-0 items-center gap-2">
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Link
                            href={`/plans/${plan.id}`}
                            className="block min-w-0 truncate font-medium hover:underline"
                          >
                            {plan.title}
                          </Link>
                        </TooltipTrigger>
                        <TooltipContent className="max-w-sm break-words">
                          {plan.title}
                        </TooltipContent>
                      </Tooltip>
                      {plan.is_paused && (
                        <Badge variant="outline">Paused</Badge>
                      )}
                      {heldCount > 0 && (
                        <Badge variant="outline">{heldCount} on hold</Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <PlanSourceBadge source={plan.source_type} />
                  </TableCell>
                  <TableCell>
                    <PlanStatusBadge status={plan.status} />
                  </TableCell>
                  <TableCell className="tabular-nums text-muted-foreground">
                    <Tooltip>
                      <TooltipTrigger className="cursor-default">
                        <span
                          className={cn(
                            steps.counted > 0 &&
                              steps.done === steps.counted &&
                              "text-green-700 dark:text-green-400",
                          )}
                        >
                          {steps.done}/{steps.counted}
                        </span>
                      </TooltipTrigger>
                      <TooltipContent>
                        {steps.done} of {steps.counted} steps done
                        {steps.hold + steps.cancelled > 0 &&
                          ` · not counted: ${[
                            steps.hold && `${steps.hold} on hold`,
                            steps.cancelled && `${steps.cancelled} cancelled`,
                          ]
                            .filter(Boolean)
                            .join(", ")}`}
                      </TooltipContent>
                    </Tooltip>
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {formatInTz(plan.created_at, tz, "MMM d, yyyy")}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {formatInTz(updatedAt(plan), tz, "MMM d, yyyy")}
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
