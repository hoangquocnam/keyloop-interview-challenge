import type {
  ApiErrorPayload,
  ApiSuccessResponse,
  RequestJsonOptions,
} from "./api.types.ts";
import { getAccessTokenCookie } from "./auth-cookie.ts";

export const API_URL =
  import.meta.env.VITE_API_URL ?? "http://localhost:3000/api";

export class ApiError extends Error {
  statusCode: number;

  constructor(message: string, statusCode: number) {
    super(message);
    this.name = "ApiError";
    this.statusCode = statusCode;
  }
}

const parseApiError = async (response: Response): Promise<ApiError> => {
  const contentType = response.headers.get("content-type");

  if (contentType?.includes("application/json")) {
    const payload = (await response.json()) as ApiErrorPayload;
    const message = Array.isArray(payload.message)
      ? payload.message.join(", ")
      : payload.message ?? payload.error ?? "Request failed";

    return new ApiError(message, response.status);
  }

  const message = await response.text();

  return new ApiError(message || "Request failed", response.status);
};

export const requestJson = async <TResponse>(
  path: string,
  options?: RequestJsonOptions,
): Promise<ApiSuccessResponse<TResponse>> => {
  const headers = new Headers(options?.headers);

  if (options?.body != null && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  const accessToken = getAccessTokenCookie();

  if (accessToken && !headers.has("Authorization")) {
    headers.set("Authorization", `Bearer ${accessToken}`);
  }

  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    throw await parseApiError(response);
  }

  const payload = (await response.json()) as
    | ApiSuccessResponse<TResponse>
    | TResponse;

  if (
    payload != null &&
    typeof payload === "object" &&
    "data" in payload &&
    "statusCode" in payload
  ) {
    return {
      data: payload.data,
      statusCode:
        typeof payload.statusCode === "string"
          ? Number(payload.statusCode)
          : payload.statusCode,
      success:
        "success" in payload && typeof payload.success === "boolean"
          ? payload.success
          : undefined,
    };
  }

  return {
    data: payload as TResponse,
    statusCode: response.status,
  };
};
