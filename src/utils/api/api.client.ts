import { API } from "@/utils/api/api.config";
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
  type: "OFFLINE" | "SERVER_UNREACHABLE";

  constructor(
    message: string = "Network error",
    type: "OFFLINE" | "SERVER_UNREACHABLE" = "SERVER_UNREACHABLE",
  ) {
    super(message);
    this.name = "NetworkError";
    this.type = type;
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

  const start = Date.now();

  logger.info("API Request", {
    endpoint,
    method,
  });

  let response: Response;

  try {
    // ✅ PRE-CHECK (faster UX)
    if (typeof navigator !== "undefined" && navigator.onLine === false) {
      throw new NetworkError("No internet connection", "OFFLINE");
    }

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
      typeof navigator !== "undefined" && navigator.onLine === false;

    logger.error("API Network Failure", {
      url,
      message: error?.message,
      isOffline,
    });

    // ✅ DIFFERENTIATE ERROR TYPES
    if (isOffline) {
      throw new NetworkError("No internet connection", "OFFLINE");
    }

    // ✅ Covers:
    // - server down
    // - refused connection
    // - DNS failure
    // - timeout (in some environments)
    throw new NetworkError("Server cannot be reached", "SERVER_UNREACHABLE");
  }

  let data: any = null;

  try {
    data = await response.json();
  } catch {
    data = null;
  }

  const duration = Date.now() - start;

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
