import { useQuery } from '@tanstack/react-query'
import { useEffect, useState } from 'react'

import { useAuth } from '@/providers/AuthProvider'

import { ISpaceResponse } from '@/types/space.types'

import { spaceService } from '@/services/space.service'

export function useSpaces() {
	const { currentGroupId } = useAuth()
	const { data, isLoading } = useQuery({
		queryKey: ['spaces', currentGroupId],
		queryFn: () => spaceService.getSpaces(currentGroupId!),
		enabled: !!currentGroupId
	})

	const [items, setItems] = useState<ISpaceResponse[]>([])

	useEffect(() => {
		if (Array.isArray(data?.data)) {
			setItems(data.data)
		} else {
			setItems([])
		}
	}, [data])

	return { items, setItems, isLoading }
}
