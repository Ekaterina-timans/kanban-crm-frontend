'use client'

import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

import { useAuth } from '@/providers/AuthProvider'

import { AdminPanel } from './AdminPanel'

export default function AdminPanelPage() {
	const { currentGroupRole } = useAuth()
	const router = useRouter()

	useEffect(() => {
		if (currentGroupRole === 'member') {
			router.replace('/projects')
		}
	}, [currentGroupRole, router])

	if (currentGroupRole === null) return null

	if (currentGroupRole === 'admin') {
		return <AdminPanel />
	}

	return null
}
