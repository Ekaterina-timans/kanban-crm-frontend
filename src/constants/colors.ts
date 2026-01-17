export const SPACE_BACKGROUND_COLORS = [
	// Blues / Indigo (спокойные, совместимы с primary)
  '#DDEBFF',
  '#CFE3FF',
  '#BFD7FF',
  '#A9CBFF',

  // Teal / Mint (подходит вашему канбану)
  '#D6F5EF',
  '#BFEFE4',
  '#A6E7D7',
  '#8BDEC8',

  // Warm (мягкие тёплые, не кислотные)
  '#FFE7C2',
  '#FFD7B3',
  '#FFE0E0',
  '#FFD1DD',

  // Violet / Lavender (мягко, без агрессии)
  '#EADFFF',
  '#DCCBFF',
  '#D8E7FF',
  '#E8F1FF'
]

export type SpaceColor = (typeof SPACE_BACKGROUND_COLORS)[number]
export const DEFAULT_SPACE_COLOR: SpaceColor = '#DDEBFF'

export const COLUMN_COLORS = [
  '#EE82EE',
	'#FA8072',
	'#CD5C5C',
	'#9400D3',
	'#673AB7',
	'#3F51B5',
	'#008080',
	'#1E90FF',
	'#66CDAA',
	'#FFEB3B',
	'#FF8C00',
	'#9ACD32',
	'#32CD32',
	'#4CAF50',
	'#006400'
]

export type ColumnColor = (typeof COLUMN_COLORS)[number]
export const DEFAULT_COLUMN_COLOR: ColumnColor = '#EE82EE'

const NAME_MESSAGE_COLORS = [
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

export type NameMessageColor = (typeof NAME_MESSAGE_COLORS)[number]

export function colorForId(id: string | number | undefined) {
	if (id == null) return NAME_MESSAGE_COLORS[0]
	const s = String(id)
	let h = 0
	for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0
	return NAME_MESSAGE_COLORS[h % NAME_MESSAGE_COLORS.length]
}