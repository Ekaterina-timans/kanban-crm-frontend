import { Switch } from '@/components/ui/switch'

export function SettingRow(props: {
	label: string
	checked: boolean
	onCheckedChange: (v: boolean) => void
	disabled?: boolean
	hint?: string
}) {
	const { label, checked, onCheckedChange, disabled, hint } = props

	return (
		<div className='flex items-center justify-between py-3 border-b last:border-b-0'>
			<div className='pr-4'>
				<div className='text-base'>{label}</div>
				{hint && <div className='text-sm text-muted-foreground'>{hint}</div>}
			</div>

			<Switch
				checked={checked}
				onCheckedChange={onCheckedChange}
				disabled={disabled}
			/>
		</div>
	)
}
