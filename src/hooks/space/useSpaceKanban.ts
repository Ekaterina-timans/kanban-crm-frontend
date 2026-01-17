import { useQuery } from '@tanstack/react-query'

import { ITaskFilters } from '@/types/space.types'

import { spaceService } from '@/services/space.service'

export function useSpaceKanban(
	spaceId?: string | null,
	filters?: ITaskFilters
) {
	return useQuery({
		queryKey: ['spaceKanban', spaceId, JSON.stringify(filters ?? {})],
		queryFn: () => {
			if (!spaceId) return Promise.reject(new Error('spaceId is undefined'))
			return spaceService.getInfoSpace(spaceId, filters)
		},
		enabled: !!spaceId,
		select: data => ({
			id: data.id,
			columns: data.columns ?? []
		}),
		// не очищаем колонки во время нового запроса
		placeholderData: prev => prev
	})
}
