'use client'
import { useEffect, useRef } from 'react'
import { useMusicStore } from '@/store/useMusicStore'
import { Disc3, Music2 } from 'lucide-react' // Icon đĩa nhạc

export default function MusicPlayer() {
  const { isPlaying, currentSongUrl, togglePlay } = useMusicStore()
  const audioRef = useRef<HTMLAudioElement>(null)

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play().catch(e => console.log("Chặn autoplay:", e));
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, currentSongUrl]);

  return (
    <div className="fixed bottom-4 left-4 md:bottom-6 md:left-6 z-50">
      {/* Thẻ Audio ẩn */}
      <audio ref={audioRef} src={currentSongUrl || ''} loop />

      {/* Nút bật tắt nhạc */}
      <button
        onClick={togglePlay}
        className={`p-2 md:p-3 rounded-full shadow-lg transition-all duration-500 border-2 border-white
          ${isPlaying ? 'bg-red-600 rotate-180' : 'bg-gray-800'}
        `}
      >
        {isPlaying ? (
          <Disc3 className="w-5 h-5 md:w-8 md:h-8 text-white animate-spin-slow" /> // Đĩa quay
        ) : (
          <Music2 className="w-5 h-5 md:w-8 md:h-8 text-white" />
        )}
      </button>
    </div>
  )
}