import { ISpaceResponse } from '@/types/space.types'

import { useSettingsPanel } from '@/store/useSettingsPanel'

import { SpaceContextMenu } from './SpaceContextMenu'
import { UserAvatar } from '@/components/ui/avatar/UserAvatar'

export function CardInfoProject({
	item,
	onSelectSpace,
	active = false,
	onDelete
}: {
	item: ISpaceResponse
	onSelectSpace: (spaceId: string) => void
	active?: boolean
	onDelete: (spaceId: string) => void
}) {
	const users = item.space_users || []
	const { open } = useSettingsPanel()

	return (
		<div
			role='button'
			tabIndex={0}
			aria-selected={active}
			onClick={() => onSelectSpace(String(item.id))}
			className={[
				'w-full text-left rounded-xl transition mb-4 cursor-pointer',
				'border bg-white',
				active
					? 'border-blue-400 ring-2 ring-blue-200'
					: 'border-slate-200 hover:border-slate-300 hover:shadow-sm'
			].join(' ')}
		>
			<div className='p-3'>
				<div className='flex justify-between items-start'>
					<h4 className='text-slate-800 text-[15px] font-semibold'>
						{item.name}
					</h4>

					{/* Контекстное меню */}
					<div onClick={e => e.stopPropagation()}>
						<SpaceContextMenu
							onEdit={() => open(String(item.id), 'space')}
							onDelete={() => onDelete(String(item.id))}
						/>
					</div>
				</div>

				{/* блок аватаров участников */}
				<div className='mt-2 flex -space-x-2'>
					{users.slice(0, 3).map((su: any) => {
						const u = su.user || su
						return (
							<UserAvatar
								key={u.id}
								src={u.avatar}
								name={u.name ?? null}
								email={u.email}
								size={28}
								className='border-2 border-white shadow-sm'
							/>
						)
					})}

					{users.length > 3 && (
						<div className='w-7 h-7 rounded-full bg-slate-200 text-slate-700 text-xs font-semibold flex items-center justify-center border-2 border-white shadow-sm'>
							+{users.length - 3}
						</div>
					)}

					{users.length === 0 && (
						<p className='text-[12px] text-slate-400 ml-1'>Нет участников</p>
					)}
				</div>

				<div className='mt-2 text-[13px] text-slate-600'>
					{item.description || 'Описание отсутствует'}
				</div>
			</div>
		</div>
	)
}
