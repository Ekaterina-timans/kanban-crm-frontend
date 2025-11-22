import { axiosRequest } from '@/api/interceptors'

class PermissionService {
	async getAll() {
		const response = await axiosRequest.get('/permissions')
		return response.data
	}
}

export const permissionService = new PermissionService()
