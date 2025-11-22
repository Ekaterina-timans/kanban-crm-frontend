import {
	Sheet,
	SheetContent,
	SheetHeader,
	SheetTitle
} from '@/components/ui/sidebar/sheet'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

import { IColumn } from '@/types/column.types'
import { Permission } from '@/types/permission.enum'
import { ISpaceResponse } from '@/types/space.types'

import { Tab } from '@/store/useSettingsPanel'
import { useSpaceAccessStore } from '@/store/useSpaceAccessStore'

import { SpaceSettings } from './SpaceSettings'
import { ColumnLayout } from './settings-column/ColumnLayout'
import { RightsSettings } from './settings-user-rights/RightsSettings'

interface PanelSettingsProps {
	open: boolean
	onOpenChange: (open: boolean) => void
	spaceItems: ISpaceResponse
	columns: IColumn[]
	tab: Tab
	onTabChange: (tab: Tab) => void
}

export function PanelSettings({
	open,
	onOpenChange,
	spaceItems,
	columns,
	tab,
	onTabChange
}: PanelSettingsProps) {
	const access = useSpaceAccessStore(state => state.getAccess())
	const role = access?.role

	const canEditSpace = useSpaceAccessStore.getState().can(Permission.SPACE_EDIT)
	const canEditColumns = useSpaceAccessStore
		.getState()
		.can(Permission.COLUMN_EDIT)
	const canManageUsers = role === 'owner'

	return (
		<Sheet
			open={open}
			onOpenChange={onOpenChange}
		>
			<SheetContent
				side='right'
				className='w-[500px] sm:max-w-[500px]'
			>
				<SheetHeader>
					<SheetTitle>Настройки проекта</SheetTitle>
				</SheetHeader>

				<Tabs
					value={tab}
					onValueChange={v => onTabChange(v as Tab)}
					className='mt-4'
				>
					<TabsList className='mb-1 w-full flex'>
						{canEditSpace && (
							<TabsTrigger
								value='space'
								className='flex-1 text-center'
							>
								Пространство
							</TabsTrigger>
						)}
						{canEditColumns && (
							<TabsTrigger
								value='columns'
								className='flex-1 text-center'
							>
								Колонки
							</TabsTrigger>
						)}
						{canManageUsers && (
							<TabsTrigger
								value='users'
								className='flex-1 text-center'
							>
								Пользователи и права
							</TabsTrigger>
						)}
					</TabsList>

					{canEditSpace && (
						<TabsContent value='space'>
							<SpaceSettings items={spaceItems} />
						</TabsContent>
					)}
					{canEditColumns && (
						<TabsContent value='columns'>
							<ColumnLayout columns={columns} />
						</TabsContent>
					)}
					{canManageUsers && (
						<TabsContent value='users'>
							<RightsSettings spaceId={String(spaceItems.id)} />
						</TabsContent>
					)}
				</Tabs>
			</SheetContent>
		</Sheet>
	)
}
