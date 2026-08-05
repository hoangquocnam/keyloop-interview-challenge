export type UserRole = "SALES" | "MANAGER";

export type CurrentUser = {
  email: string;
  fullName: string;
  id: string;
  role: UserRole;
};

export type LoginPayload = {
  email: string;
  password: string;
};

export type AuthResponse = {
  accessToken: string;
  user: CurrentUser;
};
