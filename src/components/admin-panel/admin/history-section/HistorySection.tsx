'use client'

import { useState } from 'react'

import { SelectComponent } from '@/components/ui/select/SelectComponent'

import { useActivityLogs } from '@/hooks/activity-logs/useActivityLogs'

import { dateSeparatorLabel } from '@/utils/date-utils'

import { HistoryItem } from './HistoryItem'

const typeOptions = [
	{ value: 'all', label: 'Все действия' },
	{ value: 'space', label: 'Пространства' },
	{ value: 'task', label: 'Задачи' },
	{ value: 'column', label: 'Колонки' },
	{ value: 'participants', label: 'Участники' }
]

const actionOptions = [
	{ value: 'all', label: 'Все' },
	{ value: 'created', label: 'Создание' },
	{ value: 'updated', label: 'Изменение' },
	{ value: 'deleted', label: 'Удаление' },
	{ value: 'invited', label: 'Приглашение' }
]

export function HistorySection() {
	const [type, setType] = useState('all')
	const [action, setAction] = useState('all')

	const { data: logs, isLoading } = useActivityLogs({
		type,
		action: action !== 'all' ? action : undefined
	})

	/** Группировка по дате */
	const grouped = logs?.reduce((acc: Record<string, any[]>, log: any) => {
		const key = dateSeparatorLabel(log.created_at)
		acc[key] = acc[key] ? [...acc[key], log] : [log]
		return acc
	}, {})

	return (
		<div className='space-y-6'>
			<h3 className='text-xl font-semibold text-blue-600'>История действий</h3>

			<div className='bg-white border border-gray-200 rounded-xl p-4 shadow-sm'>
				{/* Фильтры */}
				<div className='grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6'>
					<SelectComponent
						selectedValue={type}
						options={typeOptions}
						onChange={v => setType(v)}
						placeholder='Тип действия'
					/>

					<SelectComponent
						selectedValue={action}
						options={actionOptions}
						onChange={v => setAction(v)}
						placeholder='Действие'
					/>
				</div>

				{/* Контент */}
				{isLoading && <p>Загрузка...</p>}

				{!isLoading && logs?.length === 0 && (
					<p className='text-gray-500'>Пока нет действий</p>
				)}

				{!isLoading && grouped && (
					<div className='space-y-6'>
						{Object.keys(grouped).map(date => (
							<div key={date}>
								<p className='text-sm text-gray-500 mb-2 font-medium'>{date}</p>

								<div className='space-y-3'>
									{grouped[date].map((item: any) => (
										<HistoryItem
											key={item.id}
											item={item}
										/>
									))}
								</div>
							</div>
						))}
					</div>
				)}
			</div>
		</div>
	)
}
