import { create } from 'zustand'

type State = {
  collapsed: boolean
  open: () => void
  close: () => void
  toggle: () => void
}

export const useChatSidebar = create<State>((set, get) => ({
  collapsed: false,
  open:    () => set({ collapsed: false }),
  close:   () => set({ collapsed: true }),
  toggle:  () => set({ collapsed: !get().collapsed }),
}))