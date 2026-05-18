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

async function parseError(res: Response): Promise<ApiError> {
  try {
    const json: unknown = await res.json();
    const parsed = ApiErrorSchema.safeParse(json);
    if (parsed.success) {
      return new ApiError(parsed.data.code, parsed.data);
    }
  } catch {
    // fall through to generic error
  }
  return new ApiError("UNAUTHENTICATED", {
    code: "UNAUTHENTICATED",
    message: `HTTP ${res.status}`,
  });
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
    const err = await parseError(res);

    if (err.code === "UNAUTHENTICATED") {
      if (typeof window !== "undefined") {
        window.location.href = "/signin";
      }
      throw err;
    }

    if (err.code === "GOOGLE_REAUTH_REQUIRED") {
      if (typeof window !== "undefined") {
        window.location.href = "/signin?reauth=1";
      }
      throw err;
    }

    throw err;
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
