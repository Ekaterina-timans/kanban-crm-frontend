import { useGroupInvitationsModal } from "@/store/useGroupInvitationsModal"
import { TabName } from "@/types/components.types"
import { INotification } from "@/types/notification.types"

export type NotificationAction = (n: INotification, close: () => void) => void | string

export interface NotificationViewConfig {
  renderTitle: (n: INotification) => React.ReactNode
  renderDescription?: (n: INotification) => React.ReactNode
  action: NotificationAction // либо функция, либо возврат ссылки
}

export const notificationsConfig: Record<string, NotificationViewConfig> = {
  // Приглашение в группу
  "App\\Notifications\\GroupInviteNotification": {
    renderTitle: n => (
      <>
        <span>
          {n.data.inviter_name || n.data.inviter_email} пригласил(а) вас в группу "{n.data.group_name}"
        </span>
        {!n.read_at && <span className="ml-2"><span className="bg-blue-100 text-blue-600 rounded px-2 py-0.5 text-xs">Новое</span></span>}
      </>
    ),
    renderDescription: n => n.data.group_description && (
      <span>{n.data.group_description}</span>
    ),
    action: (n, close) => {
      // Открываем модалку с нужным табом
      useGroupInvitationsModal.getState().open('invitations' as TabName)
      close()
    }
  },
  // Пример: назначена задача
  // "App\\Notifications\\TaskAssignedNotification": {
  //   renderTitle: n => (
  //     <span>
  //       {n.data.assigner_name} назначил(а) вам задачу: "{n.data.task_title}"
  //     </span>
  //   ),
  //   renderDescription: n => (
  //     <span>Дедлайн: {n.data.deadline}</span>
  //   ),
  //   action: n => `/tasks/${n.data.task_id}` // просто переход по ссылке
  // },
  // Пример: дефолт
  default: {
    renderTitle: n => <span>Уведомление</span>,
    action: () => {} // ничего не делаем
  }
}
