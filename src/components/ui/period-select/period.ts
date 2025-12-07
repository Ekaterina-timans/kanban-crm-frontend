export type PeriodPreset = 'today' | 'week' | 'month' | 'quarter' | 'year' | 'range'

export interface PeriodParams {
  period: PeriodPreset
  date_from?: string
  date_to?: string
}
