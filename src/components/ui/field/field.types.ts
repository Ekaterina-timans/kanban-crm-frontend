import { LucideIcon } from 'lucide-react'
import { InputHTMLAttributes, TextareaHTMLAttributes } from 'react'
import { FieldError } from 'react-hook-form'

export type BaseFieldProps = {
  placeholder?: string
  error?: FieldError
  Icon?: LucideIcon
  leftIcon?: LucideIcon
  leftIconClassName?: string
  iconSize?: number
  onLeftIconClick?: () => void
  rightIcon?: LucideIcon
  onRightIconClick?: () => void
  className?: string
  label?: string
  showEmojiPicker?: boolean
  showMentions?: boolean
  mentionMembers?: Array<{ id: number | string; name?: string | null; email?: string | null }>
  onMentionSelect?: (user: { id: number | string; name?: string | null; email?: string | null }) => void
}

export type FieldProps = BaseFieldProps &
	Omit<InputHTMLAttributes<HTMLInputElement>, 'onChange'> & {
		value?: string | number
		onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
	}

export type BigFieldProps = BaseFieldProps &
  Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, 'onChange'> & {
    value?: string
    onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void
  }
