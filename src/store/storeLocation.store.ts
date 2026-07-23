import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface StoreLocationState {
  /** Selected store location — shared by every Store screen, persisted. */
  locationId: number | null
  setLocationId: (id: number) => void
}

export const useStoreLocationStore = create<StoreLocationState>()(
  persist(
    (set) => ({
      locationId: null,
      setLocationId: (locationId) => set({ locationId }),
    }),
    { name: 'fomp-store-location' }
  )
)
