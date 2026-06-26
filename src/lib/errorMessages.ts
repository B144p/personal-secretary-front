import type { ErrorCode } from "@/lib/schemas";

export const errorMessages: Record<ErrorCode, string> = {
  UNAUTHENTICATED: "You are not signed in.",
  GOOGLE_REAUTH_REQUIRED: "Your Google access expired. Please sign in again.",
  ACCOUNT_PENDING: "Your account is pending approval.",
  ACCOUNT_REJECTED: "Your access has been rejected.",
  CANNOT_REJECT_ADMIN: "The admin account cannot be rejected.",
  PLAN_NOT_FOUND: "Plan not found.",
  PLAN_NOT_EDITABLE: "This plan cannot be edited in its current state.",
  INVALID_TRANSITION: "That status transition is not allowed.",
  ANOTHER_PLAN_SCHEDULED: "You already have an active scheduled plan.",
  SCHEDULING_IN_PROGRESS: "This plan is already being scheduled. Please wait.",
  PLAN_PAUSED: "This plan is paused. Resume it before scheduling.",
  REASON_REQUIRED: "Please provide a reason of at least 10 characters.",
  INVALID_GOAL: "Goal must be at least 5 characters.",
  INVALID_HOURS:
    "Working hours end must be later than start.",
  INVALID_TIMEZONE: "Please select a valid timezone.",
  NO_OP_FEEDBACK: "No changes to submit.",
  AI_GENERATION_FAILED:
    "AI plan generation failed. Please try again.",
  SCHEDULING_INFEASIBLE:
    "Could not fit all tasks in the next 30 days. Try adjusting your working hours.",
  GOOGLE_CALENDAR_ERROR:
    "Google Calendar returned an error. Please try again.",
  AI_KEY_NOT_CONFIGURED:
    "Add your OpenAI API key in Settings > AI provider before using AI features.",
  INVALID_API_KEY: "That OpenAI API key looks invalid. Please check it and try again.",
};
