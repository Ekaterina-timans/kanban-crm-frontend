import Echo from 'laravel-echo'
import Pusher from 'pusher-js'

declare global {
	interface Window {
		Pusher: typeof Pusher
	}
}

type EchoPusher = Echo<'pusher'>
let echoSingleton: EchoPusher | null = null

export function getEcho(): EchoPusher {
	if (echoSingleton) return echoSingleton
	if (typeof window === 'undefined') {
		throw new Error('Echo must be used in the browser')
	}

	window.Pusher = Pusher

	const key = process.env.NEXT_PUBLIC_PUSHER_APP_KEY ?? 'app-key'
	const wsHost = process.env.NEXT_PUBLIC_PUSHER_HOST ?? '127.0.0.1'
	const wsPort = Number(process.env.NEXT_PUBLIC_PUSHER_PORT ?? '6001')
	const cluster = process.env.NEXT_PUBLIC_PUSHER_APP_CLUSTER ?? 'mt1'
	const apiBase = process.env.NEXT_PUBLIC_API_BASE ?? 'http://127.0.0.1:8000'

	const readCookie = (name: string) => {
		if (typeof document === 'undefined') return null
		const hit = document.cookie
			.split(';')
			.map(s => s.trim())
			.find(p => p.startsWith(name + '='))
		return hit ? decodeURIComponent(hit.split('=').slice(1).join('=')) : null
	}

	echoSingleton = new Echo({
		broadcaster: 'pusher',
		key,
		cluster,
		wsHost,
		wsPort,
		forceTLS: false,
		disableStats: true,
		enabledTransports: ['ws'],
		authorizer: (channel, _options) => ({
			authorize: async (socketId, callback) => {
				const url = `${apiBase}/broadcasting/auth`
				try {
					const xsrf = readCookie('XSRF-TOKEN') ?? ''
					const res = await fetch(url, {
						method: 'POST',
						credentials: 'include',
						headers: {
							'Content-Type': 'application/json',
							'X-XSRF-TOKEN': xsrf
						},
						body: JSON.stringify({
							socket_id: socketId,
							channel_name: channel.name
						})
					})
					const text = await res.text()
					if (!res.ok)
						return callback(new Error(`Auth ${res.status}: ${text}`), null)
					let data: any = {}
					try {
						data = JSON.parse(text)
					} catch {}
					return callback(null, data)
				} catch (e) {
					return callback(e as any, null)
				}
			}
		})
	}) as EchoPusher

	return echoSingleton
}
