import { IAuthResponse } from '@/types/auth.types'

import { axiosRequest } from '@/api/interceptors'

class AuthService {
	async register(data: { email: string; password: string }) {
		const response = await axiosRequest.post<IAuthResponse>('/register', data)
		return response
	}

	async login(data: { email: string; password: string }) {
		const response = await axiosRequest.post<IAuthResponse>('/login', data)
		return response
	}

	async getProfile() {
		const response = await axiosRequest.get<IAuthResponse>('/user')
		return response.data
	}

	async logout() {
		await axiosRequest.post('/logout', {})
	}
}

export const authService = new AuthService()
