import { describe, it, expect } from 'vitest'
import { AxiosError, AxiosHeaders } from 'axios'
import { getApiError } from './apiError'

const makeAxiosError = (
  status: number,
  data: unknown,
  headers: Record<string, string> = {}
): AxiosError => {
  const error = new AxiosError('Request failed')
  error.response = {
    status,
    statusText: '',
    data,
    headers,
    config: { headers: new AxiosHeaders() },
  }
  return error
}

describe('getApiError', () => {
  it('extracts status, code and message from the backend envelope', () => {
    const err = makeAxiosError(409, {
      success: false,
      error: 'EMAIL_ALREADY_EXISTS',
      message: 'Email already registered',
    })
    expect(getApiError(err)).toMatchObject({
      status: 409,
      code: 'EMAIL_ALREADY_EXISTS',
      message: 'Email already registered',
    })
  })

  it('extracts field errors from validation responses', () => {
    const err = makeAxiosError(400, {
      error: 'VALIDATION_ERROR',
      errors: [{ field: 'email', message: 'Invalid email' }],
    })
    expect(getApiError(err).fieldErrors).toEqual([
      { field: 'email', message: 'Invalid email' },
    ])
  })

  it('reads retry-after from body first, then header', () => {
    const bodyErr = makeAxiosError(429, { retryAfterSeconds: 42 })
    expect(getApiError(bodyErr).retryAfterSeconds).toBe(42)

    const headerErr = makeAxiosError(429, {}, { 'retry-after': '30' })
    expect(getApiError(headerErr).retryAfterSeconds).toBe(30)
  })

  it('captures the correlation id header', () => {
    const err = makeAxiosError(500, {}, { 'x-correlation-id': 'abc-123' })
    expect(getApiError(err).correlationId).toBe('abc-123')
  })

  it('handles non-axios errors without throwing', () => {
    expect(getApiError(new Error('boom'))).toEqual({ message: 'boom' })
    expect(getApiError('string error')).toEqual({ message: undefined })
    expect(getApiError(undefined)).toEqual({ message: undefined })
  })
})
