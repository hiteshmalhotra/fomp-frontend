import axios from 'axios'
import type { HealthResponse, ServiceHealthResult } from '@/types/health.types'

// The gateway only routes /api/** to services, so per-service actuator
// health is not reachable from the browser. Until the gateway exposes an
// aggregated health route, we report exactly what we can verify:
// the API Gateway's own health — honestly labelled as such.
const GATEWAY_HEALTH_URL = `${import.meta.env.VITE_API_BASE_URL}/actuator/health`

const checkGateway = async (): Promise<ServiceHealthResult> => {
  try {
    const res = await axios.get<HealthResponse>(GATEWAY_HEALTH_URL, {
      timeout: 3000,
    })
    return {
      name: 'API Gateway',
      status: res.data.status === 'UP' ? 'healthy' : 'degraded',
    }
  } catch {
    return { name: 'API Gateway', status: 'down' }
  }
}

export const healthApi = {
  checkAllServices: async (): Promise<ServiceHealthResult[]> => [
    await checkGateway(),
  ],
}
