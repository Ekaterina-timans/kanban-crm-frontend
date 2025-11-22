import { Permission } from "@/types/permission.enum"
import { TRole } from "@/types/role.type"
import { create } from "zustand"

interface ISpaceAccess {
	role: TRole
	permissions: string[]
}

interface SpaceAccessState {
	currentSpaceId: string | null
	spaceAccessMap: Record<string, ISpaceAccess> // ключ — spaceId
	setCurrentSpace: (spaceId: string) => void
	setAccess: (spaceId: string, role: TRole, permissions: string[]) => void
	getAccess: () => ISpaceAccess | null
	can: (permission: Permission) => boolean
	canManageForeignComments: () => boolean
	reset: () => void
}

export const useSpaceAccessStore = create<SpaceAccessState>((set, get) => ({
	currentSpaceId: null,
	spaceAccessMap: {},

	setCurrentSpace: (spaceId) => set({ currentSpaceId: spaceId }),

	setAccess: (spaceId, role, permissions) =>
		set((state) => ({
			spaceAccessMap: {
				...state.spaceAccessMap,
				[spaceId]: { role, permissions }
			}
		})),

	getAccess: () => {
		const { currentSpaceId, spaceAccessMap } = get()
		return currentSpaceId ? spaceAccessMap[currentSpaceId] ?? null : null
	},

	can: (permission) => {
		const access = get().getAccess()
		if (!access) return false
		if (access.role === 'owner') return true
		return access.permissions.includes(permission)
	},

	canManageForeignComments: () => {
		const access = get().getAccess()
		if (!access) return false
		return access.role === 'owner'
	},

	reset: () => set({ currentSpaceId: null, spaceAccessMap: {} }),
}))