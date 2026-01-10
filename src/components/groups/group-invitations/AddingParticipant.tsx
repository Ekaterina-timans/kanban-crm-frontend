import { Controller, useForm } from 'react-hook-form'

import { Button } from '@/components/ui/button/Button'
import Field from '@/components/ui/field/Field'
import { SelectComponent } from '@/components/ui/select/SelectComponent'

import { useAuth } from '@/providers/AuthProvider'

import { useInviteToGroup } from '@/hooks/group-invitations/useInviteToGroup'

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

	const roleOptions = [
		{ value: 'admin', label: 'Админ' },
		{ value: 'member', label: 'Участник' }
	]

	const onSubmit = form.handleSubmit(data => {
		if (!currentGroupId) return
		inviteToGroup({
			group_id: String(currentGroupId),
			email: data.email,
			role: data.role
		})
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
				<Controller
					control={form.control}
					name='role'
					rules={{ required: true }}
					render={({ field }) => (
						<SelectComponent
							options={roleOptions}
							placeholder='Выберите роль'
							selectedValue={field.value}
							onChange={field.onChange}
							disabled={isPending}
						/>
					)}
				/>
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
