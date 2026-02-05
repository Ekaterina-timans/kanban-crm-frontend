'use client'

import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useSearchParams } from 'next/navigation'
import { useEffect } from 'react'

import { SidebarProject } from '@/components/projects/sidebar/SidebarProject'
import { MainProject } from '@/components/projects/tasks-project/MainProject'

import { useProjectSidebar } from '@/store/useProjectSidebar'

import { useCurrentSpace } from '@/hooks/space/useCurrentSpace'
import { useSpaces } from '@/hooks/space/useSpaces'

const SIDEBAR_W = 280

export function Projects() {
	const { items: spaces, isLoading } = useSpaces()
	const { currentSpaceId, selectSpace, isReady } = useCurrentSpace()
	const { collapsed, toggle } = useProjectSidebar()
	const searchParams = useSearchParams()

	useEffect(() => {
		if (!isReady || isLoading || !spaces?.length) return

		const byId = (id: string | null) =>
			id ? spaces.find(s => String(s.id) === String(id)) : null

		const sidFromUrl = searchParams.get('spaceId')
		const spaceFromUrl = byId(sidFromUrl)

		// 1) Приоритет: spaceId из URL
		if (spaceFromUrl) {
			if (String(currentSpaceId) !== String(spaceFromUrl.id)) {
				selectSpace(String(spaceFromUrl.id))
			}
			return
		}

		// 2) Если URL пустой/невалидный — используем сохранённый currentSpaceId
		const spaceFromStore = byId(currentSpaceId)
		if (spaceFromStore) return

		// 3) Иначе — первый space
		selectSpace(String(spaces[0].id))
	}, [isReady, isLoading, spaces, currentSpaceId, selectSpace, searchParams])

	const sidebarWidth = collapsed ? 0 : SIDEBAR_W

	return (
		<div
			className='relative'
			style={{ height: 'calc(100vh - 80px)' }}
		>
			{/* Ручка: всегда поверх, привязана к кромке панели */}
			<button
				type='button'
				onClick={toggle}
				className='
          absolute top-1/2 -translate-y-1/2
          z-10 h-12 w-6 rounded-r-lg
          bg-slate-200 hover:bg-slate-300 shadow
          flex items-center justify-center
        '
				style={{ left: sidebarWidth }}
				title={collapsed ? 'Открыть' : 'Скрыть'}
			>
				{collapsed ? (
					<ChevronRight className='h-4 w-4' />
				) : (
					<ChevronLeft className='h-4 w-4' />
				)}
			</button>

			{/* Сетка контента */}
			<div className='flex h-full w-full'>
				<div
					className='relative shrink-0 border-r border-slate-200 bg-white transition-[width] duration-200'
					style={{ width: sidebarWidth }}
				>
					<SidebarProject
						spaces={spaces}
						selectedSpaceId={currentSpaceId}
						onSelectSpace={selectSpace}
						loading={isLoading}
					/>
				</div>
				<div className='min-w-0 flex-1'>
					<MainProject spaceId={currentSpaceId} />
				</div>
			</div>
		</div>
	)
}
