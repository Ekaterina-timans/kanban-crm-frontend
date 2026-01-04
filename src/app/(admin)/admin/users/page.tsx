'use client'

import { Search } from 'lucide-react'
import { useMemo, useState } from 'react'

import {
	UserRow,
	getUsersColumns
} from '@/components/admin-users/users-table-columns'
import { buttonVariants } from '@/components/ui/button/Button'
import Field from '@/components/ui/field/Field'
import {
	Pagination,
	PaginationContent,
	PaginationItem,
	PaginationNext,
	PaginationPrevious
} from '@/components/ui/pagination/pagination'
import { SelectComponent } from '@/components/ui/select/SelectComponent'
import { DataTable } from '@/components/ui/table/DataTable'

import {
	useAdminUsers,
	useBlockAdminUser,
	useDeleteAdminUser,
	useUnblockAdminUser
} from '@/hooks/admin/useAdminUsers'

import { cn } from '@/lib/utils'

type StatusFilter = 'all' | 'active' | 'blocked'

export default function AdminUsersPage() {
	const [q, setQ] = useState('')
	const [status, setStatus] = useState<StatusFilter>('all')
	const [page, setPage] = useState(1)

	const params = useMemo(() => {
		return {
			q: q.trim() || undefined,
			status: status === 'all' ? undefined : status,
			page
		}
	}, [q, status, page])

	const { data, isLoading } = useAdminUsers(params)

	const blockMutation = useBlockAdminUser()
	const unblockMutation = useUnblockAdminUser()
	const deleteMutation = useDeleteAdminUser()

	const users: UserRow[] = data?.data ?? []
	const meta = data?.meta

	const columns = useMemo(() => {
		return getUsersColumns({
			blockMutation,
			unblockMutation,
			deleteMutation
		})
	}, [blockMutation, unblockMutation, deleteMutation])

	return (
		<div className='space-y-6'>
			<h1 className='text-2xl font-semibold'>Пользователи</h1>

			{/* Filters */}
			<div className='grid gap-3 md:grid-cols-3'>
				<Field
					value={q}
					onChange={e => {
						setQ(e.target.value)
						setPage(1)
					}}
					placeholder='Поиск по email или имени'
					Icon={Search}
				/>

				<SelectComponent
					placeholder='Статус'
					selectedValue={status}
					onChange={value => {
						setStatus(value as StatusFilter)
						setPage(1)
					}}
					options={[
						{ value: 'all', label: 'Все' },
						{ value: 'active', label: 'Активные' },
						{ value: 'blocked', label: 'Заблокированные' }
					]}
				/>
			</div>

			{/* Table */}
			<DataTable
				columns={columns}
				data={users}
				isLoading={isLoading}
			/>

			{/* Pagination */}
			{meta && meta.last_page > 1 && (
				<Pagination>
					<PaginationContent>
						<PaginationItem>
							<button
								className={cn(
									buttonVariants({ variant: 'ghost', size: 'default' })
								)}
								onClick={() => setPage(p => Math.max(1, p - 1))}
								disabled={page <= 1}
							>
								<PaginationPrevious />
							</button>
						</PaginationItem>

						{Array.from({ length: meta.last_page })
							.slice(0, 7)
							.map((_, i) => {
								const pageNumber = i + 1
								return (
									<PaginationItem key={pageNumber}>
										<button
											className={cn(
												buttonVariants({
													variant: page === pageNumber ? 'outline' : 'ghost',
													size: 'icon'
												})
											)}
											onClick={() => setPage(pageNumber)}
										>
											{pageNumber}
										</button>
									</PaginationItem>
								)
							})}

						<PaginationItem>
							<button
								className={cn(
									buttonVariants({ variant: 'ghost', size: 'default' })
								)}
								onClick={() => setPage(p => Math.min(meta.last_page, p + 1))}
								disabled={page >= meta.last_page}
							>
								<PaginationNext />
							</button>
						</PaginationItem>
					</PaginationContent>
				</Pagination>
			)}
		</div>
	)
}
