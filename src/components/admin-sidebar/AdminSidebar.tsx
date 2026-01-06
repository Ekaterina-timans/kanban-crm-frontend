import { BarChart3, LogOut, UserRoundCog, UserRoundPen, UsersRound } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

import { ADMIN_PAGES } from '@/config/admin-pages.config'

import { buttonVariants } from '../ui/button/Button'

import { cn } from '@/lib/utils'
import { useLogout } from '@/hooks/auth/useLogout'

type NavItem = {
	label: string
	href: string
	icon: React.ElementType
}

const NAV_ITEMS: NavItem[] = [
	{ label: 'Статистика', href: ADMIN_PAGES.STATISTICS, icon: BarChart3 },
	{ label: 'Пользователи', href: ADMIN_PAGES.USERS, icon: UserRoundCog },
	{ label: 'Группы', href: ADMIN_PAGES.GROUPS, icon: UsersRound },
	{ label: 'Профиль', href: ADMIN_PAGES.PROFILE, icon: UserRoundPen }
]

function isActivePath(pathname: string, href: string) {
	return pathname === href || pathname.startsWith(href + '/')
}

export function AdminSidebar() {
	const pathname = usePathname()
	const { logout, isPending } = useLogout()

	return (
		<aside className='sticky top-0 h-screen w-[260px] border-r bg-background'>
			<div className='flex h-full flex-col p-4'>
				{/* Заголовок */}
				<div className='mb-6'>
					<div className='text-sm font-semibold tracking-tight'>
						Панель управления
					</div>
				</div>

				{/* Навигация */}
				<nav className='flex flex-col gap-1'>
					{NAV_ITEMS.map(item => {
						const active = isActivePath(pathname, item.href)
						const Icon = item.icon

						return (
							<Link
								key={item.href}
								href={item.href}
								className={cn(
									buttonVariants({
										variant: active ? 'secondary' : 'ghost',
										size: 'sm',
										className: cn(
											'w-full justify-start gap-2',
											!active && 'text-muted-foreground'
										)
									})
								)}
							>
								<Icon className='h-4 w-4' />
								{item.label}
							</Link>
						)
					})}
				</nav>
				<div className='mt-auto pt-4 border-t'>
					<button
						type='button'
						onClick={() => logout()}
						disabled={isPending}
						className={cn(
							buttonVariants({
								variant: 'ghost',
								size: 'sm',
								className:
									'w-full justify-start gap-2 text-red-600 hover:text-red-700'
							})
						)}
					>
						<LogOut className='h-4 w-4' />
						{isPending ? 'Выходим...' : 'Выйти'}
					</button>
				</div>
			</div>
		</aside>
	)
}
