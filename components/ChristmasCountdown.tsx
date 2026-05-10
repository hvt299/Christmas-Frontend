'use client'
import { useState, useEffect } from 'react'
import { Clock } from 'lucide-react'

export default function ChristmasCountdown() {
  const [timeLeft, setTimeLeft] = useState({
    days: 0, hours: 0, minutes: 0, seconds: 0
  })
  const [message, setMessage] = useState('')

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date()
      const currentYear = now.getFullYear()
      
      // Ngày Noel năm nay và ngày Hết năm nay
      const xmasDate = new Date(currentYear, 11, 25) // Tháng 11 là tháng 12
      const endOfYear = new Date(currentYear, 11, 31, 23, 59, 59)

      // LOGIC 1: Đang trong tuần lễ Giáng sinh (25/12 -> 31/12)
      if (now >= xmasDate && now <= endOfYear) {
        setMessage(`Merry Christmas ${currentYear}! 🎅🎄`)
        return
      }

      // LOGIC 2: Đếm ngược (Từ 1/1 -> 24/12)
      // Nếu hiện tại đã qua Noel năm nay, thì đếm tới Noel năm sau
      let targetDate = xmasDate
      if (now > endOfYear) {
        targetDate = new Date(currentYear + 1, 11, 25)
      } else if (now > xmasDate) {
        // Trường hợp rất hiếm (giữa 25/12 và 31/12 mà lọt logic trên) nhưng cứ tính năm sau cho chắc
         targetDate = new Date(currentYear + 1, 11, 25)
      }

      const diff = targetDate.getTime() - now.getTime()

      const days = Math.floor(diff / (1000 * 60 * 60 * 24))
      const hours = Math.floor((diff / (1000 * 60 * 60)) % 24)
      const minutes = Math.floor((diff / 1000 / 60) % 60)
      const seconds = Math.floor((diff / 1000) % 60)

      setTimeLeft({ days, hours, minutes, seconds })
      setMessage('') // Xóa tin nhắn chúc mừng để hiện đồng hồ
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  // Render giao diện
  if (message) {
    return (
      <div className="text-3xl md:text-5xl font-bold text-yellow-300 animate-bounce font-serif drop-shadow-lg">
        {message}
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center gap-2 mb-8">
      <div className="flex items-center gap-2 text-red-200 uppercase tracking-widest text-sm font-bold">
        <Clock className="w-4 h-4" /> Sắp đến Giáng Sinh rồi
      </div>
      <div className="flex gap-4 text-center">
        {['Ngày', 'Giờ', 'Phút', 'Giây'].map((label, idx) => {
           const value = Object.values(timeLeft)[idx]
           return (
             <div key={label} className="bg-red-900/80 backdrop-blur-sm border border-yellow-500/50 p-3 rounded-lg min-w-17.5 shadow-lg">
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