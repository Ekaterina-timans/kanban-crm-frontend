'use client'

import { useRouter } from 'next/navigation'
import { PropsWithChildren, useEffect } from 'react'

import { useAuth } from '@/providers/AuthProvider'

import { DASHBOARD_PAGES } from '@/config/page.url.config'

import { Admin } from './admin/Admin'

export default function AdminLayout({ children }: PropsWithChildren<unknown>) {
	const { isAuthenticated, user } = useAuth()
	const router = useRouter()

	useEffect(() => {
		// Если нет авторизации — на страницу auth
		if (!isAuthenticated) {
			router.replace('/auth')
			return
		}

		// Если авторизован, но не admin — в обычный dashboard
		if (user?.access_level !== 'admin') {
			router.replace(DASHBOARD_PAGES.STATISTICS)
		}
	}, [isAuthenticated, user, router])

	// Пока выполняется редирект — ничего не рисуем
	if (!isAuthenticated || user?.access_level !== 'admin') {
		return null
	}

	return <Admin>{children}</Admin>
}
