import { usePathname, useRouter } from 'next/navigation'
import React, {
	ReactNode,
	createContext,
	useContext,
	useEffect,
	useState
} from 'react'

import { IGroup } from '@/types/group.types'
import { IUser } from '@/types/user.types'

import { useTimezoneStore } from '@/store/useTimezoneStore'

import { authService } from '@/services/auth.service'
import { userPreferencesService } from '@/services/user-preferences.service'
import { groupService } from '@/services/group.service'

interface AuthContextProps {
	user: IUser | null
	groups: IGroup[]
	currentGroupId: string | null
	isAuthenticated: boolean
	setUser: (user: IUser | null) => void
	setGroups: (groups: IGroup[]) => void
	setCurrentGroupId: (id: string) => void
	logout: () => Promise<void>
	checkAuth: () => Promise<void>
	currentGroupRole: 'admin' | 'member' | null
	setCurrentGroupRole: (role: 'admin' | 'member' | null) => void
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined)

export const useAuth = () => {
	const context = useContext(AuthContext)
	if (!context) throw new Error('useAuth must be used within AuthProvider')
	return context
}

export const AuthProvider = ({ children }: { children: ReactNode }) => {
	const [user, setUser] = useState<IUser | null>(null)
	const [groups, setGroups] = useState<IGroup[]>([])
	const [currentGroupRole, setCurrentGroupRole] = useState<
		'admin' | 'member' | null
	>(null)
	const [isAuthenticated, setIsAuthenticated] = useState(false)
	const [isLoading, setIsLoading] = useState(true)
	const [currentGroupId, setCurrentGroupId] = useState<string | null>(null)
	const { setTimezone } = useTimezoneStore()

	const router = useRouter()
	const pathname = usePathname()
	//
	const pickFirstGroup = (gs: IGroup[]) => (gs.length ? String(gs[0].id) : null)

	const applyCurrentGroup = (id: string | null) => {
		setCurrentGroupId(id)
		if (id) localStorage.setItem('currentGroupId', id)
		else localStorage.removeItem('currentGroupId')
	}

	const setGroupId = (id: string) => {
		applyCurrentGroup(id)
		userPreferencesService.setGroup(id).catch(console.error)
	}

	const checkAuth = async () => {
		try {
			const { user, groups } = await authService.getProfile()
			setUser(user)
			setGroups(groups)
			setIsAuthenticated(true)

			// тянем актуальные значения с бэка
			const actual = await userPreferencesService.getActual().catch(() => null)
			if (actual?.timezone) {
				setTimezone(actual.timezone)
			}

			const serverGroup = actual?.current_group_id ?? null
			const lsGroup = localStorage.getItem('currentGroupId')
			const groupIds = groups.map(g => String(g.id))

			let nextGroup: string | null = null

			// приоритет: сервер -> LS -> первая группа
			if (serverGroup && groupIds.includes(serverGroup)) {
				nextGroup = serverGroup
			} else if (lsGroup && groupIds.includes(lsGroup)) {
				nextGroup = lsGroup
				userPreferencesService.setGroup(lsGroup).catch(console.error)
			} else {
				nextGroup = pickFirstGroup(groups)
				if (nextGroup)
					userPreferencesService.setGroup(nextGroup).catch(console.error)
			}

			applyCurrentGroup(nextGroup)

			if (nextGroup) {
				const groupData = await groupService.getGroupById(nextGroup)

				const me = groupData.users?.find(u => u.id === user.id) ?? null
				setCurrentGroupRole(me?.pivot?.role ?? null)
			} else {
				setCurrentGroupRole(null)
			}
		} catch (error) {
			setUser(null)
			setGroups([])
			setIsAuthenticated(false)
			applyCurrentGroup(null)
		} finally {
			setIsLoading(false)
		}
	}

	useEffect(() => {
		checkAuth()
	}, [])

	useEffect(() => {
		if (isLoading) return

		if (!isAuthenticated && pathname !== '/auth') {
			router.replace('/auth')
		}
	}, [isAuthenticated, isLoading, pathname, router])

	const logout = async () => {
		await authService.logout()
		setUser(null)
		setGroups([])
		setIsAuthenticated(false)
		setCurrentGroupId(null)
	}

	if (isLoading) {
		return <div>Загрузка...</div>
	}

	return (
		<AuthContext.Provider
			value={{
				user,
				groups,
				currentGroupId,
				isAuthenticated,
				currentGroupRole,
				setCurrentGroupRole,
				setUser,
				setGroups,
				setCurrentGroupId,
				logout,
				checkAuth
			}}
		>
			{children}
		</AuthContext.Provider>
	)
}
