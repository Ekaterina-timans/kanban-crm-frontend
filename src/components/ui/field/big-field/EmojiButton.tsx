'use client'

import EmojiPicker, { EmojiClickData } from 'emoji-picker-react'
import { Smile } from 'lucide-react'
import { useState } from 'react'

export function EmojiButton({
	iconSize,
	textareaRef,
	value,
	onChange,
	setInternalValue
}: any) {
	const [showPicker, setShowPicker] = useState(false)

	const insertEmoji = (emojiData: EmojiClickData) => {
		// Глушим следующий click, чтобы не срабатывало открытие файла
		const suppressNextClick = (e: MouseEvent) => {
			e.stopPropagation()
			e.preventDefault()
			document.removeEventListener('click', suppressNextClick, true)
		}
		document.addEventListener('click', suppressNextClick, true)
		setTimeout(
			() => document.removeEventListener('click', suppressNextClick, true),
			200
		)

		const textarea = textareaRef.current
		if (!textarea) return

		const start = textarea.selectionStart
		const end = textarea.selectionEnd
		const current = value || ''
		const newValue =
			current.substring(0, start) + emojiData.emoji + current.substring(end)

		if (onChange) onChange({ target: { value: newValue } })
		else setInternalValue(newValue)

		setTimeout(() => {
			textarea.focus()
			textarea.setSelectionRange(
				start + emojiData.emoji.length,
				start + emojiData.emoji.length
			)
		}, 0)
		setShowPicker(false)
	}

	return (
		<>
			<button
				type='button'
				onClick={() => setShowPicker(!showPicker)}
				className='absolute top-4 right-0 flex items-start pr-3 text-muted-foreground hover:text-primary transition-colors'
				title='Добавить смайлик'
			>
				<Smile size={iconSize} />
			</button>
			{showPicker && (
				<div
					className='absolute bottom-full mb-2 right-0 z-10'
					onPointerDown={e => {
						e.stopPropagation()
						e.preventDefault()
					}}
				>
					<EmojiPicker onEmojiClick={insertEmoji} />
				</div>
			)}
		</>
	)
}
