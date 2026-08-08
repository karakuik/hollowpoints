// WoW currency helpers — everything is stored/passed around in copper
// (the unit Blizzard's API uses), formatted as "Xg Ys Zc" for display/entry.

export function formatMoney(copper) {
  const total = Math.max(0, Math.round(copper || 0))
  const g = Math.floor(total / 10000)
  const s = Math.floor((total % 10000) / 100)
  const c = total % 100
  const parts = []
  if (g) parts.push(`${g}g`)
  if (g || s) parts.push(`${s}s`)
  parts.push(`${c}c`)
  return parts.join(' ')
}

// Accepts "12g 34s 56c" (any subset, any order) or a bare number treated as gold.
export function parseMoney(str) {
  if (!str) return 0
  const g = str.match(/(\d+(?:\.\d+)?)\s*g/i)
  const s = str.match(/(\d+(?:\.\d+)?)\s*s/i)
  const c = str.match(/(\d+(?:\.\d+)?)\s*c/i)
  if (!g && !s && !c) {
    const n = parseFloat(str)
    return Number.isFinite(n) ? Math.round(n * 10000) : 0
  }
  return Math.round(
    (g ? parseFloat(g[1]) : 0) * 10000 +
    (s ? parseFloat(s[1]) : 0) * 100 +
    (c ? parseFloat(c[1]) : 0)
  )
}
