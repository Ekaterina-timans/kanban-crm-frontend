'use client'

import {
	AlertTriangle,
	Check,
	Download,
	ExternalLink,
	FileText,
	Image as ImageIcon,
	Loader2,
	Mic,
	Sticker,
	Video
} from 'lucide-react'
import { useMemo } from 'react'

import { Button } from '@/components/ui/button/Button'

import { ITgMessage } from '@/types/telegram-chat.types'

import type { TgAttachment } from '../tgMessage.types'
import {
	buildAttachmentMeta,
	buildAttachmentName,
	extractTelegramAttachments,
	getDeliveryMeta
} from '../tgMessage.utils'

import { cn } from '@/lib/utils'
import { telegramChatService } from '@/services/telegram-chat.service'
import { telegramFileService } from '@/services/telegram-file.service'

function kindIcon(kind: TgAttachment['kind']) {
	switch (kind) {
		case 'photo':
			return ImageIcon
		case 'video':
			return Video
		case 'voice':
			return Mic
		case 'sticker':
			return Sticker
		case 'document':
			return FileText
		default:
			return FileText
	}
}

function StatusPill({
	status,
	error
}: {
	status: 'queued' | 'sent' | 'failed' | 'unknown'
	error?: string
}) {
	if (status === 'queued') {
		return (
			<span className='inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] bg-black/10'>
				<Loader2 className='h-3 w-3 animate-spin' />
				Отправляется
			</span>
		)
	}

	if (status === 'failed') {
		return (
			<span
				className='inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] bg-red-500/15 text-red-600'
				title={error}
			>
				<AlertTriangle className='h-3 w-3' />
				Ошибка
			</span>
		)
	}

	if (status === 'sent') {
		return (
			<span className='inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] bg-emerald-500/15 text-emerald-700'>
				<Check className='h-3 w-3' />
				Отправлено
			</span>
		)
	}

	return null
}

export function TgMessageBubble({
	threadId,
	message: m,
	mine,
	time
}: {
	threadId: string | number
	message: ITgMessage
	mine: boolean
	time: string
}) {
	const attachments = useMemo(
		() => extractTelegramAttachments((m as any).payload),
		[(m as any).payload]
	)

	const delivery = useMemo(() => getDeliveryMeta(m as any), [m])

	const canUseFileActions =
		delivery.status !== 'queued' && delivery.status !== 'failed'

	const openFile = async (fileId: string) => {
		const url = telegramChatService.telegramFileUrl(threadId, fileId)
		await telegramFileService.openInNewTab(url)
	}

	const downloadFile = async (fileId: string, filename: string) => {
		const url = telegramChatService.telegramFileUrl(threadId, fileId, {
			download: true
		})
		await telegramFileService.download(url, filename || 'file')
	}

	return (
		<div
			className={cn(
				'relative max-w-xs rounded-xl px-3 py-2 text-sm shadow-sm',
				mine
					? 'bg-primary text-primary-foreground'
					: 'bg-muted text-foreground border border-border'
			)}
		>
			{/* Вложения */}
			{attachments.length > 0 && (
				<div
					className={cn(
						'mb-2 flex flex-col gap-2',
						mine ? 'items-end' : 'items-start'
					)}
				>
					{attachments.map((a, idx) => {
						const Icon = kindIcon(a.kind)

						const tileCls = cn(
							'w-full max-w-[340px] rounded-xl px-3 py-2 text-xs',
							mine
								? 'bg-primary-foreground/10 text-primary-foreground'
								: 'bg-background/60 text-foreground border border-border'
						)

						const name = buildAttachmentName(a)
						const meta = buildAttachmentMeta(a)
						const fileId = a.file_id

						const disableActions =
							!fileId || !canUseFileActions || delivery.status === 'queued'

						return (
							<div
								key={`${a.kind}-${idx}`}
								className={tileCls}
							>
								<div className='flex items-start gap-2'>
									<div
										className={cn(
											'flex h-9 w-9 shrink-0 items-center justify-center rounded-xl',
											mine ? 'bg-primary-foreground/15' : 'bg-slate-200'
										)}
									>
										<Icon
											className={cn(
												'h-4 w-4',
												mine ? 'text-primary-foreground' : 'text-slate-700'
											)}
										/>
									</div>

									<div className='min-w-0 flex-1'>
										<div className='flex items-center gap-2'>
											<span className='min-w-0 flex-1 truncate font-medium'>
												{name}
											</span>
											<StatusPill
												status={delivery.status}
												error={delivery.error}
											/>
										</div>

										{meta ? (
											<div
												className={cn(
													'mt-0.5 text-[11px]',
													mine
														? 'text-primary-foreground/70'
														: 'text-muted-foreground'
												)}
											>
												{meta}
											</div>
										) : null}

										{delivery.status === 'failed' && delivery.error ? (
											<div
												className={cn(
													'mt-1 text-[11px]',
													mine ? 'text-primary-foreground/80' : 'text-red-600'
												)}
											>
												{delivery.error}
											</div>
										) : null}
									</div>

									<div className='flex gap-1'>
										<Button
											variant='secondary'
											size='icon'
											title={
												disableActions
													? delivery.status === 'queued'
														? 'Файл ещё отправляется'
														: 'Недоступно'
													: 'Открыть'
											}
											disabled={disableActions}
											onClick={async e => {
												e.stopPropagation()
												if (!fileId) return
												await openFile(fileId)
											}}
											Icon={ExternalLink}
										/>
										<Button
											variant='secondary'
											size='icon'
											title={
												disableActions
													? delivery.status === 'queued'
														? 'Файл ещё отправляется'
														: 'Недоступно'
													: 'Скачать'
											}
											disabled={disableActions}
											onClick={async e => {
												e.stopPropagation()
												if (!fileId) return
												await downloadFile(fileId, name)
											}}
											Icon={Download}
										/>
									</div>
								</div>
							</div>
						)
					})}
				</div>
			)}

			{/* Текст (caption/message text) */}
			{(m as any).text ? (
				<div className='whitespace-pre-line break-words'>{(m as any).text}</div>
			) : (
				!attachments.length && <div className='opacity-80'>—</div>
			)}

			{/* Время */}
			<span
				className={cn(
					'mt-1 block text-[11px]',
					mine
						? 'text-primary-foreground/70 text-right'
						: 'text-muted-foreground'
				)}
			>
				{time}
			</span>
		</div>
	)
}
