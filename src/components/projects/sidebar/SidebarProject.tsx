'use client'

import { Plus, Search, X } from 'lucide-react'
import { useMemo, useState } from 'react'

import { Button } from '@/components/ui/button/Button'
import Field from '@/components/ui/field/Field'

import { ISpaceProjectProps } from '@/types/space.types'

import { useProjectSidebar } from '@/store/useProjectSidebar'

import { SpaceModal } from '../SpaceModal'

import { ListCardsProjects } from './ListCardsProjects'

export function SidebarProject({
	spaces,
	selectedSpaceId,
	onSelectSpace,
	loading
}: ISpaceProjectProps) {
	const [isModalOpen, setModalOpen] = useState(false)
	const collapsed = useProjectSidebar(s => s.collapsed)
	const [query, setQuery] = useState('')

	// отфильтрованные проекты
	const filteredSpaces = useMemo(() => {
		const q = query.trim().toLowerCase()
		if (!q) return spaces
		return spaces.filter(
			s =>
				s.name.toLowerCase().includes(q) ||
				(s.description?.toLowerCase() ?? '').includes(q)
		)
	}, [spaces, query])

	return (
		<aside className='h-full bg-white border-r border-slate-200 overflow-hidden'>
			<div
				className={[
					'flex h-full flex-col p-3 transition-opacity duration-200',
					collapsed ? 'opacity-0 pointer-events-none' : 'opacity-100'
				].join(' ')}
			>
				<div className='mt-3'>
					<Field
						placeholder='Поиск...'
						value={query}
						onChange={e => setQuery(e.target.value)}
						leftIcon={Search}
						rightIcon={X}
						onRightIconClick={() => setQuery('')}
					/>
				</div>
				<Button
					className='mt-3 w-full h-10 bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 flex items-center justify-center rounded-lg'
					onClick={() => setModalOpen(true)}
				>
					<Plus
						className='mr-2'
						size={18}
					/>
					<span className='text-sm'>Добавить пространство</span>
				</Button>

				<div>
					{loading && <div className='text-center py-2'>Загрузка...</div>}
					{!loading && filteredSpaces.length === 0 && query && (
						<div className='text-center py-3 text-slate-500'>
							Ничего не найдено по «{query}»
						</div>
					)}

					{!loading && filteredSpaces.length > 0 && (
						<ListCardsProjects
							spaces={filteredSpaces}
							selectedSpaceId={selectedSpaceId}
							onSelectSpace={id => onSelectSpace(id)}
						/>
					)}
				</div>

				<SpaceModal
					isOpen={isModalOpen}
					onClose={() => setModalOpen(false)}
				/>
			</div>
		</aside>
	)
}
