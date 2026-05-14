'use client'
import { useEffect, useRef } from 'react'
import { useMusicStore } from '@/store/useMusicStore'
import { Disc3, Music2 } from 'lucide-react'

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
    <div className="fixed bottom-5 right-5 md:bottom-6 md:right-6 z-50">
      <audio ref={audioRef} src={currentSongUrl || ''} loop />

      <button
        onClick={togglePlay}
        className={`relative z-10 flex items-center justify-center p-2.5 md:p-3 rounded-full shadow-xl transition-all duration-500 border-2 border-white/80 hover:scale-110 hover:border-white
          ${isPlaying ? 'bg-red-600 rotate-180' : 'bg-gray-800/90 backdrop-blur-sm shadow-[0_0_15px_rgba(255,255,255,0.2)]'}
        `}
      >
        {isPlaying ? (
          <Disc3 className="w-5 h-5 md:w-6 md:h-6 text-white animate-spin-slow" />
        ) : (
          <Music2 className="w-5 h-5 md:w-6 md:h-6 text-white animate-pulse" />
        )}
      </button>

      {!isPlaying && (
        <div className="absolute bottom-13 md:bottom-16 right-0 w-35 bg-white text-red-900 text-[11px] md:text-xs p-2 rounded-xl shadow-2xl animate-bounce text-center font-bold border-2 border-yellow-400">
          Mở nhạc đón Giáng Sinh nào 🎁
          <div className="absolute -bottom-1.5 right-4 w-3 h-3 bg-white border-b-2 border-r-2 border-yellow-400 rotate-45"></div>
        </div>
      )}
    </div>
  )
}