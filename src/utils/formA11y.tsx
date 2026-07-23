/**
 * Wraps a form error message in role="alert" so screen readers announce
 * it the moment it appears (WCAG 4.1.3 Status Messages).
 * Use in antd Form.Item: help={fieldError(errors.email?.message)}
 */
export const fieldError = (message?: string): React.ReactNode =>
  message ? <span role="alert">{message}</span> : undefined
