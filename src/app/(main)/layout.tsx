'use client'

import { PropsWithChildren, useEffect, useState } from 'react'

import { CreateGroupModal } from '@/components/groups/CreateGroupModal'
import { Header } from '@/components/header/Header'

import { useAuth } from '@/providers/AuthProvider'
import { useRouter } from 'next/navigation'

export default function Layout({ children }: PropsWithChildren<unknown>) {
	const { isAuthenticated, groups, user } = useAuth()
	const [showModal, setShowModal] = useState(false)
	const router = useRouter()

	useEffect(() => {
		if (user?.access_level === 'admin') {
			router.replace('/admin')
		}
	}, [user, router])

	useEffect(() => {
		if (!isAuthenticated) return

		if (user?.access_level === 'user' && groups.length === 0) {
			setShowModal(true)
		} else {
			setShowModal(false)
		}
	}, [isAuthenticated, groups, user])

	return (
		<div>
			<Header />
			{children}
			<CreateGroupModal
				isOpen={showModal}
				onClose={() => setShowModal(false)}
			/>
		</div>
	)
}
