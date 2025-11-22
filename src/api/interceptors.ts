import axios, { CreateAxiosDefaults } from 'axios'
import Cookies from 'js-cookie'
import toast from 'react-hot-toast'

export const API_URL_IMAGE = 'http://127.0.0.1:8000/storage/'

const options: CreateAxiosDefaults = {
	baseURL: 'http://127.0.0.1:8000/api',
	withCredentials: true
}

export const axiosRequest = axios.create(options)

axiosRequest.interceptors.request.use(async config => {
	// Проверяем метод и что это не внешний url
	const isProtectedMethod = ['post', 'put', 'patch', 'delete'].includes(
		(config.method || '').toLowerCase()
	)
	const isApiCall =
		config.url?.startsWith('/') ||
		config.url?.startsWith('http://127.0.0.1:8000')
	if (isProtectedMethod && isApiCall) {
		// Если нет XSRF-TOKEN, запрашиваем его у sanctum
		if (!Cookies.get('XSRF-TOKEN')) {
			await axios.get('http://127.0.0.1:8000/sanctum/csrf-cookie', {
				withCredentials: true
			})
		}
		// Берём токен из куки
		const xsrf = Cookies.get('XSRF-TOKEN')
		if (xsrf) {
			config.headers = config.headers || {}
			config.headers['X-XSRF-TOKEN'] = decodeURIComponent(xsrf)
		}
	}
	return config
})

axiosRequest.interceptors.response.use(
	response => response,
	error => {
		const status = error.response?.status
		const message = error.response?.data?.message

		if (status === 403 && message === 'You are blocked in this group') {
			localStorage.removeItem('currentGroupId')
			toast.error('Вы были заблокированы в этой группе')
			window.location.replace('/')
		}

		if (status === 403 && message === 'You are not a member of this group') {
			localStorage.removeItem('currentGroupId')
			toast.error('У вас больше нет доступа к этой группе')
			window.location.replace('/')
		}

		return Promise.reject(error)
	}
)
