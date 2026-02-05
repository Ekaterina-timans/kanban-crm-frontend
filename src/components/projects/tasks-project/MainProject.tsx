'use client'

import { useEffect, useMemo, useState } from 'react'

import { ScrollArea } from '@/components/ui/scroll/scroll-area'
import { MainProjectSkeleton } from '@/components/ui/skeleton/MainProjectSkeleton'

import { DEFAULT_SPACE_COLOR } from '@/constants/colors'

import { ITaskFilters } from '@/types/space.types'

import { useSettingsPanel } from '@/store/useSettingsPanel'
import { useSpaceAccessStore } from '@/store/useSpaceAccessStore'

import { useFetchSpaceRole } from '@/hooks/space-user/useFetchSpaceRole'
import { useGetSpaceUsers } from '@/hooks/space-user/useGetSpaceUsers'
import { useSpaceKanban } from '@/hooks/space/useSpaceKanban'
import { useSpaceMeta } from '@/hooks/space/useSpaceMeta'

import { getPriorityOptions, getStatusOptions } from '@/utils/selectOptions'

import { API_URL_IMAGE } from '@/api/interceptors'

import { HeaderProject } from './header/HeaderProject'
import {
	ITaskFiltersUI,
	Option,
	defaultTaskFiltersUI
} from './header/task-filters-ui.types'
import { KanbanView } from './kanban-view/KanbanView'
import { PanelSettingsContainer } from './settings-project/PanelSettingsContainer'
import { TaskModalHost } from './TaskModalHost'

export function MainProject({ spaceId }: { spaceId: string | null }) {
	const { data: spaceUsers = [] } = useGetSpaceUsers(spaceId ?? '')
	const { isLoading: isRoleLoading } = useFetchSpaceRole(spaceId ?? '')
	const { open } = useSettingsPanel()

	const access = useSpaceAccessStore(state => state.getAccess())
	const role = access?.role

	const [isFiltersOpen, setIsFiltersOpen] = useState(false)
	const [draftFilters, setDraftFilters] =
		useState<ITaskFiltersUI>(defaultTaskFiltersUI)
	const [appliedFilters, setAppliedFilters] =
		useState<ITaskFiltersUI>(defaultTaskFiltersUI)

	// чтобы не таскать пустые строки
	function draftToString(v: string | null | undefined) {
		const s = (v ?? '').trim()
		return s === '' ? undefined : s
	}

	const apiFilters: ITaskFilters = useMemo(() => {
		const ANY = '__any__'

		return {
			task_q: draftToString(appliedFilters.task_q),

			assignee_id:
				appliedFilters.assignee_id && appliedFilters.assignee_id !== ANY
					? Number(appliedFilters.assignee_id)
					: undefined,

			status_id:
				appliedFilters.status_id && appliedFilters.status_id !== ANY
					? Number(appliedFilters.status_id)
					: undefined,

			priority_id:
				appliedFilters.priority_id && appliedFilters.priority_id !== ANY
					? Number(appliedFilters.priority_id)
					: undefined,

			due_from: draftToString(appliedFilters.due_from),
			due_to: draftToString(appliedFilters.due_to),

			task_sort: appliedFilters.task_sort || undefined,
			task_order: appliedFilters.task_order || undefined
		}
	}, [appliedFilters])

	const { data: meta, isLoading: metaLoading } = useSpaceMeta(spaceId)
	const { data: kanban, isLoading: kanbanLoading } = useSpaceKanban(
		spaceId,
		apiFilters
	)

	const onToggleFilters = () => setIsFiltersOpen(prev => !prev)

	const onChangeFilters = (patch: Partial<ITaskFiltersUI>) => {
		setDraftFilters(prev => ({ ...prev, ...patch }))
	}

	const onApplyFilters = () => {
		setAppliedFilters(draftFilters)
	}

	const onResetFilters = () => {
		setDraftFilters(defaultTaskFiltersUI)
		setAppliedFilters(defaultTaskFiltersUI)
	}

	const assigneeOptions: Option[] = useMemo(() => {
		return (spaceUsers ?? [])
			.filter((su: any) => su?.user?.id)
			.map((su: any) => ({
				value: String(su.user.id),
				label: su.user.name ?? su.user.email
			}))
	}, [spaceUsers])

	const statusOptions: Option[] = useMemo(() => getStatusOptions(), [])
	const priorityOptions: Option[] = useMemo(() => getPriorityOptions(), [])

	if (metaLoading || isRoleLoading) return <MainProjectSkeleton />

	if (!meta) {
		return <div>Проекты не найдены.</div>
	}

	const canOpenSettings = role === 'owner' || role === 'editor'

	const backgroundStyle =
		typeof meta.backgroundImage === 'string' && meta.backgroundImage
			? {
					backgroundImage: `url(${API_URL_IMAGE}${meta.backgroundImage})`,
					backgroundSize: 'cover',
					backgroundPosition: 'center',
					minHeight: 'calc(100vh - 80px)'
				}
			: {
					background: meta.backgroundColor || DEFAULT_SPACE_COLOR,
					minHeight: 'calc(100vh - 80px)'
				}

	return (
		<div
			style={backgroundStyle}
			className='relative h-full pl-1 flex flex-col'
		>
			<div className='pointer-events-none absolute inset-0 bg-background/10 dark:bg-background/20' />
			<div className='relative z-10 h-full flex flex-col min-h-0'>
				<HeaderProject
					name={meta.name}
					description={meta.description}
					onSettingsClick={() => open(String(meta.id), 'space')}
					canOpenSettings={canOpenSettings}
					isFiltersOpen={isFiltersOpen}
					onToggleFilters={onToggleFilters}
					filters={draftFilters}
					appliedFilters={appliedFilters}
					onChangeFilters={onChangeFilters}
					onApplyFilters={onApplyFilters}
					onResetFilters={onResetFilters}
					assigneeOptions={assigneeOptions}
					statusOptions={statusOptions}
					priorityOptions={priorityOptions}
				/>

				<ScrollArea className='min-h-0 flex-1 z-20'>
					<KanbanView
						id={meta.id}
						columns={kanban?.columns ?? []}
					/>
				</ScrollArea>

				{canOpenSettings && <PanelSettingsContainer />}
			</div>
			<TaskModalHost />
		</div>
	)
}
