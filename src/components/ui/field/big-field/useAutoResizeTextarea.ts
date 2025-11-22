'use client'

import { useEffect } from 'react'

export const useAutoResizeTextarea = (
	ref: React.RefObject<HTMLTextAreaElement>,
	value: string | undefined
) => {
	useEffect(() => {
		const textarea = ref.current
		if (!textarea) return

		const resize = () => {
			textarea.style.height = 'auto'
			const minHeight = 40
			const computedHeight = Math.max(textarea.scrollHeight, minHeight)
			textarea.style.height = Math.min(computedHeight, 200) + 'px'
			textarea.style.overflowY = computedHeight > 200 ? 'auto' : 'hidden'
		}

		resize()
		textarea.addEventListener('input', resize)
		return () => textarea.removeEventListener('input', resize)
	}, [ref, value])
}
