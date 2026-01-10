'use client'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { usePathname } from 'next/navigation'
import NProgress from 'nprogress'
import { PropsWithChildren, useEffect, useState } from 'react'

import { AppLoader } from '@/components/ui/loader/AppLoader'

import { AuthProvider } from '@/providers/AuthProvider'

export function Providers({ children }: PropsWithChildren) {
	const [client] = useState(
		new QueryClient({
			defaultOptions: {
				queries: {
					refetchOnWindowFocus: false // при изменении внешнего фокуса на окне не производился лишний запрос
				}
			}
		})
	)

	const pathname = usePathname()

	useEffect(() => {
		NProgress.start()
		const timer = setTimeout(() => NProgress.done(), 500)
		return () => clearTimeout(timer)
	}, [pathname])

	// const DEBUG_LOADER = true

	return (
		<QueryClientProvider client={client}>
			{/* <AuthProvider>{DEBUG_LOADER ? <AppLoader /> : children}</AuthProvider> */}
			<AuthProvider>{children}</AuthProvider>
		</QueryClientProvider>
	)
}
