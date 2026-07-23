import '@testing-library/jest-dom/vitest'
import { afterEach } from 'vitest'
import { cleanup } from '@testing-library/react'

// RTL auto-cleanup only registers itself when vitest globals are enabled —
// we use explicit imports, so unmount rendered trees manually between tests.
afterEach(() => {
  cleanup()
})

// antd reads matchMedia at import time in some components — jsdom lacks it.
if (!window.matchMedia) {
  window.matchMedia = (query: string): MediaQueryList =>
    ({
      matches: false,
      media: query,
      onchange: null,
      addListener: () => {},
      removeListener: () => {},
      addEventListener: () => {},
      removeEventListener: () => {},
      dispatchEvent: () => false,
    }) as MediaQueryList
}
