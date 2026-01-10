import { useQuery } from '@tanstack/react-query'
import { useEffect, useMemo, useState } from 'react'

import { ISpaceIdResponse, ITaskFilters } from '@/types/space.types'

import { spaceService } from '@/services/space.service'

export function useSpaceId(key?: string | null, filters?: ITaskFilters) {
	const filtersKey = useMemo(() => JSON.stringify(filters ?? {}), [filters])

	const { data, isLoading } = useQuery({
		queryKey: ['spacesId', key, filtersKey],
		queryFn: () => {
			if (!key) {
				return Promise.reject(new Error('Key is undefined'))
			}
			return spaceService.getInfoSpace(key, filters)
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
