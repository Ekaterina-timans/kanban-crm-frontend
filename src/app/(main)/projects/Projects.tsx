'use client'

import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useEffect, useMemo } from 'react'

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

	useEffect(() => {
		if (!isReady || isLoading || !spaces?.length) return

		const exists = spaces.some(s => String(s.id) === String(currentSpaceId))

		// Если сохранённого нет или оно больше не существует — выбираем первое
		if (!currentSpaceId || !exists) {
			selectSpace(String(spaces[0].id))
		}
	}, [isReady, isLoading, spaces, currentSpaceId, selectSpace])

	const gridCols = useMemo(
		() => `${collapsed ? '0px' : `${SIDEBAR_W}px`} 1fr`,
		[collapsed]
	)

	const handleLeft = collapsed ? 0 : SIDEBAR_W

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
				style={{ left: handleLeft }}
				title={collapsed ? 'Открыть' : 'Скрыть'}
			>
				{collapsed ? (
					<ChevronRight className='h-4 w-4' />
				) : (
					<ChevronLeft className='h-4 w-4' />
				)}
			</button>

			{/* Сетка контента */}
			<div
				className='grid'
				style={{ gridTemplateColumns: gridCols, height: '100%' }}
			>
				<SidebarProject
					spaces={spaces}
					selectedSpaceId={currentSpaceId}
					onSelectSpace={selectSpace}
					loading={isLoading}
				/>
				<MainProject spaceId={currentSpaceId} />
			</div>
		</div>
	)
}
