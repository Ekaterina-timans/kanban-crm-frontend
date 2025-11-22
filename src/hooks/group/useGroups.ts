import { useQuery } from '@tanstack/react-query'
import { useEffect, useState } from 'react'

import { IGroup } from '@/types/group.types'
import { groupService } from '@/services/group.service'

export function useGroups() {
	const { data, isLoading } = useQuery({
		queryKey: ['groups'],
		queryFn: () => groupService.getGroups(),
	})

	const [groups, setGroups] = useState<IGroup[]>([])

	useEffect(() => {
		if (Array.isArray(data?.data)) {
			setGroups(data.data)
		} else if (Array.isArray(data)) {
			setGroups(data)
		} else {
			setGroups([])
		}
	}, [data])

	return { groups, setGroups, isLoading }
}
