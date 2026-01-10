'use client'

import { forwardRef, useEffect, useRef, useState } from 'react'

import { BigFieldProps } from '../field.types'

import { EmojiButton } from './EmojiButton'
import { MentionButton } from './MentionButton'
import { useAutoResizeTextarea } from './useAutoResizeTextarea'
import { cn } from '@/lib/utils'

export const BigField = forwardRef<HTMLTextAreaElement, BigFieldProps>(
	(
		{
			error,
			leftIcon: LeftIcon,
			leftIconClassName,
			iconSize = 16,
			onLeftIconClick,
			className,
			label,
			value,
			onChange,
			showEmojiPicker,
			showMentions,
			mentionMembers,
			onMentionSelect,
			...rest
		},
		ref
	) => {
		const internalRef = useRef<HTMLTextAreaElement>(null)
		const textareaRef =
			(ref as React.RefObject<HTMLTextAreaElement>) || internalRef

		const [internalValue, setInternalValue] = useState(value ?? '')
		const isControlled = value !== undefined

		useEffect(() => {
			if (isControlled) setInternalValue(value ?? '')
		}, [value, isControlled])

		const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
			if (onChange) onChange(e)
			if (!isControlled) setInternalValue(e.target.value)
		}

		// авто-ресайз
		useAutoResizeTextarea(textareaRef, isControlled ? value : internalValue)

		return (
			<label className={cn('flex flex-col relative', className)}>
				{label && (
					<span className='-mb-1 text-base font-medium text-foreground'>
						{label}
					</span>
				)}

				<div className='flex items-center'>
					{LeftIcon && (
						<button
							type='button'
							onClick={onLeftIconClick}
							className={cn(
								'absolute top-4 left-0 flex items-start pl-3 text-muted-foreground pointer-events-auto transition-colors hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background rounded-md',
								leftIconClassName
							)}
						>
							<LeftIcon size={iconSize} />
						</button>
					)}

					{/* Эмоджи */}
					{showEmojiPicker && (
						<EmojiButton
							iconSize={iconSize}
							textareaRef={textareaRef}
							value={isControlled ? value : internalValue}
							onChange={onChange}
							setInternalValue={setInternalValue}
						/>
					)}

					{/* Упоминания */}
					{showMentions && (
						<MentionButton
							iconSize={iconSize}
							textareaRef={textareaRef}
							mentionMembers={mentionMembers ?? []}
							onMentionSelect={onMentionSelect}
							value={isControlled ? value : internalValue}
							onChange={onChange}
							setInternalValue={setInternalValue}
						/>
					)}

					<textarea
						ref={textareaRef}
						value={isControlled ? value : internalValue}
						onChange={handleChange}
						maxLength={500}
						{...rest}
						className={cn(
							'mt-2 flex w-full items-center justify-center rounded-lg border border-input bg-background p-2 text-base text-foreground outline-none placeholder:text-muted-foreground shadow-sm transition-[border-color,box-shadow] duration-200 focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none',
							LeftIcon ? 'pl-10' : '',
							showEmojiPicker || showMentions ? 'pr-16' : '',
							error ? 'border-destructive focus-visible:ring-destructive' : ''
						)}
					/>
				</div>

				{error && (
					<div className='mt-1 text-sm text-destructive'>{error.message}</div>
				)}
			</label>
		)
	}
)

BigField.displayName = 'BigField'
