'use client'

import { useMemo, useState } from 'react'

import { ScrollArea } from '@/components/ui/scroll/scroll-area'
import { MainProjectSkeleton } from '@/components/ui/skeleton/MainProjectSkeleton'

import { useAuth } from '@/providers/AuthProvider'

import { useSettingsPanel } from '@/store/useSettingsPanel'
import { useSpaceAccessStore } from '@/store/useSpaceAccessStore'

import { useFetchSpaceRole } from '@/hooks/space-user/useFetchSpaceRole'
import { useGetSpaceUsers } from '@/hooks/space-user/useGetSpaceUsers'
import { useSpaceId } from '@/hooks/space/useSpaceId'

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

export function MainProject({ spaceId }: { spaceId: string | null }) {
	const { user } = useAuth()
	const { items, isLoading } = useSpaceId(spaceId)
	const { data: spaceUsers = [] } = useGetSpaceUsers(spaceId ?? '')
	// const { setRole, setPermissions, reset } = useSpaceAccessStore()
	const { isLoading: isRoleLoading } = useFetchSpaceRole(spaceId ?? '')
	const { open } = useSettingsPanel()

	const access = useSpaceAccessStore(state => state.getAccess())
	const role = access?.role

	// useEffect(() => {
	// 	if (!user || !spaceUsers.length) return
	// 	const current = spaceUsers.find((su: any) => su.user_id === user.id)
	// 	if (current) {
	// 		setRole(current.role)
	// 		setPermissions(current.permissions.map((p: any) => p.name))
	// 	} else {
	// 		reset()
	// 	}
	// }, [user, spaceUsers, spaceId, setRole, setPermissions, reset])

	const [isFiltersOpen, setIsFiltersOpen] = useState(false)
	const [filters, setFilters] = useState<ITaskFiltersUI>(defaultTaskFiltersUI)

	const onToggleFilters = () => setIsFiltersOpen(prev => !prev)

	const onChangeFilters = (patch: Partial<ITaskFiltersUI>) => {
		setFilters(prev => ({ ...prev, ...patch }))
	}

	const onResetFilters = () => {
		setFilters(defaultTaskFiltersUI)
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

	if (isLoading || isRoleLoading) return <MainProjectSkeleton />

	if (!items) {
		return <div>No project found.</div>
	}

	const canOpenSettings = role === 'owner' || role === 'editor'

	const backgroundStyle =
		typeof items.backgroundImage === 'string' && items.backgroundImage
			? {
					backgroundImage: `url(${API_URL_IMAGE}${items.backgroundImage})`,
					backgroundSize: 'cover',
					backgroundPosition: 'center',
					minHeight: 'calc(100vh - 80px)'
				}
			: {
					background: items.backgroundColor || '#DDEBFF',
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
					name={items.name}
					description={items.description}
					onSettingsClick={() => open(String(items.id), 'space')}
					canOpenSettings={canOpenSettings}
					isFiltersOpen={isFiltersOpen}
					onToggleFilters={onToggleFilters}
					filters={filters}
					onChangeFilters={onChangeFilters}
					onResetFilters={onResetFilters}
					assigneeOptions={assigneeOptions}
					statusOptions={statusOptions}
					priorityOptions={priorityOptions}
				/>

				<ScrollArea className='min-h-0 flex-1 z-20'>
					<KanbanView
						id={items.id}
						columns={items.columns}
					/>
				</ScrollArea>

				{canOpenSettings && <PanelSettingsContainer />}
			</div>
		</div>
	)
}
