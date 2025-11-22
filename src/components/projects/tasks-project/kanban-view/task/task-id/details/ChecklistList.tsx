import { Plus, Trash2 } from 'lucide-react'

import { Button } from '@/components/ui/button/Button'
import { CalendarComponent } from '@/components/ui/calendar/CalendarComponent'
import Field from '@/components/ui/field/Field'
import { Progress } from '@/components/ui/progress/progress'
import { SelectComponent } from '@/components/ui/select/SelectComponent'

import { IChecklist } from '@/types/checklist.types'

import { formatDateForCard } from '@/utils/date-utils'

interface ChecklistListProps {
	checklists: IChecklist[]
	onAddChecklist: () => void
	onAddItem: (listId: number) => void
	onDeleteItem: (listId: number, itemId: number) => void
	onToggleItem: (listId: number, itemId: number, completed: boolean) => void
	onUpdateItemName: (listId: number, itemId: number, name: string) => void
	onChangeDate: (listId: number, itemId: number, date: Date) => void
	onChangeAssignee: (listId: number, itemId: number, userId: string) => void
	onUpdateChecklist: (checklistId: number, title: string) => void
	onDeleteChecklist: (checklistId: number) => void
	users: any[]
	canEditTask: boolean
}

export const ChecklistList = ({
	checklists,
	onAddChecklist,
	onAddItem,
	onDeleteItem,
	onToggleItem,
	onUpdateItemName,
	onChangeDate,
	onChangeAssignee,
	onUpdateChecklist,
	onDeleteChecklist,
	users,
	canEditTask
}: ChecklistListProps) => {
	const assigneeOptions = [
		{ value: 'none', label: 'Не назначен' },
		...users.map((u: any) => ({
			value: String(u.user.id),
			label: u.user.name || u.user.email
		}))
	]

	return (
		<div className='space-y-4 mb-1'>
			<div className='flex justify-between items-center'>
				<h3 className='font-semibold text-blue-600'>Чек-листы</h3>
				{canEditTask && (
					<Button
						onClick={onAddChecklist}
						size='sm'
						variant='outline'
						className='text-blue-600 border-blue-400'
					>
						+ Добавить чек-лист
					</Button>
				)}
			</div>

			{checklists.map(list => {
				const total = list.items?.length || 0
				const completed = list.items?.filter(i => i.completed).length || 0
				const progress = total > 0 ? (completed / total) * 100 : 0

				return (
					<div
						key={list.id}
						className='border rounded-lg p-3 space-y-3 bg-white'
					>
						<div className='flex justify-between items-center'>
							<Field
								defaultValue={list.title || 'Новый чек-лист'}
								placeholder='Название чек-листа'
								className='font-medium border-none bg-transparent text-lg focus-visible:ring-0 w-full'
								readOnly={!canEditTask}
								onBlur={e => {
									const newTitle = e.target.value.trim()
									if (newTitle && newTitle !== list.title) {
										onUpdateChecklist(list.id, newTitle)
									}
								}}
							/>

							{canEditTask && (
								<div className='flex items-center gap-2 ml-2'>
									<Button
										variant='ghost'
										size='icon'
										className='text-red-500 hover:text-red-600'
										onClick={() => onDeleteChecklist(list.id)}
									>
										<Trash2 className='w-5 h-5' />
									</Button>

									<Button
										variant='outline'
										className='text-blue-600 border-blue-400 flex items-center gap-1'
										onClick={() => onAddItem(list.id)}
									>
										<Plus className='w-4 h-4' /> Пункт
									</Button>
								</div>
							)}
						</div>

						{/* Прогресс */}
						{total > 0 && (
							<div>
								<Progress
									value={progress}
									className='h-2 bg-blue-100 [&>div]:bg-blue-500'
								/>
								<p className='text-sm text-blue-600 mt-1'>
									{completed} из {total} выполнено
								</p>
							</div>
						)}

						{/* Список пунктов */}
						<div className='space-y-2 mt-2'>
							{list.items && list.items.length > 0 ? (
								list.items.map(item => (
									<div
										key={item.id}
										className='border rounded-md p-2 space-y-2'
									>
										{/* Первая строка: чекбокс + название */}
										<div className='flex items-center gap-2'>
											<input
												type='checkbox'
												checked={item.completed}
												disabled={!canEditTask}
												onChange={e =>
													onToggleItem(list.id, item.id, e.target.checked)
												}
												className='h-4 w-4 accent-blue-600'
											/>
											<Field
												defaultValue={item.name || 'Новый пункт'}
												readOnly={!canEditTask}
												className={`border-none bg-transparent text-sm w-full focus-visible:ring-0 ${
													item.completed ? 'line-through text-gray-400' : ''
												}`}
												onBlur={e => {
													if (!canEditTask) return
													const newName = e.target.value.trim()
													if (newName && newName !== item.name) {
														onUpdateItemName(list.id, item.id, newName)
													}
												}}
											/>
										</div>

										<div className='flex items-center gap-2 justify-start pl-6'>
											<div className='w-[150px] flex-shrink-0'>
												<CalendarComponent
													placeholder={
														item.due_date
															? formatDateForCard(item.due_date)
															: 'Дата'
													}
													onDateChange={date =>
														onChangeDate(list.id, item.id, date)
													}
													disabled={!canEditTask}
												/>
											</div>

											<div className='flex-1'>
												<SelectComponent
													options={assigneeOptions}
													placeholder='Ответственный'
													selectedValue={String(item.assignee_id || 'none')}
													onChange={val =>
														onChangeAssignee(list.id, item.id, val)
													}
													className='w-full'
													disabled={!canEditTask}
												/>
											</div>

											{canEditTask && (
												<Button
													variant='ghost'
													size='icon'
													onClick={() => onDeleteItem(list.id, item.id)}
												>
													<Trash2 className='w-5 h-5 text-red-500' />
												</Button>
											)}
										</div>
									</div>
								))
							) : (
								<p className='text-sm text-gray-400 italic'>Пока нет пунктов</p>
							)}
						</div>
					</div>
				)
			})}
		</div>
	)
}
