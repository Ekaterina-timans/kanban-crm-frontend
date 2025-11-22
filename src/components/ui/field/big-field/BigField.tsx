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
					<span className='-mb-1 text-base font-medium text-gray-700'>
						{label}
					</span>
				)}

				<div className='flex items-center'>
					{LeftIcon && (
						<button
							type='button'
							onClick={onLeftIconClick}
							className={cn(
								'absolute top-4 left-0 flex items-start pl-3 text-slate-500 pointer-events-auto',
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
							'mt-2 flex w-full items-center justify-center rounded-lg border-2 border-gray-300 bg-white/0 p-2 text-base outline-none placeholder:text-slate-600 duration-500 transition-colors focus:border-primary',
							LeftIcon ? 'pl-10' : '',
							showEmojiPicker ? 'pr-10' : '',
							error ? 'border-red-600 mb-2' : ''
						)}
					/>
				</div>

				{error && (
					<div className='absolute -bottom-5 left-9 text-red-600 text-xs'>
						{error.message}
					</div>
				)}
			</label>
		)
	}
)

BigField.displayName = 'BigField'
