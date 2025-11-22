'use client'

import { useEffect } from 'react'

import { useAuth } from '@/providers/AuthProvider'

import { useSpaceAccessStore } from '@/store/useSpaceAccessStore'

import { useGetSpaceUsers } from '@/hooks/space-user/useGetSpaceUsers'
import { useSpaceId } from '@/hooks/space/useSpaceId'

import { API_URL_IMAGE } from '@/api/interceptors'

import { HeaderProject } from './header/HeaderProject'
import { KanbanView } from './kanban-view/KanbanView'
import { PanelSettingsContainer } from './settings-project/PanelSettingsContainer'
import { useSettingsPanel } from '@/store/useSettingsPanel'
import { useFetchSpaceRole } from '@/hooks/space-user/useFetchSpaceRole'

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

	if (isLoading || isRoleLoading) return <div>Loading...</div>

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
					background: items.backgroundColor || '#66CDAA',
					minHeight: 'calc(100vh - 80px)'
				}

	return (
		<div
			style={backgroundStyle}
			className='pl-1'
		>
			<HeaderProject
				name={items.name}
				description={items.description}
				onSettingsClick={() => open(String(items.id), 'space')}
				canOpenSettings={canOpenSettings}
			/>
			<KanbanView
				id={items.id}
				columns={items.columns}
			/>
			{canOpenSettings && <PanelSettingsContainer />}
		</div>
	)
}
