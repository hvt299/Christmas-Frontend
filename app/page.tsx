'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Gift, LogOut, User, Snowflake, Clock, Settings, X } from 'lucide-react'
import ChristmasCountdown from '@/components/ChristmasCountdown'
import Cookies from 'js-cookie'

export default function Home() {
  const [user, setUser] = useState<any>(null)
  const [showPopup, setShowPopup] = useState(false) // State quản lý hiển thị popup

  useEffect(() => {
    const userInfo = localStorage.getItem('user_info')
    const token = localStorage.getItem('access_token')

    if (userInfo && token) {
      try {
        setUser(JSON.parse(userInfo))
      } catch (error) {
        console.error('Lỗi khi đọc dữ liệu user:', error)
      }
    } else {
      // Logic Popup: Chỉ hiện khi CHƯA đăng nhập, delay 1 giây để user kịp ngắm giao diện
      const timer = setTimeout(() => {
        setShowPopup(true)
      }, 1000)
      return () => clearTimeout(timer)
    }
  }, [])

  const displayName = user?.fullName || user?.username || "Bạn"
  const avatarUrl = user?.avatar

  const currentYear = new Date().getFullYear()
  const currentMonth = new Date().getMonth() + 1;
  const isDecember = currentMonth === 12;

  const handleLogout = () => {
    localStorage.removeItem('access_token')
    localStorage.removeItem('user_info')
    Cookies.remove('access_token')

    setUser(null)
    window.location.reload()
  }

  return (
    <div className="relative min-h-screen overflow-hidden text-white font-sans selection:bg-red-500 selection:text-white">

      {/* 1. BACKGROUND IMAGE & OVERLAY */}
      <div
        className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat transform scale-105"
        style={{
          backgroundImage: "url('/images/bg-merry-christmas.jpg')"
        }}
      >
        <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]"></div>
      </div>

      {/* 2. TOP BAR (MENU) */}
      <nav className="relative z-50 flex justify-between items-center px-4 md:px-8 py-6 w-full">
        <Link
          href="/"
          className="flex items-center gap-2 text-xl md:text-2xl font-bold font-serif text-yellow-400 hover:text-yellow-200 transition cursor-pointer"
        >
          <Snowflake className="w-8 h-8 animate-spin-slow" />
          <span className="hidden sm:inline">Christmas Wishes</span>
        </Link>

        <div className="flex items-center gap-4">
          {user ? (
            <div className="flex items-center gap-2 bg-black/30 backdrop-blur-md pl-1 pr-2 py-1 rounded-full border border-white/20 shadow-lg">
              <Link
                href="/profile"
                className="flex items-center gap-3 px-2 py-1 rounded-full hover:bg-white/10 transition group"
                title="Cài đặt tài khoản"
              >
                {avatarUrl ? (
                  <img src={avatarUrl} alt="Avatar" className="w-8 h-8 rounded-full border border-white/50 object-cover" />
                ) : (
                  <div className="bg-red-600 p-1.5 rounded-full">
                    <User className="w-5 h-5" />
                  </div>
                )}
                <span className="font-medium max-w-25 truncate md:max-w-none group-hover:text-yellow-300 transition">
                  {displayName}
                </span>
                <Settings className="w-4 h-4 text-white/50 group-hover:text-white transition" />
              </Link>

              <div className="h-6 w-px bg-white/20"></div>

              <button
                onClick={handleLogout}
                className="p-2 text-white/70 hover:text-red-400 hover:bg-white/10 rounded-full transition"
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

      {/* 3. CENTER CONTENT */}
      <main className="relative z-10 flex flex-col items-center justify-center min-h-[80vh] px-4 text-center">

        <h1 className="text-5xl md:text-8xl font-bold mb-8 font-serif text-transparent bg-clip-text bg-linear-to-b from-yellow-300 to-yellow-600 drop-shadow-[0_5px_5px_rgba(0,0,0,0.5)]">
          Giáng Sinh {currentYear}
        </h1>

        <div className="mb-6 scale-110">
          <ChristmasCountdown />
        </div>

        {user ? (
          <div className="animate-fade-in-up flex flex-col items-center gap-4">
            {isDecember ? (
              <Link
                href="/create"
                className="group relative inline-flex items-center gap-3 px-8 py-4 bg-red-600 hover:bg-red-700 text-white rounded-2xl font-bold text-xl shadow-[0_0_20px_rgba(220,38,38,0.5)] transition-all hover:scale-105 hover:shadow-[0_0_40px_rgba(220,38,38,0.7)]"
              >
                <Gift className="w-6 h-6 animate-bounce" />
                <span>Gửi Món Quà Mới</span>
                <div className="absolute inset-0 rounded-2xl ring-4 ring-white/30 group-hover:ring-white/50 transition-all"></div>
              </Link>
            ) : (
              <button
                disabled
                className="group relative inline-flex items-center gap-3 px-8 py-4 bg-gray-400 text-white rounded-2xl font-bold text-xl cursor-not-allowed shadow-none grayscale opacity-70"
              >
                <Clock className="w-6 h-6" />
                <span>Hẹn gặp lại tháng 12!</span>
                <div className="absolute inset-0 rounded-2xl ring-4 ring-white/10"></div>
              </button>
            )}

            {!isDecember && (
              <p className="text-white mt-2 text-sm opacity-80 italic">
                Cỗ xe tuần lộc đang nghỉ ngơi, hãy quay lại vào mùa Giáng sinh tới nhé!
              </p>
            )}

            <Link
              href="/my-gifts"
              className="text-yellow-300 hover:text-yellow-100 font-bold underline decoration-dotted underline-offset-4 flex items-center gap-2 transition"
            >
              <Gift className="w-4 h-4" /> Xem lại các món quà đã gửi
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

      <footer className="absolute bottom-4 w-full text-center text-white/40 text-xs z-10">
        Designed with ❤️ for Christmas by hvt299
      </footer>

      {/* 4. POPUP MỜI ĐĂNG NHẬP (Hiển thị khi showPopup = true) */}
      {showPopup && !user && (
        <div className="fixed inset-0 z-100 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-300">
          <div className="bg-red-900 border-4 border-yellow-400 p-8 rounded-3xl shadow-2xl relative max-w-sm w-full text-center transform transition-all scale-100">

            {/* Nút Close góc trên phải */}
            <button
              onClick={() => setShowPopup(false)}
              className="absolute top-3 right-3 text-white/70 hover:text-white bg-black/20 hover:bg-black/40 rounded-full p-1 transition"
              title="Đóng"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Nội dung Popup */}
            <Gift className="w-16 h-16 mx-auto mb-4 text-yellow-300 animate-bounce" />
            <h2 className="text-2xl font-bold font-serif text-white mb-2">Trạm Quà Giáng Sinh</h2>
            <p className="text-red-100 mb-6 text-sm">
              Đăng nhập ngay để tự tay gói những hộp quà bí mật gửi tặng người thân yêu nhé! 🎅🎁
            </p>

            <Link
              href="/login"
              className="inline-block bg-yellow-400 text-red-900 px-6 py-3 rounded-full font-bold shadow-lg hover:bg-yellow-300 hover:scale-105 transition w-full"
            >
              Đăng nhập / Đăng ký
            </Link>
          </div>
        </div>
      )}
    </div>
  )
}