import { DataTable } from '@/components/ui/table/DataTable'

import { useGroupInvitations } from '@/hooks/group-invitations/useGroupInvitations'

import { invitationColumns } from './invitations-table-columns'
import { useAuth } from '@/providers/AuthProvider'

export function InvitationHistory() {
	const { currentGroupId } = useAuth()
	const { invitations, isLoading } = useGroupInvitations(currentGroupId)

	if (isLoading) return <div>Загрузка...</div>

	return (
		<DataTable
			columns={invitationColumns}
			data={invitations}
		/>
	)
}
