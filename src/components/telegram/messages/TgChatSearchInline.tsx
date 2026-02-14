'use client'

import { Loader2, Search, X } from 'lucide-react'
import { useEffect, useMemo, useRef, useState } from 'react'

import Field from '@/components/ui/field/Field'
import { useDebounced } from '@/hooks/useDebounced'
import { useTelegramMessageSearch } from '@/hooks/telegram/useTelegramMessageSearch'
import { formatTime } from '@/utils/date-utils'
import { cn } from '@/lib/utils'

export function TgChatSearchInline({
  threadId,
  onClose,
  className
}: {
  threadId: string | number
  onClose: () => void
  className?: string
}) {
  const [q, setQ] = useState('')
  const debounced = useDebounced(q, 300)

  const { data, isFetching, error } = useTelegramMessageSearch(threadId, debounced)

  const items = useMemo(() => data?.data ?? [], [data])
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  const jumpTo = (id: string | number) => {
    window.dispatchEvent(
      new CustomEvent('tg:scrollToMessage', {
        detail: { messageId: id, query: debounced.trim() }
      })
    )
    onClose()
  }

  const hasQuery = q.trim().length > 0

  return (
    <div className={cn('relative', className)}>
      <Field
        ref={inputRef as any}
        placeholder='Поиск в диалоге…'
        value={q}
        onChange={e => setQ(e.target.value)}
        leftIcon={Search}
        rightIcon={X}
        onRightIconClick={() => setQ('')}
        className='!mt-0'
      />

      {hasQuery && (
        <div className='absolute left-0 right-0 top-full mt-2 z-20 rounded-lg border bg-white shadow-sm'>
          <div className='px-3 py-2 text-xs text-slate-500 border-b'>
            {isFetching ? (
              <span className='inline-flex items-center gap-2'>
                <Loader2 className='animate-spin' size={14} /> Ищем…
              </span>
            ) : error ? (
              <span className='text-red-600'>{String(error)}</span>
            ) : (
              <>Найдено: {items.length}</>
            )}
          </div>

          <div className='max-h-64 overflow-auto'>
            {!isFetching && !error && items.length === 0 && (
              <div className='px-3 py-2 text-sm text-slate-500'>Нет совпадений</div>
            )}

            {items.map(m => (
              <button
                key={m.id}
                onClick={() => jumpTo(m.id)}
                className='w-full text-left px-4 py-2 flex items-center gap-3 hover:bg-slate-50'
              >
                <span className='text-[11px] text-slate-500 shrink-0'>
                  {formatTime(m.created_at)}
                </span>
                <span className='text-sm truncate'>{m.text || '(без текста)'}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}