"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2Icon } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { TaskCreateSchema, type TaskCreate } from "@/lib/schemas";
import { useCreateTask } from "@/hooks/use-plan-mutations";

interface Props {
  planId: string;
  parentTaskId?: string;
  open: boolean;
  onClose: () => void;
}

export function AddTaskDialog({ planId, parentTaskId, open, onClose }: Props) {
  const { mutate: createTask, isPending } = useCreateTask(planId);

  const form = useForm<TaskCreate>({
    resolver: zodResolver(TaskCreateSchema),
    defaultValues: {
      title: "",
      description: "",
      estimated_minutes: undefined,
      parent_task_id: parentTaskId,
    },
  });

  function onSubmit(values: TaskCreate) {
    createTask(
      { ...values, parent_task_id: parentTaskId },
      {
        onSuccess: () => {
          form.reset();
          onClose();
        },
      }
    );
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(o) => {
        if (!o) {
          form.reset();
          onClose();
        }
      }}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{parentTaskId ? "Add sub-step" : "Add step"}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input placeholder="What needs to be done?" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea rows={2} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="estimated_minutes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Estimated minutes</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min={15}
                      max={240}
                      {...field}
                      onChange={(e) =>
                        field.onChange(
                          e.target.value === "" ? undefined : Number(e.target.value)
                        )
                      }
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button
                type="button"
                variant="ghost"
                onClick={() => {
                  form.reset();
                  onClose();
                }}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isPending}>
                {isPending && <Loader2Icon className="mr-2 size-4 animate-spin" />}
                Add
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

export function useAddTaskDialog() {
  const [state, setState] = useState<{
    open: boolean;
    parentTaskId?: string;
  }>({ open: false });

  return {
    open: state.open,
    parentTaskId: state.parentTaskId,
    trigger: (parentTaskId?: string) => setState({ open: true, parentTaskId }),
    close: () => setState({ open: false }),
  };
}
