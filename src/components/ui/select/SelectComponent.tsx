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
					'flex items-center justify-between w-full h-[47px] border-2 border-gray-300 rounded-lg bg-white px-3 text-base text-gray-800 hover:border-blue-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-300 transition',
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
					<ChevronDown className='w-4 h-4 text-gray-500' />
				</Select.Icon>
			</Select.Trigger>

			<Select.Portal>
				<Select.Content
					position='popper'
					side='bottom'
					align='start'
					className='bg-white border border-gray-200 rounded-md shadow-lg z-50 overflow-hidden'
				>
					<Select.ScrollUpButton className='flex items-center justify-center py-1 text-gray-400'>
						<ChevronUp className='w-4 h-4' />
					</Select.ScrollUpButton>

					{/* Ограничиваем высоту и включаем скролл */}
					<Select.Viewport className='p-1 max-h-[220px] overflow-y-auto'>
						{options.map(opt => (
							<Select.Item
								key={opt.value}
								value={opt.value}
								className={cn(
									'flex items-center gap-2 px-3 py-2 rounded-md text-gray-800 text-sm cursor-pointer select-none',
									'hover:bg-blue-50 hover:text-blue-600 focus:bg-blue-100 focus:text-blue-700 outline-none transition'
								)}
							>
								{opt.icon && <span className='text-gray-600'>{opt.icon}</span>}
								<Select.ItemText>{opt.label}</Select.ItemText>
								<Select.ItemIndicator className='ml-auto text-blue-600'>
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
