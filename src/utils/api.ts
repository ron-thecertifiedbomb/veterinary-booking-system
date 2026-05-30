// src/utils/api.ts

import { API } from "@/utils/config/api";
import { logger } from "@/utils/logger";

type RequestOptions = RequestInit & {
  token?: string | null;
};

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

export async function api<T>(
  endpoint: string,
  options: RequestOptions = {},
): Promise<T> {
  const { token, headers, ...rest } = options;

  const url = `${API}${endpoint}`;

  logger.info("API Request", {
    url,
    method: rest.method || "GET",
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
  } catch (error) {
    // fetch() itself throws when there's a network-level failure
    const isOffline = !navigator.onLine;

    logger.error("Network failure", { isOffline, error });

    throw new NetworkError(
      isOffline
        ? "No internet connection"
        : "Unable to reach the server. Please check your connection.",
    );
  }

  const data = await response.json();

  logger.info("API Response", {
    status: response.status,
    endpoint,
  });

  if (!response.ok) {
    logger.error("API Error", data);
    throw new ApiError(
      data?.message || "Something went wrong",
      response.status,
      data,
    );
  }

  return data as T;
}
