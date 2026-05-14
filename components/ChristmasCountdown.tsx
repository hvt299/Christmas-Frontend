'use client'
import { useState, useEffect } from 'react'
import { Clock } from 'lucide-react'
import { checkChristmasState, ChristmasState } from '@/utils/christmasHelper'

export default function ChristmasCountdown() {
  const [christmasState, setChristmasState] = useState<ChristmasState | null>(null)
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 })
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
    setChristmasState(checkChristmasState())

    const timer = setInterval(() => {
      const currentState = checkChristmasState()
      setChristmasState(currentState)

      if (!currentState.isChristmasSeason) {
        const now = new Date().getTime()
        const diff = currentState.targetDate - now

        if (diff > 0) {
          setTimeLeft({
            days: Math.floor(diff / (1000 * 60 * 60 * 24)),
            hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
            minutes: Math.floor((diff / 1000 / 60) % 60),
            seconds: Math.floor((diff / 1000) % 60)
          })
        }
      }
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  if (!isClient || !christmasState) return null

  if (christmasState.isChristmasSeason) {
    return (
      <div className="text-3xl md:text-5xl font-bold text-yellow-300 animate-bounce font-serif drop-shadow-lg mb-8">
        Merry Christmas {christmasState.currentYear}! 🎅🎄
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center gap-2 mb-8">
      <div className="flex items-center gap-2 text-red-200 uppercase tracking-widest text-sm font-bold animate-pulse">
        <Clock className="w-4 h-4" /> Sắp đến Giáng Sinh rồi
      </div>
      <div className="flex gap-4 text-center">
        {['Ngày', 'Giờ', 'Phút', 'Giây'].map((label, idx) => {
          const value = Object.values(timeLeft)[idx]
          return (
            <div key={label} className="bg-red-900/80 backdrop-blur-sm border border-yellow-500/50 p-3 rounded-lg min-w-17.5 shadow-lg transform transition-transform hover:-translate-y-1">
              <div className="text-3xl font-bold text-white font-mono">
                {value.toString().padStart(2, '0')}
              </div>
              <div className="text-xs text-yellow-400 mt-1">{label}</div>
            </div>
          )
        })}
      </div>
    </div>
  )
}