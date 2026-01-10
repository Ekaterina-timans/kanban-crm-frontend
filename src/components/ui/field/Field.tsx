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
		const hasLeft = !!Icon || !!LeftIcon
		const hasRight = !!RightIcon
		const hasError = !!error?.message

		return (
			<label className={cn('flex flex-col gap-1', className)}>
				{label && (
					<span className='text-sm font-medium text-muted-foreground'>
						{label}
					</span>
				)}

				<div className='relative'>
					{/* статичная иконка Icon */}
					{Icon && (
						<span className='absolute inset-y-0 left-3 flex items-center text-muted-foreground pointer-events-none'>
							<Icon />
						</span>
					)}

					<input
						ref={ref}
						{...rest}
						aria-invalid={hasError}
						className={cn(
							'w-full h-11 rounded-xl border bg-background px-4 text-base text-foreground placeholder:text-muted-foreground shadow-sm',
							'transition-[border-color,box-shadow] duration-200',
							'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
							'border-input',
							hasLeft && 'pl-10',
							hasRight && 'pr-10',
							hasError && 'border-destructive focus-visible:ring-destructive'
						)}
					/>

					{/* левая кнопка-иконка */}
					{LeftIcon && (
						<button
							type='button'
							onClick={onLeftIconClick}
							className={cn(
								'absolute inset-y-0 left-0 flex items-center pl-3 text-muted-foreground hover:text-foreground transition-colors',
								!onLeftIconClick && 'pointer-events-none',
								leftIconClassName
							)}
							aria-label='left action'
							tabIndex={onLeftIconClick ? 0 : -1}
						>
							<LeftIcon size={iconSize} />
						</button>
					)}

					{/* правая кнопка-иконка */}
					{RightIcon && (
						<button
							type='button'
							aria-label='right action'
							onClick={onRightIconClick}
							className='absolute inset-y-0 right-0 flex items-center pr-3 text-muted-foreground hover:text-foreground transition-colors'
							tabIndex={onRightIconClick ? 0 : -1}
						>
							<RightIcon className='h-4 w-4' />
						</button>
					)}
				</div>

				{/* Ошибка обычным блоком — НЕ absolute */}
				{hasError && (
					<div className='text-sm text-destructive'>{error?.message}</div>
				)}
			</label>
		)
	}
)

Field.displayName = 'Field'
export default Field
