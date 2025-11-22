'use client'

import { useMemo, useState } from 'react'

import { MainAdmin } from '@/components/admin-panel/admin/MainAdmin'
import { SidebarAdmin } from '@/components/admin-panel/sidebar/SidebarAdmin'

const SIDEBAR_W = 280

export function AdminPanel() {
	const [active, setActive] = useState<'members' | 'history' | 'settings'>(
		'members'
	)

	const gridCols = useMemo(() => `${SIDEBAR_W}px 1fr`, [])

	return (
		<div
			className='grid'
			style={{
				gridTemplateColumns: gridCols,
				height: 'calc(100vh - 80px)'
			}}
		>
			<SidebarAdmin
				active={active}
				setActive={setActive}
			/>
			<MainAdmin active={active} />
		</div>
	)
}
