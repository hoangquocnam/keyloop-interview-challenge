export type HealthResponse = {
  readonly status: string
  readonly service: string
  readonly timestamp: string
}

const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3000/api'

export const fetchApiHealth = async (): Promise<HealthResponse> => {
  const response = await fetch(`${API_URL}/health`)

  if (!response.ok) {
    throw new Error('Failed to fetch API health status')
  }

  return (await response.json()) as HealthResponse
}
