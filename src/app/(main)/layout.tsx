'use client'

import { PropsWithChildren, useEffect, useState } from 'react'

import { CreateGroupModal } from '@/components/groups/CreateGroupModal'
import { Header } from '@/components/header/Header'

import { useAuth } from '@/providers/AuthProvider'

export default function Layout({ children }: PropsWithChildren<unknown>) {
	const { isAuthenticated, groups } = useAuth()
	const [showModal, setShowModal] = useState(false)

	useEffect(() => {
		if (isAuthenticated && groups.length === 0) {
			setShowModal(true)
		} else {
			setShowModal(false)
		}
	}, [isAuthenticated, groups])

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
