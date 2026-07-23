import { describe, it, expect } from 'vitest'
import { PASSWORD_RULES, passwordSchema } from './passwordPolicy'

const VALID = 'Passw0rd!'.replace('!', '@') // Passw0rd@ — satisfies all rules

describe('passwordSchema (mirrors backend RegisterRequest pattern)', () => {
  it('accepts a compliant password', () => {
    expect(passwordSchema.safeParse(VALID).success).toBe(true)
  })

  it.each([
    ['too short', 'Ab1@'],
    ['no lowercase', 'PASSW0RD@'],
    ['no uppercase', 'passw0rd@'],
    ['no number', 'Password@'],
    ['no special char', 'Passw0rd1'],
    ['disallowed special char', 'Passw0rd#'],
  ])('rejects: %s', (_label, value) => {
    expect(passwordSchema.safeParse(value).success).toBe(false)
  })
})

describe('PASSWORD_RULES stay in sync with the schema', () => {
  it('a password passing every rule passes the schema', () => {
    expect(PASSWORD_RULES.every((r) => r.test(VALID))).toBe(true)
    expect(passwordSchema.safeParse(VALID).success).toBe(true)
  })

  it('each rule failure fails the schema too', () => {
    const failures = [
      'Ab1@',       // length
      'PASSW0RD@',  // lowercase
      'passw0rd@',  // uppercase
      'Password@',  // number
      'Passw0rd1',  // special
    ]
    failures.forEach((pw) => {
      expect(PASSWORD_RULES.every((r) => r.test(pw))).toBe(false)
      expect(passwordSchema.safeParse(pw).success).toBe(false)
    })
  })
})
