'use client'

import { Search } from 'lucide-react'
import { useMemo, useState } from 'react'

import Field from '@/components/ui/field/Field'
import { DataTable } from '@/components/ui/table/DataTable'
import { buttonVariants } from '@/components/ui/button/Button'
import {
	Pagination,
	PaginationContent,
	PaginationItem,
	PaginationNext,
	PaginationPrevious
} from '@/components/ui/pagination/pagination'

import { useAdminGroups, useDeleteAdminGroup } from '@/hooks/admin/useAdminGroups'
import { getGroupsColumns } from '@/components/admin-groups/groups-table-columns'

import { cn } from '@/lib/utils'

export default function AdminGroupsPage() {
	const [q, setQ] = useState('')
	const [page, setPage] = useState(1)

	const params = useMemo(() => {
		return {
			q: q.trim() || undefined,
			page
		}
	}, [q, page])

	const { data, isLoading } = useAdminGroups(params)
	const deleteMutation = useDeleteAdminGroup()

	const groups = data?.data ?? []
	const meta = data?.meta

	const columns = useMemo(() => {
		return getGroupsColumns({ deleteMutation })
	}, [deleteMutation])

	return (
		<div className='space-y-6'>
			<h1 className='text-2xl font-semibold'>Группы</h1>

			{/* Filters */}
			<div className='grid gap-3 md:grid-cols-3'>
				<Field
					value={q}
					onChange={e => {
						setQ(e.target.value)
						setPage(1)
					}}
					placeholder='Поиск по названию'
					Icon={Search}
				/>

				<div />

				<div className='flex items-center justify-end text-sm text-gray-500'>
					{meta ? (
						<span>
							Всего: {meta.total}
						</span>
					) : (
						<span>—</span>
					)}
				</div>
			</div>

			{/* Table */}
			<DataTable columns={columns} data={groups} isLoading={isLoading} />

			{/* Pagination */}
			{meta && meta.last_page > 1 && (
				<Pagination>
					<PaginationContent>
						<PaginationItem>
							<button
								className={cn(buttonVariants({ variant: 'ghost', size: 'default' }))}
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
								className={cn(buttonVariants({ variant: 'ghost', size: 'default' }))}
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
