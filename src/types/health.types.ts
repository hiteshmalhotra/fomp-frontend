export interface HealthComponent {
  status: 'UP' | 'DOWN' | 'UNKNOWN'
  details?: Record<string, unknown>
  components?: Record<string, HealthComponent>
}

export interface HealthResponse {
  status: 'UP' | 'DOWN' | 'UNKNOWN'
  components: Record<string, HealthComponent>
}

export interface ServiceHealthResult {
  name: string
  status: 'healthy' | 'degraded' | 'down'
}