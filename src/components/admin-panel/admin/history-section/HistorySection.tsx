'use client'

import dayjs from 'dayjs'
import { useMemo, useState } from 'react'

import { CalendarComponent } from '@/components/ui/calendar/CalendarComponent'
import {
	Pagination,
	PaginationContent,
	PaginationItem,
	PaginationLink,
	PaginationNext,
	PaginationPrevious
} from '@/components/ui/pagination/pagination'
import { ScrollArea } from '@/components/ui/scroll/scroll-area'
import { SelectComponent } from '@/components/ui/select/SelectComponent'

import { useAuth } from '@/providers/AuthProvider'

import { useTimezoneStore } from '@/store/useTimezoneStore'

import { useActivityLogs } from '@/hooks/activity-logs/useActivityLogs'
import { useGroupMembers } from '@/hooks/group/useGroupMembers'

import { dateSeparatorLabel } from '@/utils/date-utils'

import { HistoryItem } from './HistoryItem'
import { ACTION_OPTIONS, AREA_OPTIONS } from './constants'

export function HistorySection() {
	const { currentGroupId } = useAuth()
	const [page, setPage] = useState(1)
	const limit = 10
	const [area, setArea] = useState('all')
	const [action, setAction] = useState('all')
	const [userId, setUserId] = useState<string>('all')
	const [date, setDate] = useState<string | undefined>(undefined)

	const tz = useTimezoneStore.getState().timezone
	const { members } = useGroupMembers(currentGroupId!, '', true)

	const userOptions = useMemo(
		() => [
			{ value: 'all', label: 'Все' },
			...members
				.filter(m => m.pivot.role !== 'admin')
				.map(m => ({
					value: String(m.id),
					label: m.name || m.email
				}))
		],
		[members]
	)

	const { data, isLoading } = useActivityLogs({
		type: area !== 'all' ? area : undefined,
		action_group: action !== 'all' ? action : undefined,
		userId: userId !== 'all' ? userId : undefined,
		date,
		page,
		limit
	})

	const logs = data?.data || []
	const total = data?.total || 0
	const totalPages = Math.ceil(total / limit)

	const grouped = useMemo(() => {
		const groups: Record<string, any[]> = {}
		logs.forEach(item => {
			const label = dateSeparatorLabel(item.created_at)
			if (!groups[label]) groups[label] = []
			groups[label].push(item)
		})
		return groups
	}, [logs])

	const handleDateSelect = (d: Date) => {
		if (!d) return
		const formatted = dayjs(d).tz(tz).format('YYYY-MM-DD')
		setDate(formatted)
	}

	return (
		<ScrollArea className='h-full'>
			<div className='space-y-6 p-0 pr-2'>
				<h3 className='text-xl font-semibold text-primary'>История действий</h3>

				<div className='bg-card text-card-foreground border border-border rounded-xl p-4 shadow-sm'>
					<div className='grid grid-cols-1 sm:grid-cols-4 gap-4 mb-6'>
						<SelectComponent
							selectedValue={area}
							options={AREA_OPTIONS}
							onChange={setArea}
							placeholder='Область'
						/>

						<SelectComponent
							selectedValue={action}
							options={ACTION_OPTIONS}
							onChange={setAction}
							placeholder='Действие'
						/>

						<SelectComponent
							selectedValue={userId}
							options={userOptions}
							onChange={setUserId}
							placeholder='Пользователь'
						/>

						<CalendarComponent
							placeholder='Дата'
							onDateChange={handleDateSelect}
						/>
					</div>

					{isLoading && (
						<p className='text-sm text-muted-foreground'>Загрузка...</p>
					)}

					{!isLoading && Object.keys(grouped).length === 0 && (
						<p className='text-muted-foreground'>Пока нет действий</p>
					)}

					{!isLoading && Object.keys(grouped).length > 0 && (
						<div className='space-y-6'>
							{Object.keys(grouped).map(label => (
								<div key={label}>
									<p className='text-sm text-muted-foreground mb-2 font-medium'>
										{label}
									</p>

									<div className='space-y-3'>
										{grouped[label].map(item => (
											<HistoryItem
												key={item.id}
												item={item}
												members={members}
											/>
										))}
									</div>
								</div>
							))}
						</div>
					)}
				</div>

				<Pagination className='mt-6'>
					<PaginationContent>
						<PaginationItem>
							<PaginationPrevious
								onClick={() => page > 1 && setPage(page - 1)}
							/>
						</PaginationItem>

						{Array.from({ length: totalPages }).map((_, i) => (
							<PaginationItem key={i}>
								<PaginationLink
									isActive={page === i + 1}
									onClick={() => setPage(i + 1)}
								>
									{i + 1}
								</PaginationLink>
							</PaginationItem>
						))}

						<PaginationItem>
							<PaginationNext
								onClick={() => page < totalPages && setPage(page + 1)}
							/>
						</PaginationItem>
					</PaginationContent>
				</Pagination>
			</div>
		</ScrollArea>
	)
}
