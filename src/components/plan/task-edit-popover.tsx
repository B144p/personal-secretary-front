"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2Icon, PencilIcon } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
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
import { TaskPatchSchema, type Task, type TaskPatch } from "@/lib/schemas";
import { usePatchTask } from "@/hooks/use-plan-mutations";

interface Props {
  planId: string;
  task: Task;
}

export function TaskEditPopover({ planId, task }: Props) {
  const { mutate: patch, isPending } = usePatchTask(planId);

  const form = useForm<TaskPatch>({
    resolver: zodResolver(TaskPatchSchema),
    defaultValues: {
      title: task.title,
      description: task.description,
      estimated_minutes: task.estimated_minutes ?? undefined,
      sequence_order: task.sequence_order,
    },
  });

  function onSubmit(values: TaskPatch) {
    patch({ taskId: task.id, patch: values });
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="size-6 opacity-0 group-hover:opacity-100">
          <PencilIcon className="size-3" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80" align="start">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input {...field} />
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
            {task.children.length === 0 && (
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
                            e.target.value === ""
                              ? undefined
                              : Number(e.target.value)
                          )
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
            <Button type="submit" size="sm" disabled={isPending}>
              {isPending && (
                <Loader2Icon className="mr-2 size-3 animate-spin" />
              )}
              Save
            </Button>
          </form>
        </Form>
      </PopoverContent>
    </Popover>
  );
}
