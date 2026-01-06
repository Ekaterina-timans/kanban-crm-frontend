import toast from 'react-hot-toast'

import { ProfileForm } from '@/components/profile/ProfileForm'

import { useRefreshUser } from '@/hooks/user/useRefreshUser'
import { useUpdateUserProfile } from '@/hooks/user/useUpdateUserProfile'
import { useUserProfile } from '@/hooks/user/useUserProfile'

export function Profile() {
	const { data: user, isLoading } = useUserProfile()
	const { mutateAsync: updateProfile, isPending } = useUpdateUserProfile()
	const { refreshUser } = useRefreshUser()

	if (!user && !isLoading) {
		return (
			<div className='text-center text-slate-500 py-10'>Профиль не найден</div>
		)
	}

	return (
		<ProfileForm
			title='Профиль пользователя'
			user={user!}
			isLoading={isLoading}
			isPending={isPending}
			onSubmit={async formData => {
				await updateProfile(formData)
				refreshUser()
			}}
		/>
	)
}
