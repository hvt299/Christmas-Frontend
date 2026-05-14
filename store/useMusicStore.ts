import { create } from 'zustand'

interface MusicState {
  isPlaying: boolean
  currentSongUrl: string | null
  togglePlay: () => void
  setPlaying: (status: boolean) => void
  setSong: (url: string) => void
}

export const useMusicStore = create<MusicState>((set) => ({
  isPlaying: false,
  currentSongUrl: '/audio/merry-christmas-fantasy-orchestral-version.mp3',
  togglePlay: () => set((state) => ({ isPlaying: !state.isPlaying })),
  setPlaying: (status) => set({ isPlaying: status }),
  setSong: (url) => set({ currentSongUrl: url, isPlaying: true }),
}))