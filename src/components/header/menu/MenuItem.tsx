import Link from 'next/link'
import { usePathname } from 'next/navigation'

import { IMenuItem } from './menu.interface'

export function MenuItem({ item }: { item: IMenuItem }) {
	const pathname = usePathname()
	const isActive = pathname === item.link

	return (
		<Link
			href={item.link}
			className={[
				'px-5 py-2 rounded-xl transition-colors',
				'text-lg font-medium',
				isActive
					? 'bg-primary/15 text-foreground'
					: 'text-muted-foreground hover:bg-accent hover:text-foreground'
			].join(' ')}
		>
			{item.name}
		</Link>
	)
}
