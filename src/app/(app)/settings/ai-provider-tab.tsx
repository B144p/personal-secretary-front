"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2Icon } from "lucide-react";
import { useAiSettings, useUpdateAiModels } from "@/hooks/use-ai-settings";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { UpdateAiModelsSchema, type UpdateAiModels } from "@/lib/schemas";

const PROCESSES: Array<{
  name: keyof UpdateAiModels;
  label: string;
  description: string;
}> = [
  {
    name: "model_plan_generation",
    label: "Generate task",
    description: "Model used to turn a goal into a task plan.",
  },
  {
    name: "model_regeneration",
    label: "Regenerate task",
    description: "Model used when a plan or subtree is regenerated.",
  },
  {
    name: "model_scheduling",
    label: "Generate schedule",
    description: "Model used to place tasks on the calendar.",
  },
];

export function AiProviderTab() {
  const { data: aiSettings, isLoading } = useAiSettings();
  const { mutate: save, isPending } = useUpdateAiModels();

  const form = useForm<UpdateAiModels>({
    resolver: zodResolver(UpdateAiModelsSchema),
    defaultValues: {
      model_plan_generation: "gpt-5",
      model_regeneration: "gpt-5",
      model_scheduling: "gpt-5-nano",
    },
  });

  useEffect(() => {
    if (aiSettings) form.reset(aiSettings);
  }, [aiSettings, form]);

  if (isLoading) return <p className="text-muted-foreground">Loading…</p>;

  const availableModels = aiSettings?.available_models ?? [];

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit((v) => save(v))}
        className="space-y-6"
      >
        {PROCESSES.map(({ name, label, description }) => (
          <FormField
            key={name}
            control={form.control}
            name={name}
            render={({ field }) => (
              <FormItem>
                <FormLabel>{label}</FormLabel>
                <p className="text-sm text-muted-foreground">
                  {description}
                </p>
                <Select value={field.value} onValueChange={field.onChange}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {availableModels.map((model) => (
                      <SelectItem key={model} value={model}>
                        {model}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        ))}

        <Button type="submit" disabled={isPending}>
          {isPending && <Loader2Icon className="mr-2 size-4 animate-spin" />}
          Save Settings
        </Button>
      </form>
    </Form>
  );
}
