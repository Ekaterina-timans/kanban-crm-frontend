import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { Toaster } from 'react-hot-toast'

import { SITE_NAME } from '@/config/seo.constants'

import './globals.scss'
import { Providers } from './providers'

const geistSans = Geist({
	variable: '--font-geist-sans',
	subsets: ['latin']
})

const geistMono = Geist_Mono({
	variable: '--font-geist-mono',
	subsets: ['latin']
})

export const metadata: Metadata = {
	title: {
		default: SITE_NAME, // по умолчанию название сайта
		template: `%s | ${SITE_NAME}` // наследуется для других страниц
	},
	description: '' // описание сайта
}

export default function RootLayout({
	children
}: Readonly<{
	children: React.ReactNode
}>) {
	return (
		<html lang='en'>
			<body
				className={`${geistSans.variable} ${geistMono.variable} antialiased`}
			>
				<Providers>
					<main className='min-h-screen'>{children}</main>
					<Toaster
						position='top-center'
						toastOptions={{
							className: '',
							duration: 5000,
							removeDelay: 1000,
							style: {
								background: '#f0f9ff',
								color: '#2563eb',
								border: '1px solid #bae6fd',
								borderRadius: '8px',
								padding: '10px',
								fontSize: '1rem',
								display: 'flex',
								alignItems: 'center',
								gap: '8px'
							},
							success: {
								duration: 3000,
								iconTheme: {
									primary: 'green',
									secondary: 'white'
								},
								style: {
									background: '#ecfdf5',
									color: '#15803d',
									border: '1px solid #bbf7d0',
									boxShadow: '0 2px 8px 0 rgba(16, 185, 129, 0.05)',
									borderRadius: '8px',
									padding: '10px',
									fontSize: '1rem',
									display: 'flex',
									alignItems: 'center',
									gap: '8px'
								}
							},
							error: {
								duration: 3000,
								iconTheme: {
									primary: 'red',
									secondary: 'white'
								},
								style: {
									background: '#fef2f2',
									color: '#dc2626',
									border: '1px solid #fecaca',
									fontWeight: 700,
									borderRadius: '8px',
									padding: '10px',
									fontSize: '1rem',
									display: 'flex',
									alignItems: 'center',
									gap: '8px'
								}
							}
						}}
					/>
				</Providers>
			</body>
		</html>
	)
}
