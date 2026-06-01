import { API } from "@/utils/config/api";
import { logger } from "@/utils/logger/logger";

// ==========================
// Types
// ==========================
type RequestOptions = RequestInit & {
  token?: string | null;
  pathname?: string;
};

// ==========================
// Errors
// ==========================
export class NetworkError extends Error {
  constructor(message = "No internet connection") {
    super(message);
    this.name = "NetworkError";
  }
}

export class ApiError extends Error {
  status: number;
  data: unknown;

  constructor(message: string, status: number, data?: unknown) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.data = data;
  }
}

// ==========================
// Helpers
// ==========================
function safeJsonParse(body: any) {
  try {
    return typeof body === "string" ? JSON.parse(body) : body;
  } catch {
    return body;
  }
}

function maskSensitive(data: any) {
  if (!data || typeof data !== "object") return data;

  const copy = { ...data };

  if ("password" in copy) copy.password = "***";
  if ("token" in copy) copy.token = "***";

  return copy;
}

// ==========================
// API FUNCTION
// ==========================
export async function api<T>(
  endpoint: string,
  options: RequestOptions = {},
): Promise<T> {
  const { token, headers, ...rest } = options;

  const url = `${API}${endpoint}`;
  const method = rest.method || "GET";

  const requestBody = rest.body ? safeJsonParse(rest.body) : null;

  // ✅ start time (for duration)
  const start = Date.now();

  // ==========================
  // ✅ REQUEST LOG (ALWAYS FIRST)
  // ==========================
  logger.info("API Request", {
    url,
    method,
    body: maskSensitive(requestBody),
    pathname: options.pathname || null,
  });

  let response: Response;

  try {
    response = await fetch(url, {
      ...rest,
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...headers,
      },
    });
  } catch (error: any) {
    const isOffline =
      typeof navigator !== "undefined" ? navigator.onLine === false : false;

    logger.error("API Network Failure", {
      url,
      message: error?.message,
      isOffline,
    });

    throw new NetworkError(
      isOffline
        ? "No internet connection"
        : "Unable to reach the server. Please check your connection.",
    );
  }

  let data: any = null;

  try {
    data = await response.json();
  } catch {
    data = null;
  }

  const duration = Date.now() - start;

  // ==========================
  // ✅ RESPONSE LOG (ALWAYS SECOND)
  // ==========================

  logger.info("API Response", {
    url,
    status: response.status,
    duration: `${duration}ms`,
    ...(typeof data === "object" ? maskSensitive(data) : {}),
  });

  // ==========================
  // ERROR HANDLING
  // ==========================
  if (!response.ok) {
    const message =
      (typeof data === "object" && data?.message) ||
      response.statusText ||
      "Something went wrong";

    logger.error("API Error", {
      url,
      status: response.status,
      message,
      raw: data,
    });

    throw new ApiError(message, response.status, data);
  }

  return data as T;
}
