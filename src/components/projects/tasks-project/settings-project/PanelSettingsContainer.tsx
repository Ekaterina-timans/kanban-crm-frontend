'use client'

import { useMemo } from 'react'

import { useSettingsPanel } from '@/store/useSettingsPanel'

import { useSpaceId } from '@/hooks/space/useSpaceId'

import { PanelSettings } from './PanelSettings'

export function PanelSettingsContainer() {
	const { isOpen, spaceId, tab, setTab, close } = useSettingsPanel()
	const { items, isLoading } = useSpaceId(spaceId)

	const key = useMemo(() => (items ? `${items.id}` : 'empty'), [items?.id])

	if (!spaceId || isLoading || !items) return null

	return (
		<div key={key}>
			<PanelSettings
				open={isOpen}
				onOpenChange={open => (!open ? close() : null)}
				spaceItems={items}
				columns={items.columns}
				tab={tab}
				onTabChange={setTab}
			/>
		</div>
	)
}
