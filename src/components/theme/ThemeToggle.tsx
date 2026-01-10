'use client'

import { Moon, Sun } from 'lucide-react'
import { useEffect, useState } from 'react'

export function ThemeToggle() {
	const [theme, setTheme] = useState<'light' | 'dark'>('light')
	const [mounted, setMounted] = useState(false)

	useEffect(() => {
		setMounted(true)

		const isDark = document.documentElement.classList.contains('dark')
		setTheme(isDark ? 'dark' : 'light')
	}, [])

	const toggleTheme = () => {
		const next = theme === 'dark' ? 'light' : 'dark'
		setTheme(next)

		document.documentElement.classList.toggle('dark', next === 'dark')

		localStorage.setItem('theme', next)
	}

	if (!mounted) return null

	return (
		<button
			type='button'
			onClick={toggleTheme}
			className='relative mr-2 mb-1'
		>
			<Sun
				className={`
          absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2
          h-7 w-7
          transition-all duration-300
          ${theme === 'dark' ? 'scale-0 rotate-90 opacity-0' : 'scale-100 rotate-0 opacity-100'}
        `}
			/>

			<Moon
				className={`
          absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2
          h-7 w-7
          transition-all duration-300
          ${theme === 'dark' ? 'scale-100 rotate-0 opacity-100' : 'scale-0 -rotate-90 opacity-0'}
        `}
			/>
		</button>
	)
}
