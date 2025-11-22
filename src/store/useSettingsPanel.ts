import { create } from 'zustand'

export type Tab = 'space' | 'columns' | 'users'

type State = {
	isOpen: boolean
	spaceId: string | null
	tab: Tab
}

type Actions = {
	open: (spaceId: string, tab?: Tab) => void
	close: () => void
	setTab: (tab: Tab) => void
}

export const useSettingsPanel = create<State & Actions>(set => ({
	isOpen: false,
	spaceId: null,
	tab: 'space',
	open: (spaceId, tab = 'space') => set({ isOpen: true, spaceId, tab }),
	close: () => set({ isOpen: false }),
	setTab: tab => set({ tab })
}))
