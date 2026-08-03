import { API_URL } from './api.ts'

export type HealthResponse = {
  readonly status: string
  readonly service: string
  readonly timestamp: string
}

export const fetchApiHealth = async (): Promise<HealthResponse> => {
  const response = await fetch(`${API_URL}/health`)

  if (!response.ok) {
    throw new Error('Failed to fetch API health status')
  }

  return (await response.json()) as HealthResponse
}
