import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type TextScale = 'default' | 'large'

interface PreferencesState {
  textScale: TextScale
  setTextScale: (scale: TextScale) => void
}

/**
 * User display preferences — persisted per browser.
 * textScale bumps the antd font tokens app-wide (accessibility feature
 * for elderly users; the product intentionally has no dark mode).
 */
export const usePreferencesStore = create<PreferencesState>()(
  persist(
    (set) => ({
      textScale: 'default',
      setTextScale: (textScale) => set({ textScale }),
    }),
    { name: 'fomp-preferences' }
  )
)
