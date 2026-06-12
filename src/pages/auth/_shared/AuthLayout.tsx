import { Typography } from 'antd'
import { APP_NAME, APP_VERSION } from '@/utils/constants'
import styles from './auth.module.css'

const { Text, Link } = Typography

interface AuthLayoutProps {
  children: React.ReactNode
  navRight?: React.ReactNode
}

const AuthLayout = ({ children, navRight }: AuthLayoutProps) => {
  return (
    <div className={styles.root}>
      <div className={styles.bgLayer} />

      {/* Top nav */}
      <nav className={styles.topNav}>
        <div className={styles.navBrand}>
          <div className={styles.logoBox}>
            <span className={styles.logoIcon}>🍽</span>
          </div>
          <Text className={styles.navTitle}>{APP_NAME}</Text>
        </div>
        {navRight && (
          <div className={styles.navLinks}>{navRight}</div>
        )}
      </nav>

      {/* Main content */}
      <main className={styles.centerWrapper}>
        <div className={styles.card}>{children}</div>
      </main>

      {/* Footer */}
      <footer className={styles.footer}>
        <div className={styles.footerLinks}>
          <Link className={styles.footerLink}>Privacy Policy</Link>
          <span className={styles.footerDot}>·</span>
          <Link className={styles.footerLink}>Terms of Service</Link>
          <span className={styles.footerDot}>·</span>
          <Link className={styles.footerLink}>Security</Link>
          <span className={styles.footerDot}>·</span>
          <Link className={styles.footerLink}>Need Help?</Link>
        </div>
        <Text className={styles.footerCopy}>
          {APP_NAME} v{APP_VERSION} · © 2026 All rights reserved.
        </Text>
      </footer>
    </div>
  )
}

export default AuthLayout