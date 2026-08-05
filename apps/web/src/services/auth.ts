import { requestJson } from "./api.ts";
import type { AuthResponse, CurrentUser, LoginPayload } from "./auth.types.ts";

export const login = async (payload: LoginPayload): Promise<AuthResponse> => {
  const response = await requestJson<AuthResponse>("/auth/login", {
    method: "POST",
    body: JSON.stringify({
      email: payload.email.trim(),
      password: payload.password,
    }),
  });

  return response.data;
};

export const fetchCurrentUser = async (): Promise<CurrentUser> => {
  const response = await requestJson<CurrentUser>("/auth/me", {
    method: "GET",
  });

  return response.data;
};
