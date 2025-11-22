import { IColumnPosition, TypeColumnFormState } from '@/types/column.types'

import { axiosRequest } from '@/api/interceptors'

class ColumnService {
	private BASE_URL = '/columns'

	async createColumn(data: TypeColumnFormState) {
		const response = await axiosRequest.post(this.BASE_URL, data)
		return response
	}

	async updateColumn(id: string, data: TypeColumnFormState) {
		const response = await axiosRequest.put(`${this.BASE_URL}/${id}`, data)
		return response
	}

	async updateColumnsOrder(data: IColumnPosition[]) {
		const response = await axiosRequest.post(`${this.BASE_URL}/update-order`, {
			columns: data
		})
		return response
	}

	async deleteColumn(id: string) {
		const response = await axiosRequest.delete(`${this.BASE_URL}/${id}`)
		return response
	}
}

export const columnService = new ColumnService()
