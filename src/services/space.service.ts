import { ISpaceIdResponse, ISpaceResponse, ITaskFilters, TypeSpaceFormState } from '@/types/space.types'

import { axiosRequest } from '@/api/interceptors'

class SpaceService {
	private BASE_URL = '/spaces'

	async getSpaces(groupId: string) {
		const response = await axiosRequest.get<ISpaceResponse[]>(
			`${this.BASE_URL}?group_id=${groupId}`
		)
		return response
	}

	async createSpace(data: TypeSpaceFormState) {
		const requestData = {
			...data,
			group_id: data.groupId
		}
		const response = await axiosRequest.post(this.BASE_URL, requestData)
		return response
	}

	async getInfoSpace(spaceId: string, filters?: ITaskFilters): Promise<ISpaceIdResponse> {
		const params = new URLSearchParams()

		if (filters) {
			for (const [key, value] of Object.entries(filters)) {
				if (value === undefined || value === null) continue
				if (typeof value === 'string' && value.trim() === '') continue
				params.append(key, String(value))
			}
		}

		const url = params.toString()
			? `${this.BASE_URL}/${spaceId}?${params.toString()}`
			: `${this.BASE_URL}/${spaceId}`

		const response = await axiosRequest.get(url)
		const data = response.data

		return {
			...data,
			groupId: String(data.group_id),
			backgroundColor: data.background_color,
			backgroundImage: data.background_image,
			space_users: data.space_users,
			columns: data.columns ?? []
		}
	}

	async updateSpace(id: string, data: TypeSpaceFormState) {
		const formData = new FormData()

		if (data.name) formData.append('name', data.name)
		if (data.description) formData.append('description', data.description)

		if (data.backgroundColor && data.backgroundColor !== '') {
			formData.append('background_color', data.backgroundColor)
			formData.append('background_image', '')
		} else if (data.backgroundImage) {
			let fileToSend: File | null | undefined = undefined
			if (data.backgroundImage instanceof FileList) {
				fileToSend =
					data.backgroundImage.length > 0 ? data.backgroundImage[0] : undefined
			} else if (data.backgroundImage instanceof File) {
				fileToSend = data.backgroundImage
			}
			if (fileToSend) {
				formData.append('background_image', fileToSend)
			}
			formData.append('background_color', '')
		}

		const response = await axiosRequest.post(`${this.BASE_URL}/${id}`, formData)
		return response
	}

	async deleteSpace(spaceId: string) {
		const response = await axiosRequest.delete(`${this.BASE_URL}/${spaceId}`)
		return response
	}
}

export const spaceService = new SpaceService()
