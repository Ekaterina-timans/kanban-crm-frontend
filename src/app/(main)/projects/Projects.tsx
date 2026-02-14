'use client'

import { ChevronLeft, ChevronRight } from 'lucide-react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useCallback, useEffect } from 'react'

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
	const router = useRouter()
	const pathname = usePathname()

	const handleSelectSpace = useCallback(
		(id: string) => {
			// обновляем стор/преференсы
			selectSpace(id)

			// обновляем URL, чтобы эффект не откатывал назад
			const params = new URLSearchParams(searchParams.toString())
			params.set('spaceId', id)
			router.replace(`${pathname}?${params.toString()}`)
		},
		[selectSpace, searchParams, router, pathname]
	)

	useEffect(() => {
		if (!isReady || isLoading || !spaces?.length) return

		const byId = (id: string | null) =>
			id ? spaces.find(s => String(s.id) === String(id)) : null

		const sidFromUrl = searchParams.get('spaceId')
		const spaceFromUrl = byId(sidFromUrl)

		// Приоритет: spaceId из URL
		if (spaceFromUrl) {
			if (String(currentSpaceId) !== String(spaceFromUrl.id)) {
				selectSpace(String(spaceFromUrl.id))
			}
			return
		}

		// Если URL пустой/невалидный — используем сохранённый currentSpaceId
		const spaceFromStore = byId(currentSpaceId)
		if (spaceFromStore) return

		// Иначе — первый space
		const firstId = String(spaces[0].id)
		selectSpace(firstId)

		const params = new URLSearchParams(searchParams.toString())
		params.set('spaceId', firstId)
		router.replace(`${pathname}?${params.toString()}`)
	}, [
		isReady,
		isLoading,
		spaces,
		currentSpaceId,
		selectSpace,
		searchParams,
		router,
		pathname
	])

	const sidebarWidth = collapsed ? 0 : SIDEBAR_W

	return (
		<div
			className='relative'
			style={{ height: 'calc(100vh - 80px)' }}
		>
			<button
				type='button'
				onClick={toggle}
				className='absolute top-1/2 -translate-y-1/2 z-10 h-12 w-6 rounded-r-lg bg-card border border-border
					text-muted-foreground hover:text-foreground hover:bg-accent shadow flex items-center justify-center transition-colors'
				style={{ left: sidebarWidth }}
				title={collapsed ? 'Открыть' : 'Скрыть'}
			>
				{collapsed ? (
					<ChevronRight className='h-4 w-4' />
				) : (
					<ChevronLeft className='h-4 w-4' />
				)}
			</button>

			<div className='flex h-full w-full'>
				<div
					className='relative shrink-0 border-r border-border dark:border-foreground/10 bg-card transition-[width] duration-200'
					style={{ width: sidebarWidth }}
				>
					<SidebarProject
						spaces={spaces}
						selectedSpaceId={currentSpaceId}
						onSelectSpace={handleSelectSpace}
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
