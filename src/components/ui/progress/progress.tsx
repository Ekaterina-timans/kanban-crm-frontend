'use client'

import * as ProgressPrimitive from '@radix-ui/react-progress'
import * as React from 'react'

import { cn } from '@/lib/utils'

type ProgressVariant = 'default' | 'success' | 'warning' | 'destructive'

interface ProgressProps
	extends React.ComponentPropsWithoutRef<typeof ProgressPrimitive.Root> {
	value?: number
	variant?: ProgressVariant
}

const indicatorVariants: Record<ProgressVariant, string> = {
	default: 'bg-primary',
	success: 'bg-emerald-500',
	warning: 'bg-amber-500',
	destructive: 'bg-destructive'
}

const Progress = React.forwardRef<
	React.ElementRef<typeof ProgressPrimitive.Root>,
	ProgressProps
>(({ className, value, variant = 'default', ...props }, ref) => {
	const isIndeterminate = value === undefined || value === null

	return (
		<ProgressPrimitive.Root
			ref={ref}
			className={cn(
				'relative h-2.5 w-full overflow-hidden rounded-full bg-secondary shadow-sm',
				className
			)}
			{...props}
		>
			<ProgressPrimitive.Indicator
				className={cn(
					'h-full w-full flex-1 transition-transform duration-300',
					indicatorVariants[variant],
					isIndeterminate && 'animate-progress-indeterminate'
				)}
				style={
					isIndeterminate
						? undefined
						: {
								transform: `translateX(-${100 - Math.min(100, Math.max(0, value))}%)`
							}
				}
			/>
		</ProgressPrimitive.Root>
	)
})

Progress.displayName = ProgressPrimitive.Root.displayName

export { Progress }
