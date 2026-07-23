import { Select } from 'antd'
import type { StoreLocation } from '@/types/store.types'

interface Props {
  locations: StoreLocation[]
  loading: boolean
  value: number | null
  onChange: (id: number) => void
}

/** Store location picker — shared by all Store screens. */
const LocationSelect = ({ locations, loading, value, onChange }: Props) => (
  <Select
    value={value ?? undefined}
    onChange={onChange}
    loading={loading}
    style={{ minWidth: 220 }}
    placeholder="Select location"
    aria-label="Store location"
    options={locations
      .filter((l) => l.active)
      .map((l) => ({
        value: l.id,
        label: `${l.name} (${l.locationCode})`,
      }))}
  />
)

export default LocationSelect
