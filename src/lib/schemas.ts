import { z } from "zod";

// ── Error envelope (spec §5.4) ──────────────────────────────────────────────

export const ErrorCodeSchema = z.enum([
  "UNAUTHENTICATED",
  "GOOGLE_REAUTH_REQUIRED",
  "ACCOUNT_PENDING",
  "ACCOUNT_REJECTED",
  "CANNOT_REJECT_ADMIN",
  "PLAN_NOT_FOUND",
  "PLAN_NOT_EDITABLE",
  "INVALID_TRANSITION",
  "ANOTHER_PLAN_SCHEDULED",
  "SCHEDULING_IN_PROGRESS",
  "PLAN_PAUSED",
  "REASON_REQUIRED",
  "INVALID_GOAL",
  "INVALID_HOURS",
  "INVALID_TIMEZONE",
  "NO_OP_FEEDBACK",
  "AI_GENERATION_FAILED",
  "SCHEDULING_INFEASIBLE",
  "GOOGLE_CALENDAR_ERROR",
  "AI_KEY_NOT_CONFIGURED",
  "INVALID_API_KEY",
]);

export const ApiErrorSchema = z.object({
  code: ErrorCodeSchema,
  message: z.string(),
  details: z.record(z.string(), z.unknown()).optional(),
});

export type ErrorCode = z.infer<typeof ErrorCodeSchema>;
export type ApiErrorBody = z.infer<typeof ApiErrorSchema>;

// ── Enums ───────────────────────────────────────────────────────────────────

export const PlanStatusSchema = z.enum([
  "DRAFT",
  "READY",
  "SCHEDULED",
  "HOLD",
  "DONE",
]);
export const TaskStatusSchema = z.enum([
  "PENDING",
  "IN_PROGRESS",
  "DONE",
  "HOLD",
]);

export type PlanStatus = z.infer<typeof PlanStatusSchema>;
export type TaskStatus = z.infer<typeof TaskStatusSchema>;

// ── TaskEvent ────────────────────────────────────────────────────────────────

export const TaskEventSchema = z.object({
  id: z.string(),
  task_id: z.string(),
  google_event_id: z.string(),
  start: z.string().datetime({ offset: true }),
  end: z.string().datetime({ offset: true }),
  is_active: z.boolean(),
  created_at: z.string().datetime({ offset: true }),
});

export type TaskEvent = z.infer<typeof TaskEventSchema>;

// ── Task (recursive via z.lazy) ──────────────────────────────────────────────

export type Task = {
  id: string;
  plan_id: string;
  parent_task_id: string | null;
  title: string;
  description: string;
  status: TaskStatus;
  depth: number;
  estimated_minutes: number | null;
  sequence_order: number;
  events: TaskEvent[];
  children: Task[];
  created_at: string;
};

export const TaskSchema: z.ZodType<Task> = z.lazy(() =>
  z.object({
    id: z.string(),
    plan_id: z.string(),
    parent_task_id: z.string().nullable(),
    title: z.string(),
    description: z.string(),
    status: TaskStatusSchema,
    depth: z.number().int(),
    estimated_minutes: z.number().int().nullable(),
    sequence_order: z.number().int(),
    events: z.array(TaskEventSchema),
    children: z.array(TaskSchema),
    created_at: z.string().datetime({ offset: true }),
  })
);

// ── Plan ─────────────────────────────────────────────────────────────────────

export const PlanSchema = z.object({
  id: z.string(),
  user_id: z.string(),
  title: z.string(),
  status: PlanStatusSchema,
  source_type: z.enum(["GENERATE", "CALENDAR"]),
  is_paused: z.boolean(),
  paused_at: z.string().datetime({ offset: true }).nullable().optional(),
  created_at: z.string().datetime({ offset: true }),
  tasks: z.array(TaskSchema),
});

export type Plan = z.infer<typeof PlanSchema>;

// ── User ─────────────────────────────────────────────────────────────────────

export const UserStatusSchema = z.enum(["PENDING", "APPROVED", "REJECTED", "ADMIN"]);
export type UserStatus = z.infer<typeof UserStatusSchema>;

export const UserSchema = z.object({
  id: z.string(),
  google_id: z.string().optional(),
  email: z.string().email(),
  name: z.string().nullable().optional(),
  avatar_url: z.string().nullable().optional(),
  status: UserStatusSchema,
  created_at: z.string().datetime({ offset: true }),
});

