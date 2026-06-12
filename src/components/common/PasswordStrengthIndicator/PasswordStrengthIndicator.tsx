import { useMemo } from 'react'
import { CheckCircleFilled, CloseCircleFilled } from '@ant-design/icons'
import styles from './PasswordStrengthIndicator.module.css'
import clsx from 'clsx'

interface Rule {
  label: string
  test: (v: string) => boolean
}

const RULES: Rule[] = [
  { label: 'Minimum 8 characters', test: (v) => v.length >= 8 },
  { label: 'One uppercase letter', test: (v) => /[A-Z]/.test(v) },
  { label: 'One number',           test: (v) => /[0-9]/.test(v) },
  { label: 'One special character', test: (v) => /[^A-Za-z0-9]/.test(v) },
]

type Strength = 'weak' | 'fair' | 'good' | 'strong'

const getStrength = (passed: number): Strength => {
  if (passed <= 1) return 'weak'
  if (passed === 2) return 'fair'
  if (passed === 3) return 'good'
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
    () => RULES.map((r) => r.test(password)),
    [password]
  )

  const passedCount = results.filter(Boolean).length
  const strength = getStrength(passedCount)

  if (!password) return null

  return (
    <div className={styles.wrapper}>
      {/* Strength bars */}
      <div className={styles.barRow}>
        {RULES.map((_, i) => (
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
        {RULES.map((rule, i) => (
          <div
            key={rule.label}
            className={clsx(styles.rule, results[i] && styles.passed)}
          >
            {results[i] ? (
              <CheckCircleFilled className={styles.ruleIcon} />
            ) : (
              <CloseCircleFilled className={styles.ruleIcon} />
            )}
            {rule.label}
          </div>
        ))}
      </div>
    </div>
  )
}

export default PasswordStrengthIndicator