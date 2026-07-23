import axios from 'axios'
import type { HealthResponse } from '@/types/health.types'

// create a single endpoint for checking health
const HEALTH_ENDPOINT = 'http://localhost:8080/actuator/health'

const SERVICE_ENDPOINTS = [
  { name: 'User Service', url: HEALTH_ENDPOINT },
  { name: 'Store Service', url: HEALTH_ENDPOINT },
  { name: 'Notification Service', url: HEALTH_ENDPOINT },
  { name: 'Kitchen Service', url: HEALTH_ENDPOINT },
  { name: 'Canteen Service', url: HEALTH_ENDPOINT },
]

const checkOne = async (name: string, url: string) => {
  try {
    const res = await axios.get<HealthResponse>(url, { timeout: 3000 })
    return {
      name,
      status: res.data.status === 'UP' ? ('healthy' as const) : ('degraded' as const),
    }
  } catch {
    return { name, status: 'down' as const }
  }
}

export const healthApi = {
  checkAllServices: () =>
    Promise.all(SERVICE_ENDPOINTS.map((s) => checkOne(s.name, s.url))),
}