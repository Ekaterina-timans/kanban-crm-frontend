'use client'

import { AdminGroupsActivityCard } from '@/components/admin-statistics/AdminGroupsActivityCard'
import { AdminGroupsTotalCard } from '@/components/admin-statistics/AdminGroupsTotalCard'
import { AdminInactiveGroupsCard } from '@/components/admin-statistics/AdminInactiveGroupsCard'
import { AdminUsersBlockedCard } from '@/components/admin-statistics/AdminUsersBlockedCard'
import { AdminUsersTotalCard } from '@/components/admin-statistics/AdminUsersTotalCard'

export default function AdminStatisticsPage() {
	return (
		<div className='space-y-6'>
			<h1 className='text-2xl font-semibold'>Статистика</h1>

			<div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
				{/* 1. Всего пользователей */}
				<AdminUsersTotalCard />

				{/* 2. Заблокированные пользователи */}
				<AdminUsersBlockedCard />

				{/* 3. Всего групп */}
				<AdminGroupsTotalCard />

				{/* 4. Активные / пассивные группы */}
				<AdminGroupsActivityCard />

				{/* 5. Список пассивных групп */}
				<AdminInactiveGroupsCard />
			</div>
		</div>
	)
}
