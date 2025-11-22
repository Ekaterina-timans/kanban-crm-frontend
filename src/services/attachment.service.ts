import { axiosRequest } from "@/api/interceptors"
import { IAttachment } from "@/types/message.types"

class AttachmentService {
    /** Скачать вложение (общий метод для чатов, комментариев и т.д.) */
    async downloadAttachment(att: IAttachment) {
         // 1) берем API-роут из JSON, он должен быть типа "/api/attachments/{id}/download" или "/attachments/{id}/download"
        let url = att.download_url ?? ''
        // иногда из-за багов мог прийти просто "/api" — подстрахуемся
        if (!url || url === '/api') {
            url = `/attachments/${att.id}/download` // относительный к baseURL
        }
        // если пришёл абсолютный (на всякий)
        const isAbsolute = /^https?:\/\//i.test(url)
        if (!isAbsolute && !url.startsWith('/')) url = `/${url}`
        // 2) скачаем blob через axiosRequest (baseURL = http://127.0.0.1:8000/api)
        const res = await axiosRequest.get(url, { responseType: 'blob' })
        // 3) имя файла из заголовка (если есть) или из модели
        const cd = res.headers?.['content-disposition'] as string | undefined
        let filename = att.original_name || 'file'
        const m = cd?.match(/filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/i)
        if (m?.[1]) filename = decodeURIComponent(m[1].replace(/^["']|["']$/g, ''))
        // 4) скачать без перехода
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

export const attachmentService = new AttachmentService()