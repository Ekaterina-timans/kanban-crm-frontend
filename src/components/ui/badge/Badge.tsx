import { ReactNode } from 'react'

import { cn } from '@/lib/utils'

interface IBadgeProps {
	text: ReactNode
	color?: 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'danger'
	size?: 'small' | 'medium' | 'large'
	className?: string
}

const Badge = ({
	text,
	color = 'default',
	size = 'medium',
	className
}: IBadgeProps) => {
	const getColorClass = () => {
		switch (color) {
			case 'primary':
				return 'bg-blue-500 text-white'
			case 'secondary':
				return 'bg-violet-500 text-black'
			case 'success':
				return 'bg-green-500 text-white'
			case 'warning':
				return 'bg-yellow-500 text-black'
			case 'danger':
				return 'bg-red-500 text-white'
			default:
				return 'bg-gray-500 text-white'
		}
	}

	const getSizeClass = () => {
		switch (size) {
			case 'small':
				return 'px-1.5 py-0.5 text-xs'
			case 'large':
				return 'px-4 py-2 text-base'
			default:
				return 'px-3 py-1 text-sm'
		}
	}

	return (
		<span
			className={cn(
				`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getSizeClass()} ${getColorClass()}`,
				className
			)}
		>
			{text}
		</span>
	)
}

export default Badge
