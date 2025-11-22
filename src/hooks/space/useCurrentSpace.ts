import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useMemo, useState } from 'react'

import { useAuth } from '@/providers/AuthProvider'

export function useCurrentSpace() {
	const { user, currentGroupId } = useAuth()
	const search = useSearchParams()
	const router = useRouter()

	const lsKey = useMemo(() => {
		if (!user?.id || !currentGroupId) return null
		return `currentSpaceId:${user.id}:${currentGroupId}`
	}, [user?.id, currentGroupId])

	const [currentSpaceId, setCurrentSpaceId] = useState<string | null>(null)
	const [isReady, setIsReady] = useState(false)

	useEffect(() => {
		if (!lsKey) return

		const fromUrl = search?.get('space')
		if (fromUrl) {
			setCurrentSpaceId(fromUrl)
			localStorage.setItem(lsKey, fromUrl)
			setIsReady(true)
			return
		}

		const fromLs = localStorage.getItem(lsKey)
		setCurrentSpaceId(fromLs ?? null)
		setIsReady(true)
	}, [lsKey, search, router])

	const selectSpace = (spaceId: string | null) => {
		setCurrentSpaceId(spaceId)
		if (lsKey) {
			if (spaceId) localStorage.setItem(lsKey, spaceId)
			else localStorage.removeItem(lsKey)
		}
	}

	return { currentSpaceId, selectSpace, isReady }
}
