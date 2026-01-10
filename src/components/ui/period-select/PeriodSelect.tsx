'use client'

import { ChevronDown } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'

import { formatDateForCard } from '@/utils/date-utils'

import { Button } from '../button/Button'
import { Calendar } from '../calendar/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '../calendar/popover'

import { PeriodParams, PeriodPreset } from './period'
import { cn } from '@/lib/utils'

interface PeriodSelectProps {
	value?: PeriodParams
	onChange: (value: PeriodParams) => void
}

const PRESETS = [
	{ label: 'Сегодня', value: 'today' as PeriodPreset },
	{ label: 'Неделя', value: 'week' as PeriodPreset },
	{ label: 'Месяц', value: 'month' as PeriodPreset },
	{ label: 'Квартал', value: 'quarter' as PeriodPreset },
	{ label: 'Год', value: 'year' as PeriodPreset },
	{ label: 'Диапазон', value: 'range' as PeriodPreset }
] as const

export function PeriodSelect({
	value = { period: 'month' },
	onChange
}: PeriodSelectProps) {
	const [rangeMode, setRangeMode] = useState(false)

	// Локальный черновик дат (чтобы не дергать запрос на первой дате)
	const [draftRange, setDraftRange] = useState<{ from?: Date; to?: Date }>({})

	// Если снаружи пришёл применённый range — показываем его и синхроним черновик.
	useEffect(() => {
		if (value.period === 'range') {
			const from = value.date_from ? new Date(value.date_from) : undefined
			const to = value.date_to ? new Date(value.date_to) : undefined
			setDraftRange({ from, to })
			setRangeMode(true)
		}
	}, [value.period, value.date_from, value.date_to])

	// Если пользователь применил не-range пресет извне — выходим из rangeMode и сбрасываем черновик.
	useEffect(() => {
		if (value.period !== 'range') {
			setRangeMode(false)
			setDraftRange({})
		}
	}, [value.period])

	const appliedPreset =
		PRESETS.find(p => p.value === value.period) ?? PRESETS[2]

	/**
	 * Лейбл:
	 * - если мы в rangeMode (пользователь выбирает) — показываем draft (даже если ещё не применено)
	 * - иначе показываем applied value
	 */
	const label = useMemo(() => {
		if (rangeMode) {
			if (draftRange.from && draftRange.to) {
				return `${formatDateForCard(draftRange.from.toISOString())} — ${formatDateForCard(
					draftRange.to.toISOString()
				)}`
			}
			if (draftRange.from) {
				return `${formatDateForCard(draftRange.from.toISOString())} — …`
			}
			return 'Диапазон'
		}

		if (value.period !== 'range') {
			return appliedPreset.label
		}

		// applied range (если rangeMode вдруг false)
		if (value.date_from && value.date_to) {
			return `${formatDateForCard(value.date_from)} — ${formatDateForCard(value.date_to)}`
		}
		if (value.date_from) {
			return `${formatDateForCard(value.date_from)} — …`
		}
		return 'Диапазон'
	}, [
		rangeMode,
		draftRange.from,
		draftRange.to,
		value.period,
		value.date_from,
		value.date_to,
		appliedPreset.label
	])

	const handlePresetClick = (preset: PeriodPreset) => {
		if (preset === 'range') {
			setRangeMode(true)
			setDraftRange({})
			return
		}

		onChange({ period: preset })
	}

	return (
		<Popover>
			<PopoverTrigger asChild>
				<Button
					variant='outline'
					size='sm'
					className='h-8 px-2 text-xs flex items-center gap-1'
				>
					<span>{label}</span>
					<ChevronDown className='h-3 w-3' />
				</Button>
			</PopoverTrigger>

			<PopoverContent className='w-72 p-3'>
				<div className='flex flex-col gap-1'>
					{PRESETS.map(preset => {
						const isActive =
							preset.value === 'range'
								? rangeMode || value.period === 'range'
								: value.period === preset.value

						return (
							<button
								key={preset.value}
								type='button'
								className={cn(
									'text-left px-3 py-1.5 rounded-md text-sm hover:bg-accent',
									isActive && 'bg-accent'
								)}
								onClick={e => {
									e.stopPropagation()
									handlePresetClick(preset.value)
								}}
							>
								{preset.label}
							</button>
						)
					})}

					{(rangeMode || value.period === 'range') && (
						<div className='mt-2 border-t pt-2'>
							<Calendar
								mode='range'
								numberOfMonths={1}
								selected={{
									from: draftRange.from,
									to: draftRange.to
								}}
								onSelect={range => {
									if (!range) return

									// 1) первая дата → только локальный draft
									if (range.from && !range.to) {
										setDraftRange({ from: range.from, to: undefined })
										return
									}

									// 2) обе даты → применяем (1 запрос)
									if (range.from && range.to) {
										setDraftRange({ from: range.from, to: range.to })

										onChange({
											period: 'range',
											date_from: range.from.toISOString(),
											date_to: range.to.toISOString()
										})
                    
										setRangeMode(false)
									}
								}}
							/>
						</div>
					)}
				</div>
			</PopoverContent>
		</Popover>
	)
}
