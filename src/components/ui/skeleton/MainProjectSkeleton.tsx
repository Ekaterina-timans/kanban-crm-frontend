import { Skeleton } from '@/components/ui/skeleton/skeleton'

import { KanbanSkeleton } from './KanbanSkeleton'

export function MainProjectSkeleton() {
	return (
		<div
			style={{
				minHeight: 'calc(100vh - 80px)'
			}}
			className='h-full pl-1 flex flex-col'
		>
			<div className='px-6 py-4 space-y-3'>
				<Skeleton className='h-8 w-60' />
			</div>

			<div className='min-h-0 flex-1'>
				<KanbanSkeleton
					columns={4}
					cardsPerColumn={3}
				/>
			</div>
		</div>
	)
}
