const NAME_COLORS = [
  '#4C6FFF',
  '#12B76A',
  '#F79009',
  '#D444F1',
  '#E11D48',
  '#0EA5E9',
  '#8B5CF6',
  '#F59E0B',
  '#10B981',
  '#EF4444',
]

export function colorForId(id: string | number | undefined) {
  if (id == null) return NAME_COLORS[0]
  const s = String(id)
  let h = 0
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0
  return NAME_COLORS[h % NAME_COLORS.length]
}