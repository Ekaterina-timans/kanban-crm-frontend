import { useSortable } from "@dnd-kit/sortable"
import { CSS } from '@dnd-kit/utilities'

export function SortableColumnPosition({ id, children }: { id: string | number, children: React.ReactNode }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id })
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.6 : 1,
    zIndex: isDragging ? 2 : 1,
    width: '100%'
  }
  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      {children}
    </div>
  )
}