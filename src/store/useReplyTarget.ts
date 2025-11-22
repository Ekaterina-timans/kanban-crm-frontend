import { create } from 'zustand'
import { IMessage } from '@/types/message.types'

type State = {
  replyTo: IMessage | null
}
type Actions = {
  setReplyTo: (m: IMessage | null) => void
  clearReply: () => void
}

export const useReplyTarget = create<State & Actions>((set) => ({
  replyTo: null,
  setReplyTo: (m) => set({ replyTo: m }),
  clearReply: () => set({ replyTo: null }),
}))
