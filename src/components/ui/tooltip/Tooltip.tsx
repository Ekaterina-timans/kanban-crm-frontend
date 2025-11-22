'use client'

import { ReactNode, useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'

interface TooltipProps {
	text?: string
	content?: ReactNode
	children: ReactNode
	offset?: number
}

export const Tooltip = ({
	text,
	content,
	children,
	offset = 25
}: TooltipProps) => {
	const [visible, setVisible] = useState(false)
	const [coords, setCoords] = useState({ top: 0, left: 0, width: 0 })
	const ref = useRef<HTMLDivElement>(null)

	useEffect(() => {
		if (!visible || !ref.current) return
		const rect = ref.current.getBoundingClientRect()
		setCoords({
			top: rect.top + window.scrollY - 8,
			left: rect.left + rect.width / 2,
			width: rect.width
		})
	}, [visible])

	return (
		<>
			<div
				ref={ref}
				className='inline-block max-w-full truncate align-middle'
				onMouseEnter={() => setVisible(true)}
				onMouseLeave={() => setVisible(false)}
			>
				{children}
			</div>

			{visible &&
				createPortal(
					<div
						className='fixed z-[9999] bg-gray-800 text-white text-xs rounded px-2 py-1 shadow-md transition-opacity duration-100 pointer-events-none'
						style={{
							top: coords.top - offset,
							left: coords.left,
							transform: 'translateX(-50%)',
							maxWidth: Math.max(coords.width, 240),
							whiteSpace: 'normal',
							wordBreak: 'break-word'
						}}
					>
						{content || text}
					</div>,
					document.body
				)}
		</>
	)
}
