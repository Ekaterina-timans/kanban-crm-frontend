import { redirect } from 'next/navigation'

import { ADMIN_PAGES } from '@/config/admin-pages.config'

export default function AdminPage() {
	redirect(ADMIN_PAGES.STATISTICS)
}
