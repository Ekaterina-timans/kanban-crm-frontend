import { useQuery } from '@tanstack/react-query'
import { useEffect, useState } from 'react'

import { ISpaceIdResponse } from '@/types/space.types'

import { spaceService } from '@/services/space.service'

export function useSpaceId(key?: string | null) {
	const { data, isLoading } = useQuery({
		queryKey: ['spacesId', key],
		queryFn: () => {
			if (!key) {
				return Promise.reject(new Error('Key is undefined'))
			}
			return spaceService.getInfoSpace(key)
		},
		enabled: !!key
	})

	const [items, setItems] = useState<ISpaceIdResponse | null>(null)

	useEffect(() => {
		if (data) {
			setItems(data)
		} else {
			setItems(null)
		}
	}, [data])

	return { items, setItems, isLoading }
}
