'use client'

import { useEffect, useState } from 'react'

import { GlobalStatistics } from '@/components/statistics/general-statistics/GlobalStatistics'
import { PersonalStatistics } from '@/components/statistics/personal-statistics/PersonalStatistics'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

import { useAuth } from '@/providers/AuthProvider'

export function Statistics() {
	const { currentGroupRole } = useAuth()
	const [tab, setTab] = useState<'personal' | 'global'>('personal')

	useEffect(() => {
		if (currentGroupRole === 'member') {
			setTab('personal')
		}
	}, [currentGroupRole])

	if (currentGroupRole === 'member') {
		return (
			<div className='p-6'>
				<PersonalStatistics />
			</div>
		)
	}

	return (
		<div className="p-6">
      <Tabs value={tab} onValueChange={(v: any) => setTab(v)}>
        <div className="w-full flex justify-center mb-4">
          <TabsList className="px-2 py-1"
            style={{
              width: "100%",
              maxWidth: "500px",
              display: "flex",
              justifyContent: "center",
            }}
          >
            <TabsTrigger value="personal" className="flex-1">
              Личная статистика
            </TabsTrigger>
            <TabsTrigger value="global" className="flex-1">
              Общая статистика
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="personal">
          <PersonalStatistics />
        </TabsContent>

        <TabsContent value="global">
          <GlobalStatistics />
        </TabsContent>
      </Tabs>
    </div>
	)
}
