"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
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
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useRegenerate } from "@/hooks/use-plan-mutations";

const schema = z.object({
  reason: z.string().min(10, "Reason must be at least 10 characters."),
});

type FormValues = z.infer<typeof schema>;

interface Props {
  planId: string;
  taskId?: string;
  open: boolean;
  onClose: () => void;
}

export function RegenerateDialog({ planId, taskId, open, onClose }: Props) {
  const { mutate: regenerate, isPending } = useRegenerate(planId);

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { reason: "" },
  });

  function onSubmit({ reason }: FormValues) {
    regenerate(
      { taskId, reason },
      {
        onSuccess: () => {
          form.reset();
          onClose();
        },
      }
    );
  }

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {taskId ? "Regenerate subtask" : "Regenerate entire plan"}
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="reason"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Why do you want to regenerate?</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="The scope has changed because…"
                      rows={3}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="button" variant="ghost" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit" disabled={isPending}>
                {isPending && (
                  <Loader2Icon className="mr-2 size-4 animate-spin" />
                )}
                Regenerate
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

export function useRegenerateDialog() {
  const [state, setState] = useState<{
    open: boolean;
    taskId?: string;
  }>({ open: false });

  return {
    open: state.open,
    taskId: state.taskId,
    trigger: (taskId?: string) => setState({ open: true, taskId }),
    close: () => setState({ open: false }),
  };
}
