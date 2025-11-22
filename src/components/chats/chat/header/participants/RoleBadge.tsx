import { Crown, Shield, UserCog } from 'lucide-react'

import { ChatRole } from '@/types/chat.type'

import { cn } from '@/lib/utils'
import Badge from '@/components/ui/badge/Badge';

export function RoleBadge({ role }: { role: ChatRole }) {
	const map: Record<ChatRole, { label: string; cls: string; Icon: any }> = {
		owner: {
			label: 'Владелец',
			cls: 'bg-amber-100 text-amber-700',
			Icon: Crown
		},
		admin: { label: 'Админ', cls: 'bg-blue-100 text-blue-700', Icon: Shield },
		member: {
			label: 'Участник',
			cls: 'bg-slate-100 text-slate-700',
			Icon: UserCog
		}
	}

	const { label, cls, Icon: Ico } = map[role]

	return (
		<Badge
			text={
				<div className="inline-flex items-center gap-1">
					<Ico size={14} />
					{label}
				</div>
			}
			color="default"
			size="small"
			className={cn(
				'rounded px-2 font-normal',
				cls
			)}
		/>
	)
}
