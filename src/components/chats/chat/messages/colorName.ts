const NAME_COLORS = [
	'#2563EB', // primary-ish blue
	'#16A34A', // green
	'#F59E0B', // amber
	'#9333EA', // violet
	'#DB2777', // pink
	'#0EA5E9', // sky
	'#14B8A6', // teal
	'#F97316', // orange
	'#DC2626', // red (мягче)
	'#4F46E5' // indigo
]

export function colorForId(id: string | number | undefined) {
	if (id == null) return NAME_COLORS[0]
	const s = String(id)
	let h = 0
	for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0
	return NAME_COLORS[h % NAME_COLORS.length]
}
