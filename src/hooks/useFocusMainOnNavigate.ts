import { useEffect, useRef } from 'react'
import { useLocation } from 'react-router-dom'

/**
 * WCAG: SPA route changes are invisible to screen readers unless focus
 * moves. After each navigation, focus the main content region so the
 * new page is announced and keyboard users start at the content.
 * Skips the initial mount — stealing focus on first load is hostile.
 */
export const useFocusMainOnNavigate = (mainId = 'main-content') => {
  const { pathname } = useLocation()
  const isFirstRender = useRef(true)

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false
      return
    }
    const main = document.getElementById(mainId)
    if (main) {
      main.focus({ preventScroll: false })
    }
  }, [pathname, mainId])
}
