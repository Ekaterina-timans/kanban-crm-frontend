import { SkeletonWidget } from '@/components/ui/skeleton/SkeletonWidget'

import { useAdminUsersTotal } from '@/hooks/admin/useAdminStatistics'

export function AdminUsersTotalCard() {
	const { data, isLoading } = useAdminUsersTotal()

	return (
		<div className='bg-white border rounded-lg p-4 shadow-sm h-full flex flex-col'>
			<div className='mb-3'>
				<h3 className='text-lg font-semibold text-blue-600'>
					Всего пользователей
				</h3>
				<p className='text-xs text-gray-500'>Общее количество в системе</p>
			</div>

			{isLoading ? (
				<SkeletonWidget type='card' />
			) : (
				<div className='rounded-md border p-3'>
					<div className='text-xs text-muted-foreground'>Пользователей</div>
					<div className='text-3xl font-semibold'>{data?.total ?? 0}</div>
				</div>
			)}
		</div>
	)
}
