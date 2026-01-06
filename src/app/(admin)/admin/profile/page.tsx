'use client'

import { ProfileForm } from '@/components/profile/ProfileForm'

import {
	useAdminProfile,
	useUpdateAdminProfile
} from '@/hooks/admin/useAdminProfile'

export default function ProfileAdminPage() {
	const { data, isLoading } = useAdminProfile()
	const user = data?.user

	const { mutateAsync: updateProfile, isPending } = useUpdateAdminProfile()

	if (!user && !isLoading) {
		return (
			<div className='text-center text-slate-500 py-10'>Профиль не найден</div>
		)
	}

	return (
		<ProfileForm
			title='Профиль администратора'
			user={user!}
			isLoading={isLoading}
			isPending={isPending}
			onSubmit={async formData => {
				await updateProfile(formData)
			}}
		/>
	)
}
