import { Download, ExternalLink } from 'lucide-react'

import { DropdownMenuItem } from '@/components/ui/dropdown/dropdown-menu'

import { IAttachment } from '@/types/message.types'

import { attachmentService } from '@/services/attachment.service'

const API_BASE = process.env.NEXT_PUBLIC_API_BASE

export function filePublicUrl(att: IAttachment) {
	// Если backend вернул прямой URL — используем его
	if ((att as any).url) return (att as any).url as string
	// Иначе строим из storage path (как в комментариях)
	const path = (att as any).path as string | undefined
	if (path) return `${API_BASE}/storage/${path.replace(/^public\//, '')}`
	return ''
}

export function AttachmentMenu({ att }: { att: IAttachment }) {
	const isImage = (att.mime ?? '').startsWith('image/')
	const openInNewTab = () => {
		const url = filePublicUrl(att)
		if (!url) return
		window.open(url, '_blank', 'noopener,noreferrer')
	}

	const download = async () => {
		try {
			await attachmentService.downloadAttachment(att)
		} catch (e) {
			console.error('download failed', e)
		}
	}

	return (
		<>
			{isImage && (
				<DropdownMenuItem
					className='cursor-pointer'
					onClick={openInNewTab}
					title={att.original_name}
				>
					<ExternalLink />
					<span className='text-sm truncate'>Открыть</span>
				</DropdownMenuItem>
			)}

			<DropdownMenuItem
				className='cursor-pointer'
				onClick={download}
				title={`Скачать ${att.original_name}`}
			>
				<Download />
				<span className='text-sm truncate'>Скачать</span>
			</DropdownMenuItem>
		</>
	)
}
