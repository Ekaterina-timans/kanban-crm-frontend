import { useQuery } from '@tanstack/react-query'

import { spaceService } from '@/services/space.service'

export function useSpaceMeta(spaceId?: string | null) {
	return useQuery({
		queryKey: ['spaceMeta', spaceId],
		queryFn: () => {
			if (!spaceId) return Promise.reject(new Error('spaceId is undefined'))
			// запрос без фильтров
			return spaceService.getInfoSpace(spaceId)
		},
		enabled: !!spaceId,
		select: data => ({
			id: data.id,
			name: data.name,
			description: data.description,
			backgroundColor: data.backgroundColor,
			backgroundImage: data.backgroundImage
		})
	})
}
