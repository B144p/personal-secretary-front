"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2Icon } from "lucide-react";
import {
  useAiSettings,
  useUpdateAiModels,
  useUpdateApiKey,
} from "@/hooks/use-ai-settings";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  UpdateAiModelsSchema,
  UpdateApiKeySchema,
  type AiSettings,
  type UpdateAiModels,
  type UpdateApiKey,
} from "@/lib/schemas";

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

function ApiKeySection() {
  const { data: aiSettings, isLoading } = useAiSettings();
  const { mutate: save, isPending } = useUpdateApiKey();

  const form = useForm<UpdateApiKey>({
    resolver: zodResolver(UpdateApiKeySchema),
    defaultValues: { api_key: "" },
  });

  if (isLoading) return <p className="text-muted-foreground">Loading…</p>;

  const status = aiSettings?.api_key;

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit((v) => {
          save(v, { onSuccess: () => form.reset({ api_key: "" }) });
        })}
        className="space-y-4"
      >
        <div>
          <h2 className="text-sm font-medium">OpenAI API key</h2>
          <p className="text-sm text-muted-foreground">
            {status?.configured
              ? `Configured · sk-••••${status.last4}`
              : "Not configured. AI features are disabled until you add a key."}
          </p>
        </div>
        <FormField
          control={form.control}
          name="api_key"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                {status?.configured ? "Replace API key" : "API key"}
              </FormLabel>
              <FormControl>
                <Input type="password" placeholder="sk-..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={isPending}>
          {isPending && <Loader2Icon className="mr-2 size-4 animate-spin" />}
          Save API Key
        </Button>
      </form>
    </Form>
  );
}

function ModelSettingsForm() {
  const { data: aiSettings, isLoading } = useAiSettings();

  if (isLoading || !aiSettings) {
    return <p className="text-muted-foreground">Loading…</p>;
  }

  return <ModelSettingsFormInner aiSettings={aiSettings} />;
}

function ModelSettingsFormInner({ aiSettings }: { aiSettings: AiSettings }) {
  const { mutate: save, isPending } = useUpdateAiModels();

  const form = useForm<UpdateAiModels>({
    resolver: zodResolver(UpdateAiModelsSchema),
    defaultValues: {
      model_plan_generation: aiSettings.model_plan_generation,
      model_regeneration: aiSettings.model_regeneration,
      model_scheduling: aiSettings.model_scheduling,
    },
  });

  const availableModels = aiSettings.available_models;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit((v) => save(v))} className="space-y-6">
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

export function AiProviderTab() {
  return (
    <div className="space-y-6">
      <ApiKeySection />
      <Separator />
      <ModelSettingsForm />
    </div>
  );
}
