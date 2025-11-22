import { DataTable } from '@/components/ui/table/DataTable'

import { useUserGroupInvitations } from '@/hooks/group-invitations/useInvitations'

import { requestGroupsColumns } from './request-table-columns'

export function RequestGroups() {
	const { data, isLoading } = useUserGroupInvitations()

	if (isLoading) return <div>Загрузка...</div>

	return (
		<DataTable
			columns={requestGroupsColumns}
			data={data || []}
		/>
	)
}
