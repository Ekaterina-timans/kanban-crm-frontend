import * as Select from '@radix-ui/react-select'
import { Check, ChevronDown, ChevronUp } from 'lucide-react'
import { ReactNode } from 'react'

import { cn } from '@/lib/utils'

interface Option {
	value: string
	label: string
	icon?: ReactNode
}

interface SelectComponentProps {
	options: Option[]
	placeholder?: string
	selectedValue: string
	onChange: (value: string) => void
	className?: string
	disabled?: boolean
}

export function SelectComponent({
	options,
	placeholder,
	selectedValue,
	onChange,
	className,
	disabled = false
}: SelectComponentProps) {
	const selectedOption = options.find(opt => opt.value === selectedValue)

	return (
		<Select.Root
			value={selectedValue}
			onValueChange={onChange}
			disabled={disabled}
		>
			<Select.Trigger
				className={cn(
					[
						'flex items-center justify-between w-full h-11',
						'rounded-lg border border-input bg-background px-3',
						'text-base text-foreground',
						'shadow-sm',
						'transition-[border-color,box-shadow] duration-200',
						'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
						'disabled:opacity-50 disabled:pointer-events-none'
					].join(' '),
					className
				)}
			>
				<div className='flex items-center gap-2'>
					{selectedOption?.icon && (
						<span className='text-gray-600'>{selectedOption.icon}</span>
					)}
					<Select.Value placeholder={placeholder}>
						{selectedOption?.label}
					</Select.Value>
				</div>

				<Select.Icon>
					<ChevronDown className='w-4 h-4 text-muted-foreground' />
				</Select.Icon>
			</Select.Trigger>

			<Select.Portal>
				<Select.Content
					position='popper'
					side='bottom'
					align='start'
					sideOffset={6}
					className={cn(
						'z-50 overflow-hidden rounded-lg border border-border bg-popover text-popover-foreground shadow-lg',
						'data-[state=open]:animate-in data-[state=closed]:animate-out',
						'data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0',
						'data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95'
					)}
				>
					<Select.ScrollUpButton className='flex items-center justify-center py-1 text-muted-foreground'>
						<ChevronUp className='w-4 h-4' />
					</Select.ScrollUpButton>

					{/* Ограничиваем высоту и включаем скролл */}
					<Select.Viewport className='p-1 max-h-[220px] overflow-y-auto'>
						{options.map(opt => (
							<Select.Item
								key={opt.value}
								value={opt.value}
								className={cn(
									[
										'relative flex items-center gap-2 px-3 py-2 rounded-md',
										'text-sm text-foreground cursor-pointer select-none outline-none',
										'transition-colors',
										'data-[highlighted]:bg-accent data-[highlighted]:text-accent-foreground',
										'data-[state=checked]:bg-accent/70'
									].join(' ')
								)}
							>
								{opt.icon && (
									<span className='text-muted-foreground'>{opt.icon}</span>
								)}
								<Select.ItemText>{opt.label}</Select.ItemText>
								<Select.ItemIndicator className='ml-auto text-primary'>
									<Check className='w-4 h-4' />
								</Select.ItemIndicator>
							</Select.Item>
						))}
					</Select.Viewport>

					<Select.ScrollDownButton className='flex items-center justify-center py-1 text-gray-400'>
						<ChevronDown className='w-4 h-4' />
					</Select.ScrollDownButton>
				</Select.Content>
			</Select.Portal>
		</Select.Root>
	)
}
