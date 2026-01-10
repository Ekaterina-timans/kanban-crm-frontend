import { type VariantProps, cva } from 'class-variance-authority'
import { LucideIcon } from 'lucide-react'
import { ButtonHTMLAttributes, PropsWithChildren } from 'react'

import { cn } from '@/lib/utils'

export const buttonVariants = cva(
	[
		'inline-flex items-center justify-center gap-2 whitespace-nowrap',
		'rounded-xl text-sm font-medium',
		'ring-offset-background',
		'transition-[background,box-shadow,transform,color,border-color] duration-200',
		'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
		'disabled:pointer-events-none disabled:opacity-50',
		'active:translate-y-[0.5px]',
		'[&_svg]:pointer-events-none [&_svg]:size-5 [&_svg]:shrink-0'
	].join(' '),
	{
		variants: {
			variant: {
				// Save / Create
				default:
					'bg-primary text-primary-foreground shadow-sm hover:bg-primary/90 hover:shadow active:bg-primary/80 border border-primary/30',

				// Delete
				destructive:
					'bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90 hover:shadow active:bg-destructive/80',

				// Neutral (Cancel)
				secondary:
					'bg-secondary text-secondary-foreground border border-border/80 shadow-sm hover:bg-secondary/80 hover:border-border active:bg-secondary/70',

				// Neutral (alternative)
				outline:
					'border border-border bg-background text-foreground shadow-sm hover:bg-accent hover:text-accent-foreground active:bg-accent/80',

				// Transparent
				ghost:
					'text-foreground hover:bg-accent hover:text-accent-foreground active:bg-accent/80',

				link: 'text-primary underline-offset-4 hover:underline'
			},
			size: {
				default: 'h-11 px-5',
				sm: 'h-9 px-4',
				lg: 'h-12 px-8 text-base',
				icon: 'h-11 w-11 p-0'
			}
		},
		defaultVariants: {
			variant: 'default',
			size: 'default'
		}
	}
)

type TypeButton = ButtonHTMLAttributes<HTMLButtonElement> &
	VariantProps<typeof buttonVariants> & {
		Icon?: LucideIcon
		iconClassName?: string
	}

export function Button({
	children,
	className,
	variant,
	size,
	Icon,
	iconClassName,
	...rest
}: PropsWithChildren<TypeButton>) {
	return (
		<button
			className={cn(buttonVariants({ variant, size }), className)}
			{...rest}
		>
			{Icon && (
				<span>
					<Icon className={iconClassName} />
				</span>
			)}
			{children}
		</button>
	)
}
