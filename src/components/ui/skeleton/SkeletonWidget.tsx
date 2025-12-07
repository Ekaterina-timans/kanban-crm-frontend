import { Skeleton } from './skeleton'
import { cn } from '@/lib/utils'

type SkeletonWidgetProps = {
	type: 'stats-grid' | 'chart-line' | 'chart-pie' | 'card'
	blocks?: number
	className?: string
}

export function SkeletonWidget({
	type,
	blocks = 4,
	className
}: SkeletonWidgetProps) {
	return (
		<div
			className={cn(
				'bg-white border rounded-lg p-4 shadow-sm space-y-4',
				className
			)}
		>
			<div className='flex items-center justify-between'>
				<Skeleton className='h-6 w-40' />
				<Skeleton className='h-8 w-28 rounded-md' />
			</div>

			{type === 'stats-grid' && (
				<div className='grid grid-cols-2 gap-4'>
					{Array.from({ length: blocks }).map((_, i) => (
						<div
							key={i}
							className='p-3 bg-gray-50 rounded-lg space-y-2'
						>
							<Skeleton className='h-4 w-20' />
							<Skeleton className='h-7 w-16' />
						</div>
					))}
				</div>
			)}

			{type === 'chart-line' && <Skeleton className='h-56 w-full rounded-md' />}

			{type === 'chart-pie' && (
				<div className='flex justify-center py-6'>
					<Skeleton className='h-40 w-40 rounded-full' />
				</div>
			)}

			{type === 'card' && (
				<div className='space-y-3'>
					<Skeleton className='h-4 w-1/2' />
					<Skeleton className='h-4 w-2/3' />
					<Skeleton className='h-4 w-1/3' />
				</div>
			)}
		</div>
	)
}
