import { toast } from "sonner";
import { ApiErrorSchema, type ApiErrorBody, type ErrorCode } from "@/lib/schemas";
import { errorMessages } from "@/lib/errorMessages";

const BASE = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8000";

export class ApiError extends Error {
  constructor(
    public readonly code: ErrorCode,
    public readonly body: ApiErrorBody
  ) {
    super(body.message);
    this.name = "ApiError";
  }
}

async function parseEnvelope(res: Response): Promise<ApiError | null> {
  try {
    const json: unknown = await res.json();
    const parsed = ApiErrorSchema.safeParse(json);
    if (parsed.success) {
      return new ApiError(parsed.data.code, parsed.data);
    }
  } catch {
    // not JSON or unparseable — caller will throw a generic Error
  }
  return null;
}

export async function apiFetch<T>(
  path: string,
  init: RequestInit = {}
): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    ...init,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...(init.headers ?? {}),
    },
  });

  if (!res.ok) {
    const envelope = await parseEnvelope(res);

    if (envelope) {
      if (envelope.code === "UNAUTHENTICATED" && typeof window !== "undefined") {
        window.location.href = "/signin";
      } else if (
        envelope.code === "GOOGLE_REAUTH_REQUIRED" &&
        typeof window !== "undefined"
      ) {
        window.location.href = "/signin?reauth=1";
      }
      throw envelope;
    }

    // Unparseable error — surface as a generic Error so toastApiError shows
    // the fallback message instead of mis-routing the user to /signin.
    throw new Error(`HTTP ${res.status}`);
  }

  if (res.status === 204) {
    return undefined as T;
  }

  return res.json() as Promise<T>;
}

export function toastApiError(err: unknown): void {
  if (err instanceof ApiError) {
    const msg = errorMessages[err.code] ?? err.message;
    toast.error(msg);
  } else {
    toast.error("Something went wrong. Please try again.");
  }
}
