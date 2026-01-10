import { Skeleton } from '@/components/ui/skeleton/skeleton'

import { cn } from '@/lib/utils'

type KanbanSkeletonProps = {
	columns?: number
	cardsPerColumn?: number
	className?: string
}

export function KanbanSkeleton({
	columns = 4,
	cardsPerColumn = 3,
	className
}: KanbanSkeletonProps) {
	return (
		<div className={cn('flex p-6 gap-7 overflow-x-auto', className)}>
			{Array.from({ length: columns }).map((_, colIndex) => (
				<div
					key={colIndex}
					className='w-[280px] min-w-[280px] shrink-0'
				>
					<Skeleton className='h-10 w-full rounded-xl mb-4' />

					<div className='flex justify-center mb-4'>
						<Skeleton className='h-9 w-9 rounded-full' />
					</div>

					<div className='space-y-4'>
						{Array.from({ length: cardsPerColumn }).map((_, cardIndex) => (
							<div
								key={cardIndex}
								className='bg-white border rounded-xl p-4 space-y-3 shadow-sm'
							>
								<Skeleton className='h-5 w-2/3' />
								<Skeleton className='h-4 w-1/2' />

								<div className='flex gap-2'>
									<Skeleton className='h-6 w-20 rounded-full' />
									<Skeleton className='h-6 w-16 rounded-full' />
								</div>

								<div className='flex items-center justify-between pt-2'>
									<Skeleton className='h-8 w-8 rounded-full' />
									<Skeleton className='h-4 w-16' />
								</div>
							</div>
						))}
					</div>
				</div>
			))}
		</div>
	)
}
