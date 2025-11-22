'use client'

import { Download, ExternalLink } from 'lucide-react'
import { useMemo } from 'react'

import { Button } from '@/components/ui/button/Button'

import type { IAttachment } from '@/types/message.types'

import { attachmentService } from '@/services/attachment.service'

export function FilesTab({
	files,
	loadingFiles
}: {
	files: IAttachment[]
	loadingFiles: boolean
}) {
	const images = useMemo(
		() => files.filter(f => (f.mime ?? '').startsWith('image/')),
		[files]
	)
	const docs = useMemo(
		() => files.filter(f => !(f.mime ?? '').startsWith('image/')),
		[files]
	)

	return (
		<>
			{loadingFiles && <div className='text-sm text-slate-500'>Загрузка…</div>}
			{!loadingFiles && files.length === 0 && (
				<div className='text-sm text-slate-500'>Файлы не найдены</div>
			)}

			{images.length > 0 && (
				<>
					<div className='text-xs text-slate-500 mb-1'>Изображения</div>
					<div className='grid grid-cols-3 gap-2'>
						{images.map(att => (
							<div
								key={att.id}
								className='relative rounded border overflow-hidden'
							>
								<img
									src={att.url ?? ''}
									alt={att.original_name}
									className='w-full h-24 object-cover'
								/>
								<div className='absolute bottom-1 right-1 flex gap-1'>
									<Button
										variant='secondary'
										size='icon'
										title='Открыть'
										onClick={() =>
											window.open(att.url ?? '#', '_blank', 'noopener')
										}
										Icon={ExternalLink}
									/>
									<Button
										variant='secondary'
										size='icon'
										title='Скачать'
										onClick={() => attachmentService.downloadAttachment(att)}
										Icon={Download}
									/>
								</div>
							</div>
						))}
					</div>
				</>
			)}

			{docs.length > 0 && (
				<>
					<div className='text-xs text-slate-500 mt-3 mb-1'>Документы</div>
					<div className='space-y-2'>
						{docs.map(att => {
							const subtype = att.mime?.split('/')[1]?.toUpperCase() ?? 'FILE'
							return (
								<div
									key={att.id}
									className='flex items-center justify-between gap-3 rounded border px-3 py-2'
									title={att.original_name}
								>
									<div className='min-w-0 flex items-center gap-2'>
										<div className='h-7 w-7 rounded-full bg-slate-200 text-[10px] font-semibold grid place-items-center'>
											{subtype}
										</div>
										<div className='truncate text-sm'>{att.original_name}</div>
									</div>
									<div className='flex gap-2'>
										<Button
											variant='outline'
											size='icon'
											title='Скачать'
											onClick={() => attachmentService.downloadAttachment(att)}
											Icon={Download}
										/>
									</div>
								</div>
							)
						})}
					</div>
				</>
			)}
		</>
	)
}
