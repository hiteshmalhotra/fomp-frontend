import dayjs from 'dayjs'

export const formatCurrency = (amount: number): string =>
  new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 2,
  }).format(amount)

export const formatDate = (date: string | Date): string =>
  dayjs(date).format('DD MMM YYYY')

export const formatDateTime = (date: string | Date): string =>
  dayjs(date).format('DD MMM YYYY, HH:mm')

export const formatQuantity = (qty: number): string =>
  Number(qty.toFixed(2)).toString()