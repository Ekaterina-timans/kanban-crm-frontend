'use client'

import { useState } from 'react'

import { PeriodSelect } from '@/components/ui/period-select/PeriodSelect'
import { PeriodParams } from '@/components/ui/period-select/period'

import { useGroupTeamHours } from '@/hooks/statistics/useGroupStatistics'
import { SkeletonWidget } from '@/components/ui/skeleton/SkeletonWidget'

const WEEKDAY_MAP: Record<string, string> = {
  Mon: 'Пн',
  Tue: 'Вт',
  Wed: 'Ср',
  Thu: 'Чт',
  Fri: 'Пт',
  Sat: 'Сб',
  Sun: 'Вс'
}

function intensityClass(value: number, max: number): string {
  if (max === 0 || value === 0) return 'bg-gray-50'
  const ratio = value / max

  if (ratio > 0.75) return 'bg-blue-700 text-white'
  if (ratio > 0.5) return 'bg-blue-500 text-white'
  if (ratio > 0.25) return 'bg-blue-300 text-gray-900'

  return 'bg-blue-100 text-gray-800'
}

export function GroupTeamHoursHeatmap() {
  const [period, setPeriod] = useState<PeriodParams>({ period: 'week' })

  const { data, isLoading } = useGroupTeamHours(period)

  if (isLoading) {
    return <SkeletonWidget type="card" />
  }

  if (!data) {
    return (
      <div className="bg-white border rounded-lg p-4 shadow-sm">
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-lg font-semibold text-blue-600">
            Рабочие часы команды
          </h3>
          <PeriodSelect value={period} onChange={setPeriod} />
        </div>
        <p className="text-sm text-gray-500 text-center py-6">Нет данных</p>
      </div>
    )
  }

  const { matrix, weekdays, hours } = data

  const flatMax = Math.max(0, ...matrix.flat().map(v => Number(v) || 0))

  return (
    <div className="bg-white border rounded-lg p-4 shadow-sm">
      <div className="flex justify-between items-center mb-3">
        <h3 className="text-lg font-semibold text-blue-600">
          Рабочие часы команды
        </h3>
        <PeriodSelect value={period} onChange={setPeriod} />
      </div>

      <p className="text-xs text-gray-500 mb-3">
        Интенсивность активности по дням недели и часам.
      </p>

      <div className="overflow-auto">
        <table className="text-[10px] border-collapse">
          <thead>
            <tr>
              <th className="px-2 py-1 text-left text-gray-500">День / час</th>
              {hours.map(h => (
                <th
                  key={h}
                  className="px-1 py-1 text-center text-gray-400 min-w-[20px]"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {matrix.map((row, w) => {
              const english = weekdays[w]
              const russian = WEEKDAY_MAP[english] ?? english

              return (
                <tr key={w}>
                  <td className="px-2 py-1 text-gray-500 whitespace-nowrap">
                    {russian}
                  </td>

                  {row.map((value, h) => (
                    <td
                      key={h}
                      className={`px-1 py-1 text-center align-middle ${intensityClass(
                        value,
                        flatMax
                      )} cursor-default`}
                      title={`${russian}, ${h}:00 — событий: ${value}`}
                    >
                      {value > 0 ? value : ''}
                    </td>
                  ))}
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      <div className="mt-3 text-xs text-gray-500">
        Чем темнее ячейка, тем больше активности в это время.
      </div>
    </div>
  )
}
