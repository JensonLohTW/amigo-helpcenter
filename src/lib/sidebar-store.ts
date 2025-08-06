import { create } from 'zustand'

// 側邊欄狀態管理
export const useSidebarStore = create<{
  isCollapsed: boolean
  toggle: () => void
  collapse: () => void
  expand: () => void
}>()((set) => ({
  isCollapsed: false,
  toggle: () => set((state) => ({ isCollapsed: !state.isCollapsed })),
  collapse: () => set({ isCollapsed: true }),
  expand: () => set({ isCollapsed: false }),
}))
