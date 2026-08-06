import { requestJson } from "./api.ts";
import type { UserSummary } from "./user.types.ts";

export const fetchUsers = async (): Promise<UserSummary[]> => {
  const response = await requestJson<UserSummary[]>("/users", {
    method: "GET",
  });

  return response.data;
};
