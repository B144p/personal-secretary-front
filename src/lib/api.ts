import axios from "axios";
import { toast } from "sonner";
import { ApiErrorSchema, type ApiErrorBody, type ErrorCode } from "@/lib/schemas";
import { errorMessages } from "@/lib/errorMessages";

// Same-origin proxy: client calls /api/*, rewritten to the backend in
// next.config.ts. Keeps the jwt cookie first-party (works in Brave, no CORS).
const BASE = "/api";

const client = axios.create({
  baseURL: BASE,
  withCredentials: true,
  headers: { "Content-Type": "application/json" },
  validateStatus: () => true, // handle non-2xx ourselves, same as raw fetch
});

export class ApiError extends Error {
  constructor(
    public readonly code: ErrorCode,
    public readonly body: ApiErrorBody
  ) {
    super(body.message);
    this.name = "ApiError";
  }
}

export class TimeoutError extends Error {
  constructor() {
    super("Request timed out");
    this.name = "TimeoutError";
  }
}

function parseEnvelope(data: unknown): ApiError | null {
  const parsed = ApiErrorSchema.safeParse(data);
  if (parsed.success) {
    return new ApiError(parsed.data.code, parsed.data);
  }
  return null;
}

// Endpoints that call OpenAI and/or the Google Calendar API can legitimately
// take a while (AI generation + a batch of calendar writes). axios has no
// timeout by default, but anything in between (browser, OS, network) might
// still give up on its own — pass timeoutMs for those calls so we control the
// limit explicitly instead of failing on someone else's default.
export async function apiFetch<T>(
  path: string,
  init: RequestInit & { timeoutMs?: number } = {}
): Promise<T> {
  const { timeoutMs, method = "GET", body, headers } = init;

  let res;
  try {
    res = await client.request<unknown>({
      url: path,
      method,
      data: body,
      headers: headers as Record<string, string> | undefined,
      timeout: timeoutMs,
    });
  } catch (err) {
    if (axios.isAxiosError(err) && err.code === "ECONNABORTED") {
      throw new TimeoutError();
    }
    throw err;
  }

  if (res.status < 200 || res.status >= 300) {
    const envelope = parseEnvelope(res.data);

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

  return res.data as T;
}

export function toastApiError(err: unknown): void {
  if (err instanceof ApiError) {
    const msg = errorMessages[err.code] ?? err.message;
    toast.error(msg);
  } else if (err instanceof TimeoutError) {
    toast.error(
      "This is taking longer than expected. It may still complete — check back in a moment before retrying."
    );
  } else {
    toast.error("Something went wrong. Please try again.");
  }
}
