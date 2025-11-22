import { CircleHelp, Settings } from 'lucide-react'

import { Tooltip } from '@/components/ui/tooltip/Tooltip'

interface IHeading {
	name: string
	description?: string
	onSettingsClick?: () => void
	canOpenSettings?: boolean
}

export function HeaderProject({
	name,
	description,
	onSettingsClick,
	canOpenSettings = false
}: IHeading) {
	return (
		<>
			<div className='flex items-center'>
				<div className='flex mr-3'>
					<h1 className='text-3xl my-3 mx-5 font-medium'>{name}</h1>
					{description && (
						<Tooltip text={description}>
							<CircleHelp
								size={15}
								className='-ml-5 mt-2'
							/>
						</Tooltip>
					)}
				</div>
				{canOpenSettings && (
          <Settings
            size={30}
            className='cursor-pointer'
            onClick={onSettingsClick}
          />
        )}
			</div>
			<div className='h-0.5 bg-border w-full' />
		</>
	)
}
