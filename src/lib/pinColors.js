export const PIN_PALETTE = [
  '#ff4500', // orange-red (site accent)
  '#ff2d78', // hot pink
  '#00d4ff', // electric cyan
  '#a855f7', // violet
  '#f59e0b', // amber
  '#10b981', // emerald
  '#6366f1', // indigo
  '#f97316', // orange
  '#ec4899', // pink
  '#22d3ee', // teal
  '#84cc16', // lime
  '#e879f9', // fuchsia
]

export function pinColor(id) {
  const n = parseInt((id || '').replace(/-/g, '').slice(0, 8), 16) || 0
  return PIN_PALETTE[n % PIN_PALETTE.length]
}
