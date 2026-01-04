import { ADMIN_PAGES } from "@/config/admin-pages.config"
import { ColumnDef } from "@tanstack/react-table"
import Link from "next/link"
import Badge from "../ui/badge/Badge"

export type GroupRow = {
	group_id: number
	group_name: string
	role: string
	status: 'active' | 'blocked' | null
}

export const userGroupsColumns: ColumnDef<GroupRow>[] = [
    {
      accessorKey: 'group_name',
      header: 'Группа',
      cell: ({ row }) => (
        <Link
          href={`${ADMIN_PAGES.GROUPS}/${row.original.group_id}`}
          className='text-primary underline underline-offset-2'
        >
          {row.original.group_name}
        </Link>
      )
    },
    {
      accessorKey: 'role',
      header: 'Роль',
      cell: ({ row }) => <span className='capitalize'>{row.original.role}</span>
    },
    {
      accessorKey: 'status',
      header: 'Статус в группе',
      cell: ({ row }) => {
        const status = row.original.status

        if (!status) {
          return (
            <Badge
              text='—'
              color='default'
              size='small'
            />
          )
        }

        return (
          <Badge
            text={status === 'blocked' ? 'blocked' : 'active'}
            color={status === 'blocked' ? 'danger' : 'success'}
            size='small'
          />
        )
      }
    }
  ]