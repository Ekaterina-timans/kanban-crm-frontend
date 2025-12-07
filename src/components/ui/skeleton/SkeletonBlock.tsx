import { Skeleton } from './skeleton'
import { cn } from '@/lib/utils'

type SkeletonBlockProps = {
	lines?: number
	className?: string
	lineClassName?: string
}

export function SkeletonBlock({
	lines = 1,
	className,
	lineClassName
}: SkeletonBlockProps) {
	return (
		<div className={cn('space-y-2', className)}>
			{Array.from({ length: lines }).map((_, i) => (
				<Skeleton
					key={i}
					className={cn('h-4 w-full', lineClassName)}
				/>
			))}
		</div>
	)
}
