import { TypeTaskFormState } from '@/types/task.types'

import { axiosRequest } from '@/api/interceptors'

class TaskService {
	private BASE_URL = '/columns/tasks'
	private BASE_URL_TASK = '/tasks'

	/** Создание новой задачи */
	async createTask(data: TypeTaskFormState) {
		const response = await axiosRequest.post(this.BASE_URL, data)
		return response
	}

	/** Перемещение задачи в другую колонку */
	async updateTaskColumn(taskId: string, columnId: string) {
		const response = await axiosRequest.put(`${this.BASE_URL}/${taskId}`, {
			column_id: columnId
		})
		return response.data
	}

	/** Получить задачу */
	async getTask(taskId: string) {
		const response = await axiosRequest.get(`${this.BASE_URL_TASK}/${taskId}`)
		return response.data
	}

	/** Переименовать задачу */
	async renameTask(taskId: string, name: string) {
		const response = await axiosRequest.put(
			`${this.BASE_URL_TASK}/${taskId}/rename`,
			{ name }
		)
		return response.data
	}

	/** Обновить описание */
	async updateDescription(taskId: string, description: string | null) {
		const response = await axiosRequest.put(
			`${this.BASE_URL_TASK}/${taskId}/description`,
			{
				description
			}
		)
		return response.data
	}

	/** Обновить статус */
	async updateStatus(taskId: string, statusId: number) {
		const response = await axiosRequest.put(
			`${this.BASE_URL_TASK}/${taskId}/status`,
			{
				status_id: statusId
			}
		)
		return response.data
	}

	/** Обновить приоритет */
	async updatePriority(taskId: string, priorityId: number) {
		const response = await axiosRequest.put(
			`${this.BASE_URL_TASK}/${taskId}/priority`,
			{
				priority_id: priorityId
			}
		)
		return response.data
	}

	/** Обновить срок выполнения */
	async updateDueDate(taskId: string, dueDate: string | null) {
		const response = await axiosRequest.put(
			`${this.BASE_URL_TASK}/${taskId}/due-date`,
			{
				due_date: dueDate
			}
		)
		return response.data
	}

	/** Обновить ответственного */
	async updateAssignee(taskId: string, assigneeId: number | null) {
		const response = await axiosRequest.put(
			`${this.BASE_URL_TASK}/${taskId}/assignee`,
			{
				assignee_id: assigneeId
			}
		)
		return response.data
	}

	/** Удалить задачу */
	async deleteTask(taskId: string | number) {
		const response = await axiosRequest.delete(`${this.BASE_URL}/${taskId}`)
		return response.data
	}
}

export const taskService = new TaskService()
