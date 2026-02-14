'use client'

import { Paperclip } from 'lucide-react'
import { useEffect, useMemo, useRef, useState } from 'react'

import {
	FileChip,
	ImageThumb
} from '@/components/chats/chat/footer/AttachmentPreview'

import { Button } from '../button/Button'
import { BigField } from '../field/big-field/BigField'

type MessageBoxProps = {
	onSend: (data: {
		text?: string
		files?: File[]
		mentioned_user_ids?: Array<number | string>
	}) => Promise<void> | void
	placeholder?: string
	disabled?: boolean
	getMentionedUserIds?: (text: string) => Array<number | string>
	mentionMembers?: Array<{
		id: number | string
		name?: string | null
		email?: string | null
	}>
	showMentions?: boolean
}

export function MessageBox({
	onSend,
	placeholder,
	disabled,
	getMentionedUserIds,
	mentionMembers,
	showMentions = true
}: MessageBoxProps) {
	const [message, setMessage] = useState('')
	const [files, setFiles] = useState<File[]>([])
	const [mentionedIds, setMentionedIds] = useState<Array<number | string>>([])
	const textareaRef = useRef<HTMLTextAreaElement>(null)
	const fileInputRef = useRef<HTMLInputElement>(null)

	useEffect(() => {
		setMentionedIds([])
	}, [mentionMembers])

	const openPicker = () => fileInputRef.current?.click()

	const onFilesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (!e.target.files) return
		const picked = Array.from(e.target.files)
		const key = (f: File) => `${f.name}|${f.size}|${f.lastModified}`
		setFiles(prev => {
			const seen = new Set(prev.map(key))
			const next = [...prev]
			for (const f of picked) if (!seen.has(key(f))) next.push(f)
			return next
		})
		e.currentTarget.value = ''
	}

	const removeFile = (idx: number) =>
		setFiles(prev => prev.filter((_, i) => i !== idx))

	const previews = useMemo(
		() =>
			files.map((f, i) => {
				const [type, sub = ''] = (f.type || '').split('/')
				return {
					key: `${f.name}-${f.size}-${f.lastModified}-${i}`,
					file: f,
					url: URL.createObjectURL(f),
					isImage: type === 'image',
					subtype: sub
				}
			}),
		[files]
	)

	useEffect(
		() => () => previews.forEach(p => URL.revokeObjectURL(p.url)),
		[previews]
	)

	const canSend = (!!message.trim() || files.length > 0) && !disabled

	const handleSend = async () => {
		if (!canSend) return
		await onSend({
			text: message.trim(),
			files,
			mentioned_user_ids: getMentionedUserIds
				? getMentionedUserIds(message)
				: mentionedIds
		})
		setMessage('')
		setFiles([])
		setMentionedIds([])
	}

	function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
		if (e.key === 'Enter' && !e.shiftKey) {
			e.preventDefault()
			void handleSend()
		}
	}

	return (
		<div className='w-full'>
			<input
				ref={fileInputRef}
				type='file'
				multiple
				className='hidden'
				onChange={onFilesChange}
			/>

			{previews.length > 0 && (
				<div className='rounded-xl border bg-white p-2 shadow-sm'>
					<div className='flex max-h-24 flex-wrap gap-2 overflow-y-auto'>
						{previews.map((p, idx) =>
							p.isImage ? (
								<ImageThumb
									key={p.key}
									url={p.url}
									alt={p.file.name}
									onRemove={() => removeFile(idx)}
								/>
							) : (
								<FileChip
									key={p.key}
									name={p.file.name}
									subtype={p.subtype}
									onRemove={() => removeFile(idx)}
								/>
							)
						)}
					</div>
				</div>
			)}

			<div className='flex w-full items-start justify-between gap-4 flex-shrink-0'>
				<BigField
					ref={textareaRef}
					placeholder={placeholder || 'Написать сообщение...'}
					className='flex-grow'
					value={message}
					onChange={e => setMessage(e.target.value)}
					leftIcon={Paperclip}
					onLeftIconClick={openPicker}
					iconSize={23}
					showEmojiPicker={true}
					showMentions={showMentions}
					onKeyDown={handleKeyDown}
					mentionMembers={showMentions ? (mentionMembers ?? []) : []}
					onMentionSelect={
						showMentions
							? user =>
									setMentionedIds(prev => [...new Set([...prev, user.id])])
							: undefined
					}
				/>
				<Button
					className='mt-2'
					onClick={handleSend}
					disabled={!canSend}
				>
					Отправить
				</Button>
			</div>
		</div>
	)
}
