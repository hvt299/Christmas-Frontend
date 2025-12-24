'use client'
import { useEffect, useState } from 'react'
import { createClient } from '@/utils/supabase/client'
import Link from 'next/link'
import { Gift, LogOut, User, Snowflake } from 'lucide-react' // Thêm icon LogOut, User, Snowflake
import ChristmasCountdown from '@/components/ChristmasCountdown'

export default function Home() {
  const [user, setUser] = useState<any>(null)
  const supabase = createClient()

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
    }
    getUser()
  }, [])

  const displayName = user?.user_metadata?.full_name || user?.email?.split('@')[0] || "Bạn"

  // Hàm xử lý Logout
  const handleLogout = async () => {
    await supabase.auth.signOut()
    setUser(null)
  }

  return (
    <div className="relative min-h-screen overflow-hidden text-white font-sans selection:bg-red-500 selection:text-white">

      {/* 1. BACKGROUND IMAGE & OVERLAY */}
      <div
        className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat transform scale-105"
        style={{
          // Ảnh nền cây thông Noel chất lượng cao từ Unsplash
          backgroundImage: "url('https://t4.ftcdn.net/jpg/17/72/71/03/360_F_1772710342_2zVjZvvhWiFQINDWYSyPokQb1qagKbH8.jpg')"
        }}
      >
        {/* Lớp phủ đen mờ để chữ dễ đọc hơn */}
        <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]"></div>
      </div>

      {/* 2. TOP BAR (MENU) */}
      <nav className="relative z-50 flex justify-between items-center px-8 py-6 w-full">
        {/* Logo bên trái - Đã biến thành Link về trang chủ 👇 */}
        <Link
          href="/"
          className="flex items-center gap-2 text-2xl font-bold font-serif text-yellow-400 hover:text-yellow-200 hover:scale-105 transition cursor-pointer"
        >
          <Snowflake className="w-8 h-8 animate-spin-slow" />
          <span>Christmas Wishes</span>
        </Link>

        {/* User Info bên phải (Giữ nguyên) */}
        <div className="flex items-center gap-4">
          {user ? (
            <div className="flex items-center gap-4 bg-white/10 backdrop-blur-md px-4 py-2 rounded-full border border-white/20 shadow-lg">
              <div className="flex items-center gap-2">
                <div className="bg-red-600 p-1.5 rounded-full">
                  <User className="w-4 h-4" />
                </div>
                <span className="font-medium hidden sm:block">{displayName}</span>
              </div>

              <div className="h-4 w-[1px] bg-white/30"></div>

              <button
                onClick={handleLogout}
                className="text-white/80 hover:text-red-400 transition"
                title="Đăng xuất"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          ) : (
            <Link
              href="/login"
              className="bg-white text-red-900 px-5 py-2 rounded-full font-bold shadow-lg hover:bg-yellow-100 transition"
            >
              Đăng Nhập
            </Link>
          )}
        </div>
      </nav>

      {/* 3. CENTER CONTENT (Nội dung chính) */}
      <main className="relative z-10 flex flex-col items-center justify-center min-h-[80vh] px-4 text-center">

        {/* Tiêu đề lớn */}
        <h1 className="text-6xl md:text-8xl font-bold mb-8 font-serif text-transparent bg-clip-text bg-gradient-to-b from-yellow-300 to-yellow-600 drop-shadow-[0_5px_5px_rgba(0,0,0,0.5)]">
          Giáng Sinh 2025
        </h1>

        {/* Đồng hồ đếm ngược (Component của bạn) */}
        <div className="mb-12 scale-110">
          <ChristmasCountdown />
        </div>

        {/* Khu vực nút hành động (Call to Action) */}
        {user ? (
          <div className="animate-fade-in-up">
            <Link
              href="/create"
              className="group relative inline-flex items-center gap-3 px-8 py-4 bg-red-600 hover:bg-red-700 text-white rounded-2xl font-bold text-xl shadow-[0_0_20px_rgba(220,38,38,0.5)] transition-all hover:scale-105 hover:shadow-[0_0_40px_rgba(220,38,38,0.7)]"
            >
              <Gift className="w-6 h-6 animate-bounce" />
              <span>Gửi Món Quà Mới</span>

              {/* Hiệu ứng hào quang khi hover */}
              <div className="absolute inset-0 rounded-2xl ring-4 ring-white/30 group-hover:ring-white/50 transition-all"></div>
            </Link>
            <p className="mt-4 text-white/80 text-sm">Hãy trao đi yêu thương ngay hôm nay ✨</p>
          </div>
        ) : (
          <div className="max-w-md mx-auto bg-black/30 backdrop-blur-md p-6 rounded-2xl border border-white/10">
            <p className="text-lg mb-4">Đăng nhập để gửi những lời chúc bí mật đến người thân yêu!</p>
            <Link
              href="/login"
              className="inline-block bg-yellow-400 text-red-900 px-8 py-3 rounded-full font-bold shadow-lg hover:scale-105 transition"
            >
              Tham gia ngay
            </Link>
          </div>
        )}
      </main>

      {/* Footer nhỏ (Optional) */}
      <footer className="absolute bottom-4 w-full text-center text-white/40 text-xs z-10">
        Designed with ❤️ for Christmas by hvt299
      </footer>
    </div>
  )
}