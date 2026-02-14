import { HistorySection } from './history-section/HistorySection'
import { IntegrationSection } from './integrations-section/IntegrationSection'
import { MembersSection } from './members-section/MembersSection'
import { SettingsSection } from './settings-section/SettingsSection'

interface AdminProps {
	active: 'members' | 'settings' | 'integration' | 'history'
}

export function MainAdmin({ active }: AdminProps) {
	return (
		<div className='p-8 overflow-auto'>
			{active === 'members' && <MembersSection />}
			{active === 'settings' && <SettingsSection />}
			{active === 'integration' && <IntegrationSection />}
			{active === 'history' && <HistorySection />}
		</div>
	)
}
