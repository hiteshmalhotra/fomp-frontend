import { useMemo } from 'react'
import { CheckCircleFilled, CloseCircleFilled } from '@ant-design/icons'
import { PASSWORD_RULES } from '@/utils/passwordPolicy'
import styles from './PasswordStrengthIndicator.module.css'
import clsx from 'clsx'

type Strength = 'weak' | 'fair' | 'good' | 'strong'

// 5 shared rules (utils/passwordPolicy) — the meter reflects exactly
// what the zod schemas enforce.
const getStrength = (passed: number): Strength => {
  if (passed <= 2) return 'weak'
  if (passed === 3) return 'fair'
  if (passed === 4) return 'good'
  return 'strong'
}

const STRENGTH_LABELS: Record<Strength, string> = {
  weak: 'Weak',
  fair: 'Fair',
  good: 'Good',
  strong: 'Strong',
}

interface Props {
  password: string
}

const PasswordStrengthIndicator = ({ password }: Props) => {
  const results = useMemo(
    () => PASSWORD_RULES.map((r) => r.test(password)),
    [password]
  )

  const passedCount = results.filter(Boolean).length
  const strength = getStrength(passedCount)

  if (!password) return null

  return (
    <div
      className={styles.wrapper}
      role="status"
      aria-live="polite"
      aria-label={`Password strength: ${STRENGTH_LABELS[strength]}`}
    >
      {/* Strength bars */}
      <div className={styles.barRow} aria-hidden="true">
        {PASSWORD_RULES.map((_, i) => (
          <div
            key={i}
            className={clsx(
              styles.bar,
              i < passedCount && styles.active,
              i < passedCount && styles[strength]
            )}
          />
        ))}
      </div>

      {/* Strength label */}
      <span className={clsx(styles.label, styles[strength])}>
        Password strength: {STRENGTH_LABELS[strength]}
      </span>

      {/* Rules checklist */}
      <div className={styles.rules}>
        {PASSWORD_RULES.map((rule, i) => (
          <div
            key={rule.key}
            className={clsx(styles.rule, results[i] && styles.passed)}
          >
            {results[i] ? (
              <CheckCircleFilled className={styles.ruleIcon} aria-hidden="true" />
            ) : (
              <CloseCircleFilled className={styles.ruleIcon} aria-hidden="true" />
            )}
            {rule.label}
          </div>
        ))}
      </div>
    </div>
  )
}

export default PasswordStrengthIndicator
