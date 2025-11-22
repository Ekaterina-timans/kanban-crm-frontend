import { X } from 'lucide-react'
import { cn } from '@/lib/utils'

export function ImageThumb({
  url, alt, onRemove,
}: { url: string; alt: string; onRemove?: () => void }) {
  return (
    <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg border">
      <img src={url} alt={alt} className="h-full w-full object-cover" />
      {onRemove && (
        <button
          type="button"
          onClick={onRemove}
          className="absolute right-1 top-1 inline-flex h-5 w-5 items-center justify-center rounded-full bg-black/60 text-white"
          title="Убрать файл"
        >
          <X size={12}/>
        </button>
      )}
    </div>
  )
}

export function FileChip({
  name, subtype, onRemove, className,
}: { name: string; subtype?: string; onRemove?: () => void; className?: string }) {
  return (
    <div className={cn(
      'flex items-center gap-2 rounded-lg border bg-white px-3 py-2 text-xs shadow-sm',
      'max-w-[260px]',
      className
    )}>
      <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-slate-200 text-[10px] font-semibold">
        {(subtype ?? 'FILE').toUpperCase()}
      </div>
      <div className="min-w-0">
        <div className="truncate font-medium leading-4">{name}</div>
        {subtype && <div className="text-[10px] leading-3 text-slate-500">{subtype.toUpperCase()}</div>}
      </div>
      {onRemove && (
        <button
          type="button"
          onClick={onRemove}
          className="ml-1 inline-flex h-5 w-5 items-center justify-center rounded-full text-slate-500 hover:bg-slate-100 hover:text-slate-700"
          title="Убрать файл"
        >
          <X size={12}/>
        </button>
      )}
    </div>
  )
}
