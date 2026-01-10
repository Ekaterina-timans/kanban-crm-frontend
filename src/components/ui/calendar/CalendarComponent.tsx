'use client'

import { format } from 'date-fns'
import { CalendarIcon, X } from 'lucide-react'
import { useEffect, useState } from 'react'
import { UseFormSetValue } from 'react-hook-form'

import { ITaskForm } from '@/types/modal.types'

import { Button } from '../button/Button'

import { Calendar } from './calendar'
import { Popover, PopoverContent, PopoverTrigger } from './popover'
import { cn } from '@/lib/utils'

interface ICalendarComponentProps {
	className?: string
	placeholder?: string
	value?: Date | null
	setValue?: UseFormSetValue<ITaskForm>
	fieldName?: keyof ITaskForm
	onDateChange?: (date: Date) => void
	disabled?: boolean
	clearable?: boolean
}

export const CalendarComponent = ({
	className,
	placeholder = 'Выберите дату',
	value,
	setValue,
	fieldName,
	onDateChange,
	disabled = false,
	clearable = false
}: ICalendarComponentProps) => {
	const [date, setDate] = useState<Date | undefined>(value ?? undefined)

	useEffect(() => {
		setDate(value ?? undefined)
	}, [value])

	const handleDateChange = (selectedDate: Date | undefined) => {
		if (!selectedDate || disabled) return
		setDate(selectedDate)
		if (setValue && fieldName) setValue(fieldName, selectedDate)
		if (onDateChange) onDateChange(selectedDate)
	}

	const handleClear = (e: React.MouseEvent<HTMLButtonElement>) => {
		e.preventDefault()
		e.stopPropagation()

		if (disabled) return

		setDate(undefined)

		if (setValue && fieldName) {
			setValue(fieldName, null as any)
		}
		if (onDateChange) onDateChange(null)
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
						className={date ? 'text-foreground' : 'text-muted-foreground'}
					/>

					<span className={date ? '!text-foreground' : 'text-muted-foreground'}>
						{date ? format(date, 'dd.MM.yyyy') : placeholder}
					</span>

					{clearable && date && !disabled && (
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
					<Calendar
						mode='single'
						selected={date}
						onSelect={handleDateChange}
						initialFocus
					/>
				</PopoverContent>
			)}
		</Popover>
	)
}
