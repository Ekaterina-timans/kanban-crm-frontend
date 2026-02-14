import { Progress } from '@/components/ui/progress/progress'
import { SkeletonWidget } from '@/components/ui/skeleton/SkeletonWidget'

import { useWidgetStatistics } from '@/hooks/statistics/useWidgetStatistics'

export function ChecklistProgressCard() {
	const { data: stats, isLoading } = useWidgetStatistics('checklist', {
		period: 'year'
	})

	if (isLoading || !stats) {
		return <SkeletonWidget type='card' />
	}

	const { total, done, progress_percent } = stats

	return (
		<div className='bg-card text-card-foreground border border-border rounded-lg p-4 shadow-sm'>
			<h3 className='text-lg font-semibold text-primary mb-3'>
				Прогресс по чек-листам
			</h3>

			<div className='flex items-end gap-3'>
				<div className='text-4xl font-bold text-green-600'>
					{progress_percent}%
				</div>
				<div className='text-sm text-muted-foreground'>выполнено</div>
			</div>

			<div className='mt-4'>
				<Progress
					value={progress_percent}
					indicatorColor='bg-green-500'
				/>
			</div>

			<p className='text-sm text-muted-foreground mt-3'>
				Всего в чек-листах <b>{total}</b> пунктов, из них выполнено{' '}
				<b>{done}</b>.
			</p>
		</div>
	)
}
