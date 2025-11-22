'use client'

import { AtSign } from 'lucide-react'
import { useState } from 'react'

export function MentionButton({
	iconSize,
	textareaRef,
	mentionMembers,
	onMentionSelect,
	value,
	onChange,
	setInternalValue
}: any) {
	const [showMentionList, setShowMentionList] = useState(false)

	const insertMention = (user: any) => {
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
		const mentionText = '@' + (user.name || user.email) + ' '
		const newValue =
			current.substring(0, start) + mentionText + current.substring(end)

		if (onChange) onChange({ target: { value: newValue } })
		else setInternalValue(newValue)

		setTimeout(() => {
			textarea.focus()
			textarea.setSelectionRange(
				start + mentionText.length,
				start + mentionText.length
			)
		}, 0)
		setShowMentionList(false)
		onMentionSelect?.(user)
	}

	return (
		<>
			<button
				type='button'
				onClick={() => setShowMentionList(!showMentionList)}
				className='absolute top-4 right-8 flex items-start pr-3 text-slate-500 hover:text-slate-700'
				title='Упомянуть пользователя'
			>
				<AtSign size={iconSize} />
			</button>

			{showMentionList && (
				<div
					className='absolute bottom-full mb-2 right-0 z-20 bg-white border rounded-md shadow-md w-48 max-h-56 overflow-y-auto'
					onMouseDown={e => {
						e.stopPropagation()
						e.preventDefault()
					}}
				>
					{mentionMembers.length === 0 ? (
						<div className='text-sm text-gray-400 p-2 text-center'>
							Нет участников
						</div>
					) : (
						mentionMembers.map((m: any) => (
							<button
								key={m.id}
								onClick={() => insertMention(m)}
								className='w-full text-left px-3 py-2 text-sm hover:bg-slate-100'
							>
								{m.name || m.email}
							</button>
						))
					)}
				</div>
			)}
		</>
	)
}
