'use client'

import { CalendarIcon, X } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { UseFormSetValue } from 'react-hook-form'

import { ITaskForm } from '@/types/modal.types'

import { formatDateForCard } from '@/utils/date-utils'

import { Button } from '../button/Button'

import { Calendar } from './calendar'
import { Popover, PopoverContent, PopoverTrigger } from './popover'
import { cn } from '@/lib/utils'

type RangeValue = { from: Date | null; to: Date | null }

interface ICalendarComponentProps {
	className?: string
	placeholder?: string
	mode?: 'single' | 'range'
	// SINGLE mode
	value?: Date | null
	onDateChange?: (date: Date) => void
	onClear?: () => void
	// RANGE mode
	valueRange?: RangeValue
	onRangeChange?: (range: RangeValue | null) => void
	// react-hook-form (single)
	setValue?: UseFormSetValue<ITaskForm>
	fieldName?: keyof ITaskForm
	disabled?: boolean
	clearable?: boolean
}

/** Безопасная проверка Date */
function isValidDate(d: unknown): d is Date {
	return d instanceof Date && !Number.isNaN(d.getTime())
}

/** Безопасный ISO */
function toIsoSafe(d: unknown): string | null {
	if (!isValidDate(d)) return null
	try {
		return d.toISOString()
	} catch {
		return null
	}
}

export const CalendarComponent = ({
	className,
	placeholder = 'Выберите дату',
	mode = 'single',
	value,
	onDateChange,
	onClear,
	valueRange,
	onRangeChange,
	setValue,
	fieldName,
	disabled = false,
	clearable = false
}: ICalendarComponentProps) => {
	// SINGLE state
	const [date, setDate] = useState<Date | undefined>(
		isValidDate(value) ? value : undefined
	)
	// RANGE state
	const [range, setRange] = useState<{ from?: Date; to?: Date }>(() => ({
		from: isValidDate(valueRange?.from)
			? (valueRange?.from as Date)
			: undefined,
		to: isValidDate(valueRange?.to) ? (valueRange?.to as Date) : undefined
	}))
	useEffect(() => {
		if (mode !== 'single') return
		setDate(isValidDate(value) ? value : undefined)
	}, [value, mode])
	useEffect(() => {
		if (mode !== 'range') return
		setRange({
			from: isValidDate(valueRange?.from)
				? (valueRange?.from as Date)
				: undefined,
			to: isValidDate(valueRange?.to) ? (valueRange?.to as Date) : undefined
		})
	}, [valueRange?.from, valueRange?.to, mode])

	const label = useMemo(() => {
		if (mode === 'single') {
			const iso = toIsoSafe(date)
			return iso ? formatDateForCard(iso) : placeholder
		}

		const fromIso = toIsoSafe(range.from)
		const toIso = toIsoSafe(range.to)

		if (fromIso && toIso) {
			return `${formatDateForCard(fromIso)} — ${formatDateForCard(toIso)}`
		}
		if (fromIso) return `${formatDateForCard(fromIso)} — …`
		return placeholder
	}, [mode, date, placeholder, range.from, range.to])

	const hasValue = useMemo(() => {
		if (mode === 'single') return isValidDate(date)
		return isValidDate(range.from) || isValidDate(range.to)
	}, [mode, date, range.from, range.to])

	const handleSingleChange = (selectedDate: Date | undefined) => {
		if (!selectedDate || disabled) return
		if (!isValidDate(selectedDate)) return

		setDate(selectedDate)

		if (setValue && fieldName) setValue(fieldName, selectedDate)
		if (onDateChange) onDateChange(selectedDate)
	}

	const handleRangeChange = (
		selectedRange: { from?: Date; to?: Date } | undefined
	) => {
		if (!selectedRange || disabled) return

		// иногда react-day-picker может вернуть невалидные значения,
		// поэтому фильтруем
		const safeFrom = isValidDate(selectedRange.from)
			? selectedRange.from
			: undefined
		const safeTo = isValidDate(selectedRange.to) ? selectedRange.to : undefined

		setRange({ from: safeFrom, to: safeTo })

		if (onRangeChange) {
			onRangeChange({
				from: safeFrom ?? null,
				to: safeTo ?? null
			})
		}
	}

	const handleClear = (e: React.MouseEvent<HTMLButtonElement>) => {
		e.preventDefault()
		e.stopPropagation()
		if (disabled) return

		if (mode === 'single') {
			setDate(undefined)
			if (setValue && fieldName) setValue(fieldName, null as any)
			onClear?.()
			return
		}

		setRange({ from: undefined, to: undefined })
		onRangeChange?.(null)
		onClear?.()
	}

	return (
		<Popover>
			<PopoverTrigger asChild>
				<Button
					variant='outline'
					disabled={disabled}
					className={cn(
						[
							'relative group',
							'h-11 w-full justify-start text-left font-normal rounded-lg',
							'border border-input bg-background px-3 text-base',
							'shadow-sm',
							'transition-[border-color,box-shadow] duration-200',
							'hover:bg-background hover:border-input',
							'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
							'leading-tight',
							clearable ? 'pr-10' : ''
						].join(' '),
						className
					)}
				>
					<CalendarIcon
						className={hasValue ? 'text-foreground' : 'text-muted-foreground'}
					/>

					<span
						className={hasValue ? '!text-foreground' : 'text-muted-foreground'}
					>
						{label}
					</span>

					{clearable && hasValue && !disabled && (
						<button
							type='button'
							onClick={handleClear}
							className={cn(
								'absolute right-1 top-1/2 -translate-y-1/2',
								'p-1',
								'text-muted-foreground hover:text-foreground transition-colors',
								'opacity-0 pointer-events-none',
								'group-hover:opacity-100 group-hover:pointer-events-auto',
								'focus:opacity-100 focus:pointer-events-auto',
								'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-md'
							)}
							aria-label='Очистить дату'
						>
							<X className='h-4 w-4' />
						</button>
					)}
				</Button>
			</PopoverTrigger>

			{!disabled && (
				<PopoverContent className='w-auto p-0 rounded-lg border border-border shadow-lg'>
					{mode === 'single' ? (
						<Calendar
							mode='single'
							selected={date}
							onSelect={handleSingleChange}
							initialFocus
						/>
					) : (
						<Calendar
							mode='range'
							numberOfMonths={1}
							selected={range}
							onSelect={handleRangeChange}
							initialFocus
						/>
					)}
				</PopoverContent>
			)}
		</Popover>
	)
}
