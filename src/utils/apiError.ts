import { isAxiosError } from 'axios'

/**
 * Normalised shape of a backend error extracted from an unknown thrown value.
 * Mirrors the ApiError envelope from common-security's GlobalExceptionHandler.
 */
export interface ApiErrorInfo {
  status?: number
  code?: string          // machine-readable e.g. EMAIL_ALREADY_EXISTS
  message?: string       // human-readable backend message
  correlationId?: string
  retryAfterSeconds?: number
  fieldErrors?: { field: string; message: string }[]
}

/**
 * Extract typed error details from any thrown value.
 * Single replacement for the `err: any` pattern in catch blocks.
 */
export const getApiError = (err: unknown): ApiErrorInfo => {
  if (!isAxiosError(err)) {
    return { message: err instanceof Error ? err.message : undefined }
  }

  const body = err.response?.data as
    | {
        error?: string
        message?: string
        retryAfterSeconds?: number
        errors?: { field: string; message: string }[]
      }
    | undefined

  const retryAfterHeader = err.response?.headers?.['retry-after']

  return {
    status: err.response?.status,
    code: body?.error,
    message: body?.message,
    correlationId: err.response?.headers?.['x-correlation-id'],
    retryAfterSeconds:
      body?.retryAfterSeconds ??
      (retryAfterHeader ? parseInt(retryAfterHeader, 10) : undefined),
    fieldErrors: body?.errors,
  }
}
