import { axiosRequest } from '@/api/interceptors'

class ChecklistService {
	private BASE_URL = '/tasks'

	/** Получить все чек-листы по задаче */
	async getChecklists(taskId: string | number) {
		const response = await axiosRequest.get(
			`${this.BASE_URL}/${taskId}/checklists`
		)
		return response.data
	}

	/** Создать чек-лист в задаче */
	async createChecklist(taskId: string | number, title: string) {
		const response = await axiosRequest.post(
			`${this.BASE_URL}/${taskId}/checklists`,
			{ title }
		)
		return response.data
	}

	/** Обновить чек-лист (например, переименовать) */
	async updateChecklist(checklistId: string | number, data: { title: string }) {
		const response = await axiosRequest.put(`/checklists/${checklistId}`, data)
		return response.data
	}

	/** Удалить чек-лист */
	async deleteChecklist(checklistId: string | number) {
		const response = await axiosRequest.delete(`/checklists/${checklistId}`)
		return response.data
	}

	/** Добавить пункт в чек-лист */
	async createChecklistItem(
		checklistId: string | number,
		data: { name: string; assignee_id?: number; due_date?: string }
	) {
		const response = await axiosRequest.post(
			`/checklists/${checklistId}/items`,
			data
		)
		return response.data
	}

	/** Обновить пункт чек-листа (например, сменить статус, ответственного, дату) */
	async updateChecklistItem(
		itemId: string | number,
		data: {
			name?: string
			assignee_id?: number
			completed?: boolean
			due_date?: string
		}
	) {
		const response = await axiosRequest.put(`/checklist-items/${itemId}`, data)
		return response.data
	}

	/** Удалить пункт чек-листа */
	async deleteChecklistItem(itemId: string | number) {
		const response = await axiosRequest.delete(`/checklist-items/${itemId}`)
		return response.data
	}
}

export const checklistService = new ChecklistService()
