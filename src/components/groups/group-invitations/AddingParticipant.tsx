import { useForm } from 'react-hook-form'

import { Button } from '@/components/ui/button/Button'
import Field from '@/components/ui/field/Field'

import { useInviteToGroup } from '@/hooks/group-invitations/useInviteToGroup'
import { useAuth } from '@/providers/AuthProvider'

interface IAddParticipantForm {
	email: string
	role: 'admin' | 'member'
}

export function AddingParticipant() {
	const form = useForm<IAddParticipantForm>({
		mode: 'onChange',
		defaultValues: {
			role: 'member'
		}
	})

	const { inviteToGroup, isPending } = useInviteToGroup()
	const { currentGroupId } = useAuth()

	const onSubmit = form.handleSubmit(data => {
		if (!currentGroupId) return
		inviteToGroup({ group_id: String(currentGroupId), email: data.email, role: data.role })
		form.reset()
	})

	return (
		<form
			onSubmit={onSubmit}
			className='w-full max-w-sm mx-auto p-6'
		>
			<h2 className='text-xl mb-4 text-center'>Пригласить в группу</h2>
			<Field
				{...form.register('email', { required: 'Введите почту' })}
				placeholder='Введите почту'
				type='email'
				className='mb-4'
			/>
			<div className='mb-6'>
				<select
					{...form.register('role', { required: true })}
					className='w-full p-2 rounded border border-gray-300 focus:outline-none'
				>
					<option value='admin'>Админ</option>
					<option value='member'>Участник</option>
				</select>
			</div>
			<Button
				type='submit'
				className='w-full'
				disabled={isPending}
			>
				Отправить приглашение
			</Button>
		</form>
	)
}
