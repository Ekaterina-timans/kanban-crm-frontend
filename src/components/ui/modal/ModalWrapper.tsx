import { useEffect, useRef } from 'react'

interface ModalWrapperProps {
	isOpen: boolean
	onClose: () => void
	children: React.ReactNode
	className?: string
}

export function ModalWrapper({
	isOpen,
	onClose,
	children,
	className
}: ModalWrapperProps) {
	const modalRef = useRef<HTMLDivElement>(null)

	useEffect(() => {
		if (isOpen) {
			document.body.style.overflow = 'hidden'
			document.body.style.paddingRight = '0px'
		} else {
			document.body.style.overflow = ''
			document.body.style.paddingRight = ''
		}

		return () => {
			document.body.style.overflow = ''
			document.body.style.paddingRight = ''
		}
	}, [isOpen])

	useEffect(() => {
		if (!isOpen) return
		function handleKeyDown(e: KeyboardEvent) {
			if (e.key === 'Escape') onClose()
		}
		window.addEventListener('keydown', handleKeyDown)
		return () => window.removeEventListener('keydown', handleKeyDown)
	}, [isOpen, onClose])

	function handleBackdropClick(
		e: React.MouseEvent<HTMLDivElement, MouseEvent>
	) {
		if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
			onClose()
		}
	}

	if (!isOpen) return null

	return (
		<div
			className='fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-20'
			onMouseDown={handleBackdropClick}
			tabIndex={-1}
		>
			<div
				className={`relative bg-white rounded-lg p-6 shadow-lg max-w-full ${className || ''}`}
				ref={modalRef}
				onMouseDown={e => e.stopPropagation()}
			>
				{children}
			</div>
		</div>
	)
}
