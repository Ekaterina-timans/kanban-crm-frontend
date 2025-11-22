import { HistorySection } from './history-section/HistorySection'
import { MembersSection } from './members-section/MembersSection'
import { SettingsSection } from './settings-section/SettingsSection'

interface AdminProps {
	active: 'members' | 'settings' | 'history'
}

export function MainAdmin({ active }: AdminProps) {
	return (
		<div className='p-8 overflow-auto'>
			{active === 'members' && <MembersSection />}
			{active === 'settings' && <SettingsSection />}
			{active === 'history' && <HistorySection />}
		</div>
	)
}
