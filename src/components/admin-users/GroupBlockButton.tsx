import { Button } from '@/components/ui/button/Button'
import {
	useBlockUserInGroup,
	useUnblockUserInGroup
} from '@/hooks/admin/useAdminUsers'

type GroupBlockProps = {
	userId: number
	groupId: number
	status: 'active' | 'blocked' | null
}

export function GroupBlockButton({ userId, groupId, status }: GroupBlockProps) {
	const blockMutation = useBlockUserInGroup()
	const unblockMutation = useUnblockUserInGroup()

	const isBlocked = status === 'blocked'
	const isPending = blockMutation.isPending || unblockMutation.isPending

	if (isBlocked) {
		return (
			<Button
				variant='secondary'
				size='sm'
				onClick={() => unblockMutation.mutate({ userId, groupId })}
				disabled={isPending}
			>
				Разблокировать
			</Button>
		)
	}

	return (
		<Button
			variant='secondary'
			size='sm'
			onClick={() => blockMutation.mutate({ userId, groupId })}
			disabled={isPending}
		>
			Заблокировать
		</Button>
	)
}
