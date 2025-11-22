import { useChatParticipants } from "./useChatInfo"

// Этот хук будет «тонкой прослойкой» — его можно вызывать в любом компоненте, где нужно понять, кто ты в этом чате
export function useMyChatRole(chatId?: string | number | null, chatType?: 'group' | 'direct') {
  const { data, isLoading } = useChatParticipants(chatId ?? 0, !!chatId, chatType)

  const role = data?.my_role ?? 'member'

  // вычисляем права по роли
  const permissions = {
    canAddParticipant: role === 'owner' || role === 'admin',
    canRemoveParticipant: role === 'owner',
    canChangeRoles: role === 'owner',
    canDeleteChat: role === 'owner',
    canClearHistory: true, // все могут (но на бэке — только свои сообщения)
    canLeaveChat: chatType === 'group',    // все могут
    canDeleteForeignMessages: role === 'owner',
  }

  return { role, permissions, isLoading }
}