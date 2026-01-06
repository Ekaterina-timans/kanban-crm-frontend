import { SkeletonWidget } from '@/components/ui/skeleton/SkeletonWidget'

import { useAdminUsersBlocked } from '@/hooks/admin/useAdminStatistics'

export function AdminUsersBlockedCard() {
	const { data, isLoading } = useAdminUsersBlocked()

	return (
		<div className='bg-white border rounded-lg p-4 shadow-sm h-full flex flex-col'>
			<div className='mb-3'>
				<h3 className='text-lg font-semibold text-blue-600'>
					Заблокированные пользователи
				</h3>
				<p className='text-xs text-gray-500'>
					Глобально заблокированные аккаунты
				</p>
			</div>

			{isLoading ? (
				<SkeletonWidget type='card' />
			) : (
				<div className='rounded-md border p-3'>
					<div className='text-xs text-muted-foreground'>Заблокировано</div>
					<div className='text-3xl font-semibold text-red-600'>
						{data?.blocked ?? 0}
					</div>
				</div>
			)}
		</div>
	)
}
