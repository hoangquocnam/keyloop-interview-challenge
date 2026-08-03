import { requestJson } from './api.ts'

export type UserRole = 'SALES' | 'MANAGER'

export type CurrentUser = {
  readonly email: string
  readonly fullName: string
  readonly id: string
  readonly role: UserRole
}

export type LoginPayload = {
  readonly email: string
  readonly password: string
}

export type AuthResponse = {
  readonly accessToken: string
  readonly user: CurrentUser
}

export const login = async (payload: LoginPayload): Promise<AuthResponse> => {
  return requestJson<AuthResponse>('/auth/login', {
    method: 'POST',
    body: JSON.stringify({
      email: payload.email.trim(),
      password: payload.password,
    }),
  })
}

export const fetchCurrentUser = async (
  accessToken: string,
): Promise<CurrentUser> => {
  return requestJson<CurrentUser>('/auth/me', {
    accessToken,
    method: 'GET',
  })
}
