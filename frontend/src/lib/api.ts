const API_URL: string = import.meta.env.VITE_API_URL ?? 'http://localhost:8000'

export interface HealthResponse {
  status: string
  database: string
}

export async function getHealth(): Promise<HealthResponse> {
  const response = await fetch(`${API_URL}/api/v1/health`)
  // The backend returns a JSON body for both 200 (ok) and 503 (db down).
  return (await response.json()) as HealthResponse
}