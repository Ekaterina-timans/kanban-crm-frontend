import type { DeliveryMeta, TgAttachment } from './tgMessage.types'

export function formatBytes(bytes?: number) {
	if (!bytes || bytes <= 0) return ''
	const units = ['B', 'KB', 'MB', 'GB']
	let v = bytes
	let i = 0
	while (v >= 1024 && i < units.length - 1) {
		v /= 1024
		i++
	}
	const n = i === 0 ? Math.round(v) : Math.round(v * 10) / 10
	return `${n} ${units[i]}`
}

export function extractTelegramAttachments(payload: any): TgAttachment[] {
	if (!payload || typeof payload !== 'object') return []

	if (payload?.queued && payload?.upload) {
		const u = payload.upload
		const mime = typeof u?.mime === 'string' ? u.mime : undefined

		const kind: TgAttachment['kind'] = mime?.startsWith?.('image/')
			? 'photo'
			: 'document'

		return [
			{
				kind,
				file_id: undefined, // появится после успешной отправки в TG
				label: kind === 'photo' ? 'Фото' : 'Файл',
				file_name: u?.original_name ?? 'file',
				size: typeof u?.size === 'number' ? u.size : undefined,
				mime
			}
		]
	}

	const out: TgAttachment[] = []

	if (Array.isArray(payload.photo) && payload.photo.length) {
		const last = payload.photo[payload.photo.length - 1]
		out.push({
			kind: 'photo',
			file_id: last?.file_id,
			label: 'Фото',
			size: last?.file_size
		})
	}

	if (payload.document) {
		out.push({
			kind: 'document',
			file_id: payload.document?.file_id,
			file_name: payload.document?.file_name,
			label: 'Документ',
			size: payload.document?.file_size
		})
	}

	if (payload.video) {
		out.push({
			kind: 'video',
			file_id: payload.video?.file_id,
			file_name: payload.video?.file_name,
			label: 'Видео',
			size: payload.video?.file_size
		})
	}

	if (payload.voice) {
		out.push({
			kind: 'voice',
			file_id: payload.voice?.file_id,
			label: 'Голосовое',
			size: payload.voice?.file_size
		})
	}

	if (payload.sticker) {
		out.push({
			kind: 'sticker',
			file_id: payload.sticker?.file_id,
			emoji: payload.sticker?.emoji,
			label: payload.sticker?.emoji
				? `Стикер ${payload.sticker.emoji}`
				: 'Стикер',
			size: payload.sticker?.file_size
		})
	}

	return out
}

export function getDeliveryMeta(message: any): DeliveryMeta {
	const deliveryStatus = message?.delivery_status as
		| 'queued'
		| 'sent'
		| 'failed'
		| undefined
	const deliveryError = message?.delivery_error as string | undefined

	if (deliveryStatus) {
		return {
			status: deliveryStatus,
			error: deliveryError
		}
	}

	if (message?.payload?.queued) {
		return { status: 'queued' }
	}

	if (message?.payload?.error) {
		return { status: 'failed', error: String(message.payload.error) }
	}

	return { status: 'unknown' }
}

export function buildAttachmentName(a: TgAttachment) {
	if (
		(a.kind === 'document' || a.kind === 'video' || a.kind === 'photo') &&
		a.file_name
	) {
		return a.file_name
	}
	return a.label
}

export function buildAttachmentMeta(a: TgAttachment) {
	return formatBytes(a.size)
}
