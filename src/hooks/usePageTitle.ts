import { useEffect } from 'react'
import { APP_SHORT_NAME } from '@/utils/constants'

/**
 * Sets document.title per route — required for tabs, history,
 * screen readers and analytics. Restores nothing on unmount:
 * the next page sets its own title.
 */
export const usePageTitle = (title: string) => {
  useEffect(() => {
    document.title = `${title} · ${APP_SHORT_NAME}`
  }, [title])
}
