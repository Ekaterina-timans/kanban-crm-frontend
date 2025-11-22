'use client'

import { AtSign, KeyRound, User2 } from 'lucide-react'
import { Metadata } from 'next'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'

import { Button } from '@/components/ui/button/Button'
import Field from '@/components/ui/field/Field'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'

import { IAuthForm } from '@/types/auth.types'

import { NO_INDEX_PAGE } from '@/config/seo.constants'

import { useLogin, useRegister } from '@/hooks/auth/useAuth'

import authImage from '@/public/auth_2.png'
import { useSearchParams } from 'next/navigation'
import { useAcceptGroupInvitation } from '@/hooks/group-invitations/useAcceptGroupInvitation'

export const metadata: Metadata = {
	title: 'Auth',
	...NO_INDEX_PAGE
}

export function Auth() {
	const [tab, setTab] = useState<'login' | 'register'>('login')

	const form = useForm<IAuthForm>({
		mode: 'onChange'
	})

	const { mutate: login, isPending: isLoginLoading } = useLogin()
	const { mutate: register, isPending: isRegisterLoading } = useRegister()
	const { acceptInvitation, isAccepting } = useAcceptGroupInvitation()

	// --- Вот тут ловим invite ---
	const searchParams = useSearchParams()
	const invite = searchParams.get('invite')

	// Если есть invite, по дефолту открываем вкладку "Регистрация"
	useEffect(() => {
		if (invite) {
			setTab('register')
		}
	}, [invite])

	const onSubmit = form.handleSubmit(data => {
		if (tab === 'login') {
			login(data)
		} else {
			register(data, {
				onSuccess: () => {
					if (invite) {
						acceptInvitation(invite)
					}
				}
			})
		}
	})

	return (
		<div className='flex h-screen'>
			<div className='flex-1 flex items-center justify-center bg-gray-200'>
				<Image
					src={authImage}
					alt='Авторизация'
					width={500}
					height={500}
					className='object-contain'
				/>
			</div>
			<div className='flex flex-1 justify-center items-center bg-gray-100'>
				<div className='w-full flex flex-col justify-center items-center'>
					<div className='w-1/2 mb-3'>
						<Tabs
							value={tab}
							onValueChange={v => setTab(v as any)}
						>
							<TabsList className='w-full flex'>
								<TabsTrigger
									value='login'
									className='flex-1 text-center'
								>
									Вход
								</TabsTrigger>
								<TabsTrigger
									value='register'
									className='flex-1 text-center'
								>
									Регистрация
								</TabsTrigger>
							</TabsList>
						</Tabs>
					</div>
					<div className='w-1/2 m-auto shadow bg-gray-200 rounded-xl p-6'>
						<form onSubmit={onSubmit}>
							<h1 className='text-2xl mb-5 text-center'>
								{tab === 'login' ? 'Вход' : 'Регистрация'}
							</h1>
							<Field
								{...form.register('email', { required: true })}
								placeholder='Введите почту'
								Icon={AtSign}
								type='email'
								className='mb-4'
							/>
							<Field
								{...form.register('password', {
									required: true,
									minLength: 6
								})}
								placeholder='Введите пароль'
								type='password'
								Icon={KeyRound}
								className='mb-10'
							/>
							<Button
								disabled={tab === 'login' ? isLoginLoading : isRegisterLoading}
								className='w-full'
							>
								{tab === 'login' ? 'Войти' : 'Зарегистрироваться'}
							</Button>
						</form>
					</div>
				</div>
			</div>
		</div>
	)
}
