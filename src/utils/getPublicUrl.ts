const API_URL = process.env.NEXT_PUBLIC_API_BASE

export const getPublicUrl = (path?: string | null): string | null => {
	if (!path) return null

	// если Laravel уже вернул абсолютный URL — просто возвращаем
	if (path.startsWith('http')) return path

	// если начинается с /storage — добавляем базовый URL
	if (path.startsWith('/storage')) return `${API_URL}${path}`

	// если почему-то public/... — конвертируем в storage
	if (path.startsWith('public/'))
		return `${API_URL}/storage/${path.replace(/^public\//, '')}`

	return path
}
