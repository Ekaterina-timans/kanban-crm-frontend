'use client'

import { useState } from 'react'

import { PeriodSelect } from '@/components/ui/period-select/PeriodSelect'
import { PeriodParams } from '@/components/ui/period-select/period'

import { GroupWorkloadItemWithTotal } from '@/types/statistics.types'
import { useGroupWorkload } from '@/hooks/statistics/useGroupStatistics'
import { Progress } from '@/components/ui/progress/progress'
import { SkeletonWidget } from '@/components/ui/skeleton/SkeletonWidget'

export function GroupWorkloadWidget() {
  const [period, setPeriod] = useState<PeriodParams>({ period: 'week' })

  const { data, isLoading } = useGroupWorkload(period)

  if (isLoading || !data) {
    return <SkeletonWidget type="card" />
  }

  if (!data.length) {
    return (
      <div className="bg-white border rounded-lg p-4 shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-semibold text-blue-600">
            Загруженность участников
          </h3>
          <PeriodSelect value={period} onChange={setPeriod} />
        </div>
        <p className="text-sm text-gray-500">
          В группе нет данных по загруженности.
        </p>
      </div>
    )
  }

  // добавляем поле total = сумма всех метрик
  const itemsWithTotal: GroupWorkloadItemWithTotal[] = data.map(u => ({
    ...u,
    total: u.active_tasks + u.due_soon_tasks + u.checklist_active,
  }))

  // сортируем сверху самых загруженных
  const sorted = [...itemsWithTotal].sort((a, b) => b.total - a.total)
  const maxTotal = sorted[0]?.total || 1

  return (
    <div className="bg-white border rounded-lg p-4 shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-lg font-semibold text-blue-600">Загруженность участников</h3>

        <PeriodSelect value={period} onChange={setPeriod} />
      </div>

      <p className="text-xs text-gray-500 mb-2">
        Показаны все участники, у которых есть активные задачи, дедлайны или невыполненные чек-листы.
      </p>

      <div className="mt-2 max-h-56 overflow-y-auto space-y-3">
        {sorted.map(user => {
          const percent = (user.total / maxTotal) * 100

          return (
            <div
              key={user.user_id}
              className="flex flex-col gap-1 border rounded-md p-2"
            >
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-800 truncate">
                  {user.name}
                </span>

                <span className="text-xs text-gray-500">
                  Всего: <span className="font-semibold">{user.total}</span>
                </span>
              </div>

              <div className="flex items-center justify-between text-[11px] text-gray-600">
                <span>Активные: {user.active_tasks}</span>
                <span>Задачи сроком &lt; 7 дней: {user.due_soon_tasks}</span>
                <span>Пункты чек-листов: {user.checklist_active}</span>
              </div>

              <Progress
                value={percent}
                indicatorColor="bg-blue-500"
                className="h-2 mt-1"
              />
            </div>
          )
        })}
      </div>
    </div>
  )
}