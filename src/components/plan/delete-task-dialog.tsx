"use client";

import { useState } from "react";
import { Loader2Icon } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import type { Task } from "@/lib/schemas";
import { useDeleteTask } from "@/hooks/use-plan-mutations";

interface Props {
  planId: string;
  task?: Task;
  open: boolean;
  onClose: () => void;
}

function countDescendants(task: Task): number {
  return task.children.reduce(
    (sum, child) => sum + 1 + countDescendants(child),
    0
  );
}

export function DeleteTaskDialog({ planId, task, open, onClose }: Props) {
  const { mutate: deleteTask, isPending } = useDeleteTask(planId);
  const descendantCount = task ? countDescendants(task) : 0;

  function onConfirm() {
    if (!task) return;
    deleteTask(task.id, { onSuccess: onClose });
  }

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete step</DialogTitle>
          <DialogDescription>
            {task && descendantCount > 0
              ? `Deleting "${task.title}" will also permanently delete its ${descendantCount} sub-step${descendantCount === 1 ? "" : "s"}. This cannot be undone.`
              : `Permanently delete "${task?.title}"? This cannot be undone.`}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button type="button" variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button
            type="button"
            variant="destructive"
            onClick={onConfirm}
            disabled={isPending}
          >
            {isPending && <Loader2Icon className="mr-2 size-4 animate-spin" />}
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export function useDeleteTaskDialog() {
  const [state, setState] = useState<{ open: boolean; task?: Task }>({
    open: false,
  });

  return {
    open: state.open,
    task: state.task,
    trigger: (task: Task) => setState({ open: true, task }),
    close: () => setState({ open: false }),
  };
}
