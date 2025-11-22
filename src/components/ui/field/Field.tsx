import { forwardRef } from 'react'

import { FieldProps } from './field.types'
import { cn } from '@/lib/utils'

const Field = forwardRef<HTMLInputElement, FieldProps>(
	(
		{
			error,
			Icon,
			leftIcon: LeftIcon,
			leftIconClassName,
			iconSize = 16,
			onLeftIconClick,
			rightIcon: RightIcon,
			onRightIconClick,
			className,
			label,
			...rest
		},
		ref
	) => {
		return (
			// className - класс который будет приходить из вне, если захотим как-то кастомизировать
			<label className={cn('flex flex-col relative', className)}>
				{label && (
					<span className='-mb-1 text-base font-medium text-gray-700'>
						{label}
					</span>
				)}
				<div className='flex items-center'>
					{/* ставим иконку */}
					{Icon && (
						<div className='mr-3 text-[#585654] transition-colors duration-300 ease-linear'>
							<Icon />
						</div>
					)}
					{/* чтобы получить данные, зарегитсрировать */}
					<input
						ref={ref}
						{...rest}
						className={cn(
							'flex w-full rounded-lg border-2 border-gray-300 bg-white/0 p-1.5 pr-9 text-base outline-none placeholder:text-slate-600 transition-colors duration-500 focus:border-primary',
							LeftIcon ? 'pl-9' : '',
							error ? 'border-red-600 mb-2' : ''
						)}
					/>
					{LeftIcon && (
						<button
							type='button'
							onClick={onLeftIconClick}
							className={cn(
								'absolute inset-y-0 left-0 flex items-center pl-3 text-slate-500 pointer-events-none',
								leftIconClassName
							)}
						>
							<LeftIcon size={iconSize} />
						</button>
					)}
					{RightIcon && (
						<button
							type='button'
							aria-label='action'
							onClick={onRightIconClick}
							className='absolute inset-y-0 right-0 flex items-center pr-3 text-slate-500 hover:text-slate-700'
							tabIndex={-1}
						>
							<RightIcon className='h-4 w-4' />
						</button>
					)}
				</div>
				{error && (
					<div className='absolute -bottom-3 left-2 text-red-600 text-sm'>
						{error.message}
					</div>
				)}
			</label>
		)
	}
)

Field.displayName = 'Field'

export default Field
