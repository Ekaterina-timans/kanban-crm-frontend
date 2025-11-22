'use client'

import { useQuery } from '@tanstack/react-query'
import { useEffect } from 'react'

import { useSpaceAccessStore } from '@/store/useSpaceAccessStore'

import { spaceUserService } from '@/services/space-user.service'

export function useFetchSpaceRole(spaceId: string) {
	const { setAccess, setCurrentSpace } = useSpaceAccessStore()

	const { data, isLoading, isError } = useQuery({
		queryKey: ['space-role', spaceId],
		queryFn: () => spaceUserService.getMyRole(spaceId),
		enabled: !!spaceId
	})

	useEffect(() => {
		if (!data) return

		// Универсальное приведение к массиву строк
		const permissions = Array.isArray(data.permissions)
			? data.permissions
			: Object.values(data.permissions || {})

		setAccess(spaceId, data.role, permissions)
		setCurrentSpace(spaceId)

		// Если это "виртуальный владелец" — можно добавить метку (опционально)
		if (data.virtual) {
			console.log(
				`Админ группы имеет виртуальную роль владельца для space ${spaceId}`
			)
		}
	}, [data, spaceId, setAccess, setCurrentSpace])

	return { data, isLoading, isError }
}
