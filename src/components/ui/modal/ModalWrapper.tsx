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
			className='fixed inset-0 z-50 flex items-center justify-center p-4'
			onMouseDown={handleBackdropClick}
			tabIndex={-1}
		>
			<div className='absolute inset-0 bg-black/40 backdrop-blur-[2px]' />

			<div
				ref={modalRef}
				onMouseDown={e => e.stopPropagation()}
				className={[
					'relative',
					className ? '' : 'w-full max-w-md',
					'bg-card text-card-foreground',
					'rounded-2xl border border-border',
					'shadow-xl',
					'p-4',
					'animate-in fade-in-0 zoom-in-95',
					className || ''
				].join(' ')}
			>
				{children}
			</div>
		</div>
	)
}
