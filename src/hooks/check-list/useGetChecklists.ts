import { useQuery } from '@tanstack/react-query'

import { checklistService } from '@/services/checklist.service'

export function useGetChecklists(taskId?: string) {
	const { data, isLoading, error, refetch } = useQuery({
		queryKey: ['checklists', taskId],
		queryFn: () => checklistService.getChecklists(taskId!),
		enabled: !!taskId,
		retry: false
	})

	return {
		checklists: data ?? [],
		isLoading,
		error,
		refetch
	}
}
