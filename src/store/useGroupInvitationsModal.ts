import { TabName } from '@/types/components.types'
import { create } from 'zustand'

interface GroupInvitationsModalState {
	isOpen: boolean
	defaultTab?: TabName
	open: (defaultTab?: TabName) => void
	close: () => void
}

export const useGroupInvitationsModal = create<GroupInvitationsModalState>(
	set => ({
		isOpen: false,
		defaultTab: undefined,
		open: (defaultTab) =>
		set({
			isOpen: true,
			defaultTab: defaultTab ?? 'participants',
		}),
		close: () => set({ isOpen: false, defaultTab: undefined })
	})
)