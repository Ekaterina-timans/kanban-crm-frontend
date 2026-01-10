import { ISpaceProjectProps } from '@/types/space.types'

import { useDeleteSpace } from '@/hooks/space/useDeleteSpace'

import { CardInfoProject } from './CardInfoProject'

export function ListCardsProjects({
	spaces,
	selectedSpaceId,
	onSelectSpace
}: ISpaceProjectProps) {
	const { deleteSpace } = useDeleteSpace()

	if (!spaces.length) {
		return <div></div>
	}

	const handleDelete = (spaceId: string) => {
		if (confirm('Удалить это пространство?')) {
			deleteSpace(spaceId)
		}
	}

	return (
		<div className='mt-4 w-100 flex-1 px-0.5'>
			{spaces.map(item => (
				<CardInfoProject
					key={item.id}
					item={item}
					onSelectSpace={onSelectSpace}
					onDelete={handleDelete}
					active={String(item.id) === String(selectedSpaceId)}
				/>
			))}
		</div>
	)
}
