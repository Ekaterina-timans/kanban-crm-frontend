import { ColumnDef } from "@tanstack/react-table"
import { IGroupInvitation } from '@/types/group-invititations.types'
import { useAcceptGroupInvitation } from "@/hooks/group-invitations/useAcceptGroupInvitation"
import { useDeclineGroupInvitation } from "@/hooks/group-invitations/useDeclineGroupInvitation"

export const requestGroupsColumns: ColumnDef<IGroupInvitation>[] = [
  {
    accessorKey: "inviter",
    header: "Приглашающий",
    cell: ({ row }) => row.original.inviter?.name || row.original.inviter?.email,
  },
  {
    accessorKey: "group.name",
    header: "Наименование группы",
    cell: ({ row }) => row.original.group?.name,
  },
  {
    accessorKey: "group.description",
    header: "Описание группы",
    cell: ({ row }) => row.original.group?.description,
  },
  {
    id: "actions",
    header: "Запрос",
    cell: ({ row }) => {
      const { token, group } = row.original
      // Хуки должны быть ВНЕ render-функций! Так что вынеси в компонент ниже.
      return <RequestGroupActions token={token} groupName={group?.name ?? ''} />
    },
  },
]

// Кнопки отдельно, чтобы хуки работали правильно!
function RequestGroupActions({ token, groupName }: { token: string, groupName: string }) {
  const { acceptInvitation, isAccepting } = useAcceptGroupInvitation()
  const { declineInvitation, isDeclining } = useDeclineGroupInvitation()
  return (
    <div className="flex gap-2">
      <button
        className="px-2 py-1 bg-green-500 text-white rounded"
        onClick={() => acceptInvitation(token)}
        disabled={isAccepting || isDeclining}
      >
        Принять
      </button>
      <button
        className="px-2 py-1 bg-red-500 text-white rounded"
        onClick={() => declineInvitation(token)}
        disabled={isAccepting || isDeclining}
      >
        Отказать
      </button>
    </div>
  )
}
