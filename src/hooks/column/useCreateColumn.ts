import { columnService } from "@/services/column.service"
import { TypeColumnFormState } from "@/types/column.types"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import toast from "react-hot-toast"

export function useCreateColumn() {
  const queryClient = useQueryClient()

	const { mutate: createColumn } = useMutation({
		mutationKey: ['create column'],
		mutationFn: (data: TypeColumnFormState) => columnService.createColumn(data),
		onSuccess() {
			queryClient.invalidateQueries({
				queryKey: ['spacesId']
			})
			toast.success('Колонка успешно создана!')
		},
		onError(error: any) {
      toast.error(`Ошибка создания: ${error?.message || 'Что-то пошло не так'}`)
    }
	})

	return { createColumn }
}