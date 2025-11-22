import Link from 'next/link'
import { usePathname } from 'next/navigation'

import { IMenuItem } from './menu.interface'

export function MenuItem({ item }: { item: IMenuItem }) {
	const pathname = usePathname()
	const isActive = pathname === item.link

	return (
		<div
			className={[
				'transition-colors duration-200 cursor-pointer h-20 flex items-center justify-center text-center w-60 rounded-sm',
				isActive
					? 'bg-blue-200 text-slate-900'
					: 'hover:bg-[#eff8fd] text-slate-700'
			].join(' ')}
		>
			<Link href={item.link}>
				<span className='text-2xl font-medium'>{item.name}</span>
			</Link>
		</div>
	)
}
