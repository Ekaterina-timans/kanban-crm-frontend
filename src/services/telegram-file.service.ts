import { axiosRequest } from '@/api/interceptors'

export class TelegramFileService {
	async fetchBlob(url: string) {
		// url ожидаем типа "/threads/{threadId}/telegram-file?file_id=..."
		const res = await axiosRequest.get(url, { responseType: 'blob' })
		return res
	}

	async openInNewTab(url: string) {
		const res = await this.fetchBlob(url)
		const blobUrl = URL.createObjectURL(res.data)
		window.open(blobUrl, '_blank', 'noopener')
		// revoke можно чуть позже, чтобы вкладка успела открыть
		setTimeout(() => URL.revokeObjectURL(blobUrl), 60_000)
	}

	async download(url: string, filename: string) {
		const res = await this.fetchBlob(url)
		const blobUrl = URL.createObjectURL(res.data)
		const a = document.createElement('a')
		a.href = blobUrl
		a.download = filename
		document.body.appendChild(a)
		a.click()
		a.remove()
		URL.revokeObjectURL(blobUrl)
	}
}

export const telegramFileService = new TelegramFileService()
