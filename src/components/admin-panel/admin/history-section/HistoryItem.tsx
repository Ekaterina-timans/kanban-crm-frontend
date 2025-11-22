import { formatActivityDateTime } from "@/utils/date-utils"

interface Props {
  item: any
}

export function HistoryItem({ item }: Props) {
  /** Человеческий текст действия */
  const actionTextMap: Record<string, string> = {
    created: 'создал',
    updated: 'обновил',
    deleted: 'удалил',
    invited: 'пригласил'
  }

  const entityTitleMap: Record<string, string> = {
    space: `пространство «${item.changes?.name ?? ''}»`,
    task: `задачу «${item.changes?.name ?? ''}»`,
    column: `колонку «${item.changes?.name ?? ''}»`,
    participants: `пользователя ${item.changes?.email ?? ''}`
  }

  const actionText = actionTextMap[item.action] || item.action
  const entityText = entityTitleMap[item.entity_type] || ''

  return (
    <div className="flex items-start gap-3">
      {/* Точка слева */}
      <div className="w-2 h-2 mt-2 bg-blue-500 rounded-full" />

      <div>
        <p>
          <strong>{item.user?.name}</strong> {actionText} {entityText}
        </p>

        <p className="text-gray-500 text-sm">
          {formatActivityDateTime(item.created_at)}
        </p>
      </div>
    </div>
  )
}