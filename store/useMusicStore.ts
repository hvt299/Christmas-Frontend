import { create } from 'zustand'

interface MusicState {
  isPlaying: boolean
  currentSongUrl: string | null
  togglePlay: () => void
  setSong: (url: string) => void
}

export const useMusicStore = create<MusicState>((set) => ({
  isPlaying: false,
  currentSongUrl: 'https://uhyfaeamtkrjpnsnjpnh.supabase.co/storage/v1/object/public/christmas-assets/merry-christmas-fantasy-orchestral-version-447787.mp3',
  togglePlay: () => set((state) => ({ isPlaying: !state.isPlaying })),
  setSong: (url) => set({ currentSongUrl: url, isPlaying: true }),
}))