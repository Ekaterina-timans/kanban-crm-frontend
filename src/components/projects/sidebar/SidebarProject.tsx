'use client'

import { Plus, Search, X } from 'lucide-react'
import { useMemo, useState } from 'react'

import { Button } from '@/components/ui/button/Button'
import Field from '@/components/ui/field/Field'
import { ScrollArea } from '@/components/ui/scroll/scroll-area'

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
		<aside className='h-full bg-card border-r border-border'>
			<div
				className={[
					'flex h-full flex-col p-3 transition-opacity duration-200',
					collapsed ? 'opacity-0 pointer-events-none' : 'opacity-100'
				].join(' ')}
			>
				<div className='min-h-0 flex-1 flex flex-col'>
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
						variant='outline'
						className='mt-3 w-full h-10 justify-center gap-2 rounded-xl'
						onClick={() => setModalOpen(true)}
					>
						<Plus
							className='mr-2'
							size={18}
						/>
						<span className='text-sm'>Добавить пространство</span>
					</Button>

					<ScrollArea className='min-h-0 flex-1 mt-3'>
						{loading && <div className='text-center py-2'>Загрузка...</div>}

						{!loading && filteredSpaces.length === 0 && query && (
							<div className='text-center py-3 text-muted-foreground'>
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
					</ScrollArea>

					<SpaceModal
						isOpen={isModalOpen}
						onClose={() => setModalOpen(false)}
					/>
				</div>
			</div>
		</aside>
	)
}
