import '@testing-library/jest-dom/vitest'
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import PasswordStrengthIndicator from './PasswordStrengthIndicator'
import { PASSWORD_RULES } from '@/utils/passwordPolicy'

describe('PasswordStrengthIndicator', () => {
  it('renders nothing for an empty password', () => {
    const { container } = render(<PasswordStrengthIndicator password="" />)
    expect(container).toBeEmptyDOMElement()
  })

  it('shows Weak for a short password', () => {
    render(<PasswordStrengthIndicator password="ab" />)
    expect(screen.getByText(/Password strength: Weak/)).toBeInTheDocument()
  })

  it('shows Strong when every rule passes', () => {
    render(<PasswordStrengthIndicator password="Passw0rd@" />)
    expect(screen.getByText(/Password strength: Strong/)).toBeInTheDocument()
  })

  it('lists every shared password rule', () => {
    render(<PasswordStrengthIndicator password="x" />)
    PASSWORD_RULES.forEach((rule) => {
      expect(screen.getByText(rule.label)).toBeInTheDocument()
    })
  })

  it('announces strength via role=status for screen readers', () => {
    render(<PasswordStrengthIndicator password="Passw0rd@" />)
    expect(screen.getByRole('status')).toBeInTheDocument()
  })
})
