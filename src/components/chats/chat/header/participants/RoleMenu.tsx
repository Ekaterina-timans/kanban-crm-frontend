import { UserCog } from 'lucide-react'

import { Button } from '@/components/ui/button/Button'
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger
} from '@/components/ui/dropdown/dropdown-menu'

import { ChatRole } from '@/types/chat.type'

export function RoleMenu({
	current,
	disabled,
	onChange
}: {
	current: ChatRole
	disabled?: boolean
	onChange: (next: ChatRole) => void
}) {
	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button
					variant='outline'
					size='icon'
					title='Сменить роль'
					Icon={UserCog}
					disabled={disabled}
				/>
			</DropdownMenuTrigger>

			<DropdownMenuContent
				align='end'
				className='min-w-[180px]'
			>
				{/* Владелец из меню убран — по твоему требованию */}
				<DropdownMenuItem
					onSelect={e => {
						e.preventDefault()
						if (current !== 'admin') onChange('admin')
					}}
					disabled={current === 'admin'}
				>
					Админ
				</DropdownMenuItem>
				<DropdownMenuItem
					onSelect={e => {
						e.preventDefault()
						if (current !== 'member') onChange('member')
					}}
					disabled={current === 'member'}
				>
					Участник
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	)
}
