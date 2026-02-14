export const SPACE_BACKGROUND_PALETTES = [
	{ light: '#DDEBFF', dark: '#0F1B33' },
	{ light: '#CFE3FF', dark: '#102042' },
	{ light: '#BFD7FF', dark: '#122855' },
	{ light: '#A9CBFF', dark: '#163069' },

	{ light: '#D6F5EF', dark: '#0D2A2A' },
	{ light: '#BFEFE4', dark: '#0E3431' },
	{ light: '#A6E7D7', dark: '#0F3E37' },
	{ light: '#8BDEC8', dark: '#114A3C' },

	{ light: '#FFE7C2', dark: '#3A2A10' },
	{ light: '#FFD7B3', dark: '#3A1F12' },
	{ light: '#FFE0E0', dark: '#3A171B' },
	{ light: '#FFD1DD', dark: '#351824' },

	{ light: '#EADFFF', dark: '#251638' },
	{ light: '#DCCBFF', dark: '#2A1B45' },
	{ light: '#D8E7FF', dark: '#141F3A' },
	{ light: '#E8F1FF', dark: '#0F1A2D' }
] as const

export const SPACE_BACKGROUND_COLORS_LIGHT = SPACE_BACKGROUND_PALETTES.map(
	p => p.light
) as readonly string[]

export const SPACE_BACKGROUND_COLORS_DARK = SPACE_BACKGROUND_PALETTES.map(
	p => p.dark
) as readonly string[]

// В БД храним ТОЛЬКО light-цвет
export type SpaceColor = (typeof SPACE_BACKGROUND_PALETTES)[number]['light']
export const DEFAULT_SPACE_COLOR: SpaceColor = '#DDEBFF'

// light -> dark
export const SPACE_BG_DARK_MAP: Record<string, string> = Object.fromEntries(
	SPACE_BACKGROUND_PALETTES.map(p => [p.light.toLowerCase(), p.dark])
)

// dark -> light
export const SPACE_BG_LIGHT_MAP: Record<string, string> = Object.fromEntries(
	SPACE_BACKGROUND_PALETTES.map(p => [p.dark.toLowerCase(), p.light])
)

// рендерим по теме, но ХРАНИМ light
export function resolveSpaceBgColorForTheme(
	lightColor: string | null | undefined,
	isDark: boolean
) {
	const raw = (lightColor ?? DEFAULT_SPACE_COLOR).trim()
	if (!isDark) return raw

	const key = raw.toLowerCase()
	return SPACE_BG_DARK_MAP[key] ?? raw
}

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
] as const

export type ColumnColor = (typeof COLUMN_COLORS)[number]
export const DEFAULT_COLUMN_COLOR: ColumnColor = '#EE82EE'

const NAME_MESSAGE_COLORS = [
	'#2563EB',
	'#16A34A',
	'#F59E0B',
	'#9333EA',
	'#DB2777',
	'#0EA5E9',
	'#14B8A6',
	'#F97316',
	'#DC2626',
	'#4F46E5'
] as const

export type NameMessageColor = (typeof NAME_MESSAGE_COLORS)[number]

export function colorForId(id: string | number | undefined) {
	if (id == null) return NAME_MESSAGE_COLORS[0]
	const s = String(id)
	let h = 0
	for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0
	return NAME_MESSAGE_COLORS[h % NAME_MESSAGE_COLORS.length]
}
