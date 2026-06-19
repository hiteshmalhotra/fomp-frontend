import axios from 'axios'
import type { HealthResponse } from '@/types/health.types'

const SERVICE_ENDPOINTS = [
  { name: 'User Service', url: 'http://localhost:8081/actuator/health' },
  { name: 'Store Service', url: 'http://localhost:8082/actuator/health' },
  { name: 'Notification Service', url: 'http://localhost:8083/actuator/health' },
  { name: 'Kitchen Service', url: 'http://localhost:8084/actuator/health' },
  { name: 'Canteen Service', url: 'http://localhost:8085/actuator/health' },
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