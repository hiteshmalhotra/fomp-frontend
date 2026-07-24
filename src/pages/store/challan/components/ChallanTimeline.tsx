import { Timeline, Typography } from 'antd'
import { formatDate, formatDateTime } from '@/utils/format'
import type { TransferChallanDetail } from '@/types/store.types'

const { Text } = Typography

interface Props {
  challan: TransferChallanDetail
}

/**
 * Status timeline built from the by/date fields the detail exposes.
 * NOTE: the backend has no dedicated status-history log, so this shows
 * the known milestones (created/approved/dispatched/received/verified),
 * not every intermediate transition.
 */
const ChallanTimeline = ({ challan }: Props) => {
  const items: { label: string; who?: string | null; when?: string | null }[] = [
    { label: 'Created', who: challan.createdBy, when: formatDateTime(challan.createdAt) },
    { label: 'Approved', who: challan.approvedBy },
    {
      label: 'Dispatched',
      who: challan.dispatchedBy,
      when: challan.dispatchedDate ? formatDate(challan.dispatchedDate) : null,
    },
    {
      label: 'Received',
      who: challan.receivedBy,
      when: challan.receivedDate ? formatDate(challan.receivedDate) : null,
    },
    {
      label: 'Verified',
      who: challan.verifiedBy,
      when: challan.verifiedDate ? formatDate(challan.verifiedDate) : null,
    },
  ].filter((i) => i.who || i.when)

  return (
    <Timeline
      items={items.map((i) => ({
        children: (
          <div>
            <Text strong>{i.label}</Text>
            {i.who && <div><Text type="secondary">by {i.who}</Text></div>}
            {i.when && <div><Text type="secondary">{i.when}</Text></div>}
          </div>
        ),
      }))}
    />
  )
}

export default ChallanTimeline