export type User = z.infer<typeof UserSchema>;

// ── Admin ─────────────────────────────────────────────────────────────────────

export const AdminUserSchema = z.object({
  id: z.string(),
  email: z.string().email(),
  name: z.string().nullable().optional(),
  avatar_url: z.string().nullable().optional(),
  status: UserStatusSchema,
  created_at: z.string().datetime({ offset: true }),
});

export type AdminUser = z.infer<typeof AdminUserSchema>;

// ── Settings ─────────────────────────────────────────────────────────────────

export const SpecialDaySchema = z.object({
  date: z.string(),
  available: z.boolean(),
});

export const SettingsSchema = z.object({
  working_hours_start: z.string(),
  working_hours_end: z.string(),
  days_off: z.array(z.number().int().min(0).max(6)),
  time_zone: z.string(),
  special_days: z.array(SpecialDaySchema),
});

export type Settings = z.infer<typeof SettingsSchema>;
export type SpecialDay = z.infer<typeof SpecialDaySchema>;

// ── AI settings ──────────────────────────────────────────────────────────────

export const AllowedAiModelSchema = z.enum(["gpt-5", "gpt-5-mini", "gpt-5-nano"]);

export const ApiKeyStatusSchema = z.object({
  configured: z.boolean(),
  last4: z.string().nullable(),
});

export const AiSettingsSchema = z.object({
  model_plan_generation: AllowedAiModelSchema,
  model_regeneration: AllowedAiModelSchema,
  model_scheduling: AllowedAiModelSchema,
  available_models: z.array(AllowedAiModelSchema),
  api_key: ApiKeyStatusSchema,
});

export type AllowedAiModel = z.infer<typeof AllowedAiModelSchema>;
export type ApiKeyStatus = z.infer<typeof ApiKeyStatusSchema>;
export type AiSettings = z.infer<typeof AiSettingsSchema>;

export const UpdateAiModelsSchema = z.object({
  model_plan_generation: AllowedAiModelSchema,
  model_regeneration: AllowedAiModelSchema,
  model_scheduling: AllowedAiModelSchema,
});

export type UpdateAiModels = z.infer<typeof UpdateAiModelsSchema>;

export const UpdateApiKeySchema = z.object({
  api_key: z.string().min(1, "API key is required"),
});

export type UpdateApiKey = z.infer<typeof UpdateApiKeySchema>;

// ── Request bodies ───────────────────────────────────────────────────────────

export const FeedbackStatusSchema = z.enum([
  "PENDING",
  "IN_PROGRESS",
  "DONE",
  "HOLD",
]);
export type FeedbackStatus = z.infer<typeof FeedbackStatusSchema>;

export const StatusChangeSchema = z.object({
  taskId: z.string(),
  newStatus: FeedbackStatusSchema,
});

export const FeedbackBodySchema = z.object({
  statusChanges: z.array(StatusChangeSchema),
  contextText: z.string().optional(),
});

export const TaskPatchSchema = z.object({
  title: z.string().min(1).optional(),
  description: z.string().optional(),
  estimated_minutes: z.number().int().min(15).max(240).optional(),
  sequence_order: z.number().int().min(0).optional(),
});

export const TaskCreateSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  estimated_minutes: z.number().int().min(15).max(240).optional(),
  parent_task_id: z.string().optional(),
});

export type StatusChange = z.infer<typeof StatusChangeSchema>;
export type FeedbackBody = z.infer<typeof FeedbackBodySchema>;
export type TaskPatch = z.infer<typeof TaskPatchSchema>;
export type TaskCreate = z.infer<typeof TaskCreateSchema>;

// ── Responses ────────────────────────────────────────────────────────────────

export const ScheduleResponseSchema = z.object({
  scheduledTaskIds: z.array(z.string()),
  unscheduledTaskIds: z.array(z.string()),
});

export const FeedbackResponseSchema = z.object({
  rescheduled: z.number(),
  planStatus: PlanStatusSchema,
  unscheduledTaskIds: z.array(z.string()),
  rescheduleFailed: z.boolean().optional(),
});

export const PlanProgressSchema = z.object({
  plan: PlanSchema.nullable(),
});

export type ScheduleResponse = z.infer<typeof ScheduleResponseSchema>;
export type FeedbackResponse = z.infer<typeof FeedbackResponseSchema>;
export type PlanProgress = z.infer<typeof PlanProgressSchema>;
