import { API } from "@/utils/config/api";
import { logger } from "@/utils/logger/logger";

// ==========================
// Types
// ==========================
type RequestOptions = RequestInit & {
  token?: string | null;
  pathname?: string; // optional route context
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
// API FUNCTION
// ==========================
export async function api<T>(
  endpoint: string,
  options: RequestOptions = {},
): Promise<T> {
  const { token, headers,...rest } = options;

  const url = `${API}${endpoint}`;
  const method = rest.method || "GET";

  // ✅ Request log
  logger.info("API Request", {
    endpoint,
    method,
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
    // ✅ Cross-platform safe offline detect
    const isOffline =
      typeof navigator !== "undefined" ? navigator.onLine === false : false;

    logger.error("API Network Failure", {
      endpoint,
      isOffline,
      message: error?.message,
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
    // non-JSON response safe fallback
    data = null;
  }

  // ✅ Response log
  logger.info("API Response", {
    endpoint,
    status: response.status,
  });

  // ==========================
  // ERROR HANDLING (KEY PART)
  // ==========================
  if (!response.ok) {
    const message =
      (typeof data === "object" && data?.message) || // ✅ server message priority
      response.statusText || // fallback
      "Something went wrong";

    logger.error("API Error", {
      endpoint,
      status: response.status,
      message,
      raw: data,
    });

    // ✅ THROW MESSAGE TO UI
    throw new ApiError(message, response.status, data);
  }

  return data as T;
}
