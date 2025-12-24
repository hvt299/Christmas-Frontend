'use client'
import { useState, useEffect } from 'react'
import { useMusicStore } from '@/store/useMusicStore'
import { Gift } from 'lucide-react'

export default function WelcomeScreen() {
  const [isVisible, setIsVisible] = useState(true)
  const [isClosing, setIsClosing] = useState(false) // State để kích hoạt hiệu ứng trượt
  const { togglePlay } = useMusicStore()

  const handleStart = () => {
    // 1. Bật nhạc
    togglePlay()

    // 2. Kích hoạt hiệu ứng trượt lên
    setIsClosing(true)

    // 3. Đợi hiệu ứng chạy xong (700ms) rồi mới ẩn hoàn toàn khỏi DOM
    setTimeout(() => {
      setIsVisible(false)
    }, 700)
  }

  // Nếu đã ẩn hoàn toàn thì không render nữa
  if (!isVisible) return null

  return (
    <div
      className={`fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-red-900/95 text-white transition-all duration-700 ease-in-out
        ${isClosing ? '-translate-y-full opacity-0' : 'translate-y-0 opacity-100'}
      `}
    >
      <div className="text-center animate-bounce">
        <Gift size={80} className="mx-auto mb-4 text-yellow-400" />
        <h1 className="text-4xl font-bold mb-2 font-serif">Giáng Sinh An Lành</h1>
        <p className="mb-8 text-lg opacity-80">Một món quà âm nhạc đang chờ bạn...</p>

        <button
          onClick={handleStart}
          className="px-8 py-3 bg-white text-red-900 font-bold rounded-full shadow-lg hover:bg-yellow-100 transition-transform transform hover:scale-105"
        >
          Mở Quà Ngay 🎁
        </button>
      </div>
    </div>
  )
}