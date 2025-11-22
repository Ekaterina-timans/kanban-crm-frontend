'use client'

import {
	Popover,
	PopoverContent,
	PopoverTrigger
} from '@radix-ui/react-popover'
import { format } from 'date-fns'
import { CalendarIcon } from 'lucide-react'
import { useState } from 'react'
import { UseFormSetValue } from 'react-hook-form'

import { ITaskForm } from '@/types/modal.types'

import { Button } from '../button/Button'

import { Calendar } from './calendar'
import { cn } from '@/lib/utils'

interface ICalendarComponentProps {
	className?: string
	placeholder?: string
	setValue?: UseFormSetValue<ITaskForm>
	fieldName?: keyof ITaskForm
	onDateChange?: (date: Date) => void
	disabled?: boolean
}

export const CalendarComponent = ({
	className,
	placeholder = 'Выберите дату',
	setValue,
	fieldName,
	onDateChange,
	disabled = false
}: ICalendarComponentProps) => {
	const [date, setDate] = useState<Date>()

	const handleDateChange = (selectedDate: Date | undefined) => {
		if (!selectedDate || disabled) return
		setDate(selectedDate)
		if (setValue && fieldName) setValue(fieldName, selectedDate)
		if (onDateChange) onDateChange(selectedDate)
	}

	return (
		<Popover>
			<PopoverTrigger asChild>
				<Button
					variant='outline'
					disabled={disabled}
					className={cn(
						'h-[47px] w-full justify-start text-left font-normal rounded-lg border-2 border-gray-300 text-base placeholder:text-slate-600',
						!date && 'text-muted-foreground',
						className
					)}
				>
					<CalendarIcon />
					{date ? format(date, 'dd.MM.yyyy') : <span>{placeholder}</span>}
				</Button>
			</PopoverTrigger>
			{!disabled && (
				<PopoverContent className='w-auto p-0 bg-white rounded mb-1 shadow-lg border border-gray-200'>
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
