'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { apiCall } from '@/utils/api' // Hàm vừa viết
import Link from 'next/link'
import { Gift, Send, Music, Type, ArrowLeft } from 'lucide-react'

export default function CreateGiftPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    receiverName: '',
    content: '',
    theme: 'red_box', // Mặc định hộp đỏ
  })
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage('')

    try {
      // Gọi API tạo quà sang Backend
      const result = await apiCall('/gifts', 'POST', formData)

      setMessage('Gửi quà thành công! Đang chuyển hướng...')

      // Đợi 1.5s rồi chuyển về trang chủ hoặc trang xem quà
      setTimeout(() => {
        // Tạm thời về trang chủ, sau này sẽ dẫn tới link hộp quà
        router.push('/')
      }, 1500)

    } catch (error: any) {
      setMessage(`Lỗi: ${error.message}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-green-900 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden border-4 border-yellow-500 relative">

        {/* 1. Nút quay lại (Mũi tên góc trái) */}
        <Link
          href="/"
          className="absolute top-4 left-4 p-2 bg-white/20 hover:bg-black/10 rounded-full transition text-white z-10"
          title="Quay lại trang chủ"
        >
          <ArrowLeft className="w-6 h-6" />
        </Link>

        {/* Header */}
        <div className="bg-red-700 p-6 text-center text-white">
          <Gift className="w-12 h-12 mx-auto mb-2 animate-bounce" />
          <h1 className="text-3xl font-bold font-serif">Gửi Quà Giáng Sinh</h1>
          <p className="opacity-90">Trao yêu thương, nhận nụ cười</p>
        </div>

        {/* Form */}
        <div className="p-8">
          <form onSubmit={handleSubmit} className="space-y-6">

            {/* Người nhận */}
            <div>
              <label className="flex items-center gap-2 font-bold text-gray-700 mb-2">
                <Type className="w-5 h-5 text-red-600" />
                Người nhận là ai?
              </label>
              <input
                type="text"
                required
                className="w-full border-2 border-gray-200 rounded-lg p-3 focus:border-red-500 outline-none transition"
                // 2. CẬP NHẬT PLACEHOLDER: Hướng dẫn rõ ràng hơn
                placeholder="Nhập tên bạn bè (hoặc tên tài khoản nếu có)..."
                value={formData.receiverName}
                onChange={e => setFormData({ ...formData, receiverName: e.target.value })}
              />
            </div>

            {/* Lời chúc */}
            <div>
              <label className="flex items-center gap-2 font-bold text-gray-700 mb-2">
                <Music className="w-5 h-5 text-red-600" />
                Lời chúc ngọt ngào
              </label>
              <textarea
                required
                rows={4}
                className="w-full border-2 border-gray-200 rounded-lg p-3 focus:border-red-500 outline-none transition"
                placeholder="Chúc bạn một mùa giáng sinh an lành và..."
                value={formData.content}
                onChange={e => setFormData({ ...formData, content: e.target.value })}
              />
            </div>

            {/* Chọn màu hộp quà */}
            <div>
              <label className="block font-bold text-gray-700 mb-2">Chọn màu hộp quà</label>
              <div className="flex gap-4">
                {['red_box', 'green_box', 'gold_box'].map((theme) => (
                  <button
                    key={theme}
                    type="button"
                    onClick={() => setFormData({ ...formData, theme })}
                    className={`w-12 h-12 rounded-full border-4 shadow-sm transition-transform hover:scale-110 
                      ${formData.theme === theme ? 'border-blue-500 scale-110' : 'border-transparent'}
                      ${theme === 'red_box' ? 'bg-red-600' : theme === 'green_box' ? 'bg-green-600' : 'bg-yellow-400'}
                    `}
                  />
                ))}
              </div>
            </div>

            {/* Thông báo lỗi/thành công */}
            {message && (
              <div className={`p-4 rounded-lg text-center font-bold ${message.includes('thành công') ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                {message}
              </div>
            )}

            {/* 3. KHU VỰC NÚT BẤM (Đã chia làm 2 nút) */}
            <div className="flex gap-3">
              {/* Nút Hủy (Màu xám) */}
              <button
                type="button"
                onClick={() => router.push('/')}
                className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold py-4 rounded-xl transition shadow-sm"
              >
                Hủy bỏ
              </button>

              {/* Nút Gửi (Màu đỏ, to hơn) */}
              <button
                type="submit"
                disabled={loading}
                className="flex-[2] bg-red-600 hover:bg-red-700 text-white font-bold py-4 rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 text-lg"
              >
                {loading ? 'Đang gói...' : (
                  <>
                    <Send className="w-6 h-6" /> Gửi Ngay
                  </>
                )}
              </button>
            </div>

          </form>
        </div>
      </div>
    </div>
  )
}