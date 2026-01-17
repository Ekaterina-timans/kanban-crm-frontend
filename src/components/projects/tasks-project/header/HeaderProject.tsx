'use client'

import { format } from 'date-fns'
import {
	CircleHelp,
	Search,
	Settings,
	SlidersHorizontal,
	X
} from 'lucide-react'
import { useMemo } from 'react'

import { Button } from '@/components/ui/button/Button'
import { CalendarComponent } from '@/components/ui/calendar/CalendarComponent'
import Field from '@/components/ui/field/Field'
import { SelectComponent } from '@/components/ui/select/SelectComponent'
import { Tooltip } from '@/components/ui/tooltip/Tooltip'

import { formatDateForCard } from '@/utils/date-utils'

import { IHeading, countActiveFilters } from './task-filters-ui.types'

export function HeaderProject({
	name,
	description,
	onSettingsClick,
	canOpenSettings = false,

	isFiltersOpen,
	onToggleFilters,
	filters,
	appliedFilters,
	onChangeFilters,
	onApplyFilters,
	onResetFilters,

	assigneeOptions = [],
	statusOptions = [],
	priorityOptions = []
}: IHeading) {
	const ANY = '__any__'
	const activeCount = useMemo(
		() => countActiveFilters(appliedFilters),
		[appliedFilters]
	)

	const sortOptions = [
		{ value: 'created_at', label: 'По дате создания' },
		{ value: 'due_date', label: 'По сроку' }
	]

	const orderOptions = [
		{ value: 'desc', label: 'Сначала новые' },
		{ value: 'asc', label: 'Сначала старые' }
	]

	const withAny = (opts: any[], anyLabel: string) => [
		{ value: ANY, label: anyLabel },
		...opts
	]

	// ЕДИНЫЙ стиль для иконок-кнопок (как в твоём UI)
	const iconBtn =
		'h-10 w-10 rounded-xl flex items-center justify-center ' +
		'text-muted-foreground hover:text-foreground ' +
		'hover:bg-muted/60 transition ' +
		'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring'

	return (
		<>
			{/* Шапка: без “таблетки”, просто строка как в приложении */}
			<div className='flex items-center justify-between px-5 pt-4'>
				<div className='flex items-start gap-3 min-w-0'>
					<h1 className='text-3xl font-medium text-foreground truncate'>
						{name}
					</h1>

					{description && (
						<Tooltip text={description}>
							<span className='inline-flex'>
								<CircleHelp
									size={16}
									className='text-muted-foreground hover:text-foreground transition'
								/>
							</span>
						</Tooltip>
					)}
				</div>

				<div className='flex items-center gap-2 shrink-0'>
					<button
						type='button'
						onClick={onToggleFilters}
						className={`relative ${iconBtn}`}
					>
						<Tooltip
							text={isFiltersOpen ? 'Скрыть фильтры' : 'Показать фильтры'}
						>
							<SlidersHorizontal size={25} />
						</Tooltip>

						{activeCount > 0 && (
							<span className='absolute -top-1 -right-1 min-w-5 h-5 px-1 rounded-full bg-primary text-primary-foreground text-[11px] flex items-center justify-center shadow-sm'>
								{activeCount}
							</span>
						)}
					</button>

					{canOpenSettings && (
						<button
							type='button'
							onClick={onSettingsClick}
							className={iconBtn}
						>
							<Tooltip text='Настройки'>
								<Settings size={25} />
							</Tooltip>
						</button>
					)}
				</div>
			</div>

			{/* Разделитель как в UI */}
			<div className='h-px bg-foreground/10 dark:bg-foreground/15 w-full mt-3' />

			{/* Фильтры: аккуратная карточка под шапкой */}
			{isFiltersOpen && (
				<div className='mx-5 mt-3 mb-1 px-5 py-4 rounded-2xl bg-card border border-border shadow-sm'>
					<div className='grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4'>
						<Field
							placeholder='Поиск...'
							label='Поиск по названию или описанию задачи'
							leftIcon={Search}
							value={filters.task_q}
							onChange={e => onChangeFilters({ task_q: e.target.value })}
						/>

						<div>
							<label className='block text-sm text-muted-foreground mb-1'>
								Срок
							</label>

							<CalendarComponent
								mode='range'
								placeholder='Выберите период'
								valueRange={{
									from: filters.due_from
										? new Date(`${filters.due_from}T00:00:00`)
										: null,
									to: filters.due_to
										? new Date(`${filters.due_to}T00:00:00`)
										: null
								}}
								onRangeChange={range => {
									onChangeFilters({
										due_from: range?.from
											? format(range.from, 'yyyy-MM-dd')
											: '',
										due_to: range?.to ? format(range.to, 'yyyy-MM-dd') : ''
									})
								}}
								clearable
							/>
						</div>

						<div>
							<label className='block text-sm text-muted-foreground mb-1'>
								Ответственный
							</label>
							<SelectComponent
								options={withAny(assigneeOptions, 'Любой')}
								placeholder='Выберите...'
								selectedValue={filters.assignee_id}
								onChange={value => onChangeFilters({ assignee_id: value })}
							/>
						</div>

						<div>
							<label className='block text-sm text-muted-foreground mb-1'>
								Статус
							</label>
							<SelectComponent
								options={withAny(statusOptions, 'Любой')}
								placeholder='Выберите...'
								selectedValue={filters.status_id}
								onChange={value => onChangeFilters({ status_id: value })}
							/>
						</div>

						<div>
							<label className='block text-sm text-muted-foreground mb-1'>
								Приоритет
							</label>
							<SelectComponent
								options={withAny(priorityOptions, 'Любой')}
								placeholder='Выберите...'
								selectedValue={filters.priority_id}
								onChange={value => onChangeFilters({ priority_id: value })}
							/>
						</div>

						<div>
							<label className='block text-sm text-muted-foreground mb-1'>
								Сортировка
							</label>
							<SelectComponent
								options={sortOptions}
								selectedValue={filters.task_sort}
								onChange={value => onChangeFilters({ task_sort: value as any })}
							/>
						</div>

						<div>
							<label className='block text-sm text-muted-foreground mb-1'>
								Порядок
							</label>
							<SelectComponent
								options={orderOptions}
								selectedValue={filters.task_order}
								onChange={value =>
									onChangeFilters({ task_order: value as any })
								}
							/>
						</div>

						<div className='flex items-end gap-3'>
							<Button
								type='button'
								variant='secondary'
								onClick={onResetFilters}
							>
								Сбросить
							</Button>
							<Button
								variant='default'
								onClick={onApplyFilters}
							>
								Применить
							</Button>
						</div>
					</div>
				</div>
			)}
		</>
	)
}
