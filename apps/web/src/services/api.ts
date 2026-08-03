export const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3000/api'

type ApiErrorPayload = {
  readonly message?: string | string[]
  readonly error?: string
  readonly statusCode?: number
}

export class ApiError extends Error {
  readonly statusCode: number

  constructor(message: string, statusCode: number) {
    super(message)
    this.name = 'ApiError'
    this.statusCode = statusCode
  }
}

const parseApiError = async (response: Response): Promise<ApiError> => {
  const contentType = response.headers.get('content-type')

  if (contentType?.includes('application/json')) {
    const payload = (await response.json()) as ApiErrorPayload
    const message = Array.isArray(payload.message)
      ? payload.message.join(', ')
      : payload.message ?? payload.error ?? 'Request failed'

    return new ApiError(message, response.status)
  }

  const message = await response.text()

  return new ApiError(message || 'Request failed', response.status)
}

type RequestJsonOptions = RequestInit & {
  readonly accessToken?: string
}

export const requestJson = async <TResponse>(
  path: string,
  options?: RequestJsonOptions,
): Promise<TResponse> => {
  const headers = new Headers(options?.headers)

  if (options?.body != null && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json')
  }

  if (options?.accessToken) {
    headers.set('Authorization', `Bearer ${options.accessToken}`)
  }

  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers,
  })

  if (!response.ok) {
    throw await parseApiError(response)
  }

  return (await response.json()) as TResponse
}
