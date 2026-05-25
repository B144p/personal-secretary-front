"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2Icon } from "lucide-react";
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
import { useGeneratePlan } from "@/hooks/use-plan-mutations";

const schema = z.object({
  goal: z.string().min(5, "Goal must be at least 5 characters."),
});

type FormValues = z.infer<typeof schema>;

export default function NewPlanPage() {
  const { mutate: generate, isPending } = useGeneratePlan();

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { goal: "" },
  });

  function onSubmit({ goal }: FormValues) {
    generate(goal);
  }

  return (
    <div className="mx-auto max-w-xl space-y-6">
      <h1 className="text-xl font-semibold">New Plan</h1>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="goal"
            render={({ field }) => (
              <FormItem>
                <FormLabel>What do you want to accomplish?</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Ship a Postgres-backed URL shortener in 3 weeks…"
                    rows={4}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" disabled={isPending}>
            {isPending && <Loader2Icon className="mr-2 size-4 animate-spin" />}
            {isPending ? "Generating plan…" : "Generate Plan"}
          </Button>
          {isPending && (
            <p className="text-xs text-muted-foreground">
              This can take up to 30 seconds.
            </p>
          )}
        </form>
      </Form>
    </div>
  );
}
