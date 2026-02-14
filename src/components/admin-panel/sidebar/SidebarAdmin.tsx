import { Clock, Plug, Settings, Users } from 'lucide-react'

import { cn } from '@/lib/utils'

interface SidebarAdminProps {
	active: string
	setActive: (v: any) => void
}

export function SidebarAdmin({ active, setActive }: SidebarAdminProps) {
	const items = [
		{ id: 'members', label: 'Участники', icon: Users },
		{ id: 'settings', label: 'Настройки группы', icon: Settings },
		{ id: 'integration', label: 'Интеграции', icon: Plug },
		{ id: 'history', label: 'История действий', icon: Clock }
	]

	return (
		<aside className='border-r border-border bg-card p-4'>
			<div className='flex flex-col gap-1 mt-4'>
				{items.map(item => (
					<button
						key={item.id}
						onClick={() => setActive(item.id)}
						className={cn(
							'flex items-center gap-2 px-3 py-2 rounded-lg text-base font-medium transition',
							active === item.id
								? 'bg-secondary text-primary'
								: 'text-foreground hover:bg-muted'
						)}
					>
						<item.icon className='w-5 h-5' />
						{item.label}
					</button>
				))}
			</div>
		</aside>
	)
}
