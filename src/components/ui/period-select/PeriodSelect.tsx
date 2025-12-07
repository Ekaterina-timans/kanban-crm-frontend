'use client'

import { ChevronDown } from 'lucide-react'

import { formatDateForCard } from '@/utils/date-utils'
import { Button } from '../button/Button'
import { Calendar } from '../calendar/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '../calendar/popover'

import { PeriodParams, PeriodPreset } from './period'
import { cn } from '@/lib/utils'

interface PeriodSelectProps {
  value?: PeriodParams
  onChange: (value: PeriodParams) => void
}

const PRESETS = [
  { label: 'Сегодня', value: 'today' as PeriodPreset },
  { label: 'Неделя', value: 'week' as PeriodPreset },
  { label: 'Месяц', value: 'month' as PeriodPreset },
  { label: 'Квартал', value: 'quarter' as PeriodPreset },
  { label: 'Год', value: 'year' as PeriodPreset },
  { label: 'Диапазон', value: 'range' as PeriodPreset }
] as const

export function PeriodSelect({
  value = { period: 'month' },
  onChange
}: PeriodSelectProps) {
  const currentPreset =
    PRESETS.find(p => p.value === value.period) ?? PRESETS[2]

  const label =
    value.period !== 'range'
      ? currentPreset.label
      : value.date_from && value.date_to
        ? `${formatDateForCard(value.date_from)} — ${formatDateForCard(
            value.date_to
          )}`
        : value.date_from
          ? `${formatDateForCard(value.date_from)} — …`
          : 'Диапазон'

  const handlePresetClick = (preset: PeriodPreset) => {
    if (preset === 'range') {
      onChange({ period: 'range', date_from: undefined, date_to: undefined })
      return
    }

    onChange({ period: preset })
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="h-8 px-2 text-xs flex items-center gap-1"
        >
          <span>{label}</span>
          <ChevronDown className="h-3 w-3" />
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-72 p-3">
        <div className="flex flex-col gap-1">
          {PRESETS.map(preset => (
            <button
              key={preset.value}
              type="button"
              className={cn(
                'text-left px-3 py-1.5 rounded-md text-sm hover:bg-accent',
                value.period === preset.value && 'bg-accent'
              )}
              onClick={e => {
                e.stopPropagation()
                handlePresetClick(preset.value)
              }}
            >
              {preset.label}
            </button>
          ))}

          {value.period === 'range' && (
            <div className="mt-2 border-t pt-2">
              <Calendar
                mode="range"
                numberOfMonths={1}
                selected={{
                  from: value.date_from
                    ? new Date(value.date_from)
                    : undefined,
                  to: value.date_to ? new Date(value.date_to) : undefined
                }}
                onSelect={range => {
                  if (!range) return

                  // только первая дата → просто сохраняем, поповер остаётся ОТКРЫТЫМ
                  if (range.from && !range.to) {
                    onChange({
                      period: 'range',
                      date_from: range.from.toISOString(),
                      date_to: undefined
                    })
                    return
                  }

                  // обе даты → сохраняем диапазон, поповер всё равно
                  // останется открытым, пока юзер сам не кликнет снаружи
                  if (range.from && range.to) {
                    onChange({
                      period: 'range',
                      date_from: range.from.toISOString(),
                      date_to: range.to.toISOString()
                    })
                  }
                }}
              />
            </div>
          )}
        </div>
      </PopoverContent>
    </Popover>
  )
}