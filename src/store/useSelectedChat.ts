import { create } from 'zustand'

type State = {
  selectedChatId: string | number | null
}
type Actions = {
  selectChat: (id: string | number) => void
  clearChat: () => void
}

export const useSelectedChat = create<State & Actions>((set) => ({
  selectedChatId: null,
  selectChat: (id) => set({ selectedChatId: id }),
  clearChat: () => set({ selectedChatId: null }),
}))
