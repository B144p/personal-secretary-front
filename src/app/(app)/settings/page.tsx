"use client";

import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { PlusIcon, Trash2Icon, Loader2Icon } from "lucide-react";
import { useSettings, useUpdateSettings } from "@/hooks/use-settings";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SettingsSchema, type Settings } from "@/lib/schemas";
import { AiProviderTab } from "./ai-provider-tab";

const schema = SettingsSchema.refine(
  (d) => d.working_hours_end > d.working_hours_start,
  {
    message: "End time must be after start time.",
    path: ["working_hours_end"],
  }
);

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const ALL_TIMEZONES = Intl.supportedValuesOf("timeZone");

export default function SettingsPage() {
  const { data: settings, isLoading } = useSettings();

  if (isLoading || !settings) {
    return <p className="text-muted-foreground">Loading…</p>;
  }

  return <SettingsFormInner settings={settings} />;
}

function SettingsFormInner({ settings }: { settings: Settings }) {
  const { mutate: save, isPending } = useUpdateSettings();

  const form = useForm<Settings>({
    resolver: zodResolver(schema),
    defaultValues: {
      working_hours_start: settings.working_hours_start,
      working_hours_end: settings.working_hours_end,
      days_off: settings.days_off,
      time_zone: settings.time_zone,
      special_days: settings.special_days,
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "special_days",
  });

  return (
    <div className="mx-auto max-w-lg space-y-8">
      <h1 className="text-xl font-semibold">Settings</h1>

      <Tabs defaultValue="work-time">
        <TabsList>
          <TabsTrigger value="work-time">Work time</TabsTrigger>
          <TabsTrigger value="ai-provider">AI provider</TabsTrigger>
        </TabsList>

        <TabsContent value="work-time">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit((v) => save(v))}
              className="space-y-6"
            >
              {/* Working hours */}
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="working_hours_start"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Work starts</FormLabel>
                      <FormControl>
                        <Input type="time" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="working_hours_end"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Work ends</FormLabel>
                      <FormControl>
                        <Input type="time" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Days off */}
              <FormField
                control={form.control}
                name="days_off"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Days off</FormLabel>
                    <div className="flex flex-wrap gap-4">
                      {DAYS.map((day, idx) => {
                        const checked = field.value.includes(idx);
                        return (
                          <div
                            key={day}
                            className="flex items-center gap-1.5"
                          >
                            <Checkbox
                              id={`day-${idx}`}
                              checked={checked}
                              onCheckedChange={(v) => {
                                if (v) {
                                  field.onChange([...field.value, idx]);
                                } else {
                                  field.onChange(
                                    field.value.filter((d) => d !== idx)
                                  );
                                }
                              }}
                            />
                            <label
                              htmlFor={`day-${idx}`}
                              className="text-sm cursor-pointer"
                            >
                              {day}
                            </label>
                          </div>
                        );
                      })}
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Timezone */}
              <FormField
                control={form.control}
                name="time_zone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Timezone</FormLabel>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="max-h-60">
                        {ALL_TIMEZONES.map((tz) => (
                          <SelectItem key={tz} value={tz}>
                            {tz}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Special days */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Special days</span>
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    onClick={() => append({ date: "", available: true })}
                  >
                    <PlusIcon className="size-4" />
                    Add
                  </Button>
                </div>
                {fields.map((f, i) => (
                  <div key={f.id} className="flex items-center gap-2">
                    <FormField
                      control={form.control}
                      name={`special_days.${i}.date`}
                      render={({ field }) => (
                        <FormItem className="flex-1">
                          <FormControl>
                            <Input type="date" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name={`special_days.${i}.available`}
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <div className="flex items-center gap-1.5">
                              <Checkbox
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                              <span className="text-sm">Available</span>
                            </div>
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    <Button
                      type="button"
                      size="icon"
                      variant="ghost"
                      onClick={() => remove(i)}
                    >
                      <Trash2Icon className="size-4" />
                    </Button>
                  </div>
                ))}
              </div>

              <Button type="submit" disabled={isPending}>
                {isPending && (
                  <Loader2Icon className="mr-2 size-4 animate-spin" />
                )}
                Save Settings
              </Button>
            </form>
          </Form>
        </TabsContent>

        <TabsContent value="ai-provider">
          <AiProviderTab />
        </TabsContent>
      </Tabs>
    </div>
  );
}
