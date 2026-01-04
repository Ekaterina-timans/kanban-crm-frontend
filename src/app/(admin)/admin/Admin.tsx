import { AdminSidebar } from "@/components/admin-sidebar/AdminSidebar";
import { ReactNode } from "react";

export function Admin({ children }: { children: ReactNode }) {
	return (
		<div className='min-h-screen bg-gray-50 text-gray-900'>
			<div className='flex'>
				<AdminSidebar />

				<main className='flex-1 p-6'>
					<div className='mx-auto w-full max-w-6xl'>{children}</div>
				</main>
			</div>
		</div>
	)
}