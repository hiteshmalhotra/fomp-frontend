/**
 * Minimal CSV export — quotes fields, prefixes BOM for Excel,
 * triggers a browser download.
 */
export const downloadCsv = (
  filename: string,
  headers: string[],
  rows: (string | number | null | undefined)[][]
) => {
  const escape = (value: string | number | null | undefined): string => {
    const s = value == null ? '' : String(value)
    return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s
  }

  const csv = [headers, ...rows]
    .map((row) => row.map(escape).join(','))
    .join('\n')

  const blob = new Blob(["\uFEFF" + csv], {
    type: 'text/csv;charset=utf-8;',
  })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  link.click()
  URL.revokeObjectURL(url)
}
