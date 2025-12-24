'use client'
import { useState, useEffect } from 'react'
import { createClient } from '@/utils/supabase/client'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Snowflake, Gift, User, Mail, Lock, ArrowLeft } from 'lucide-react'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [fullName, setFullName] = useState('')

  const [loading, setLoading] = useState(false)
  const [isSignUp, setIsSignUp] = useState(false)
  const [message, setMessage] = useState<string | null>(null)

  // State mới: Đang kiểm tra xem user đã đăng nhập chưa
  const [checkingUser, setCheckingUser] = useState(true)

  const router = useRouter()
  const supabase = createClient()

  // 1. KIỂM TRA TRẠNG THÁI ĐĂNG NHẬP NGAY LẬP TỨC
  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (session) {
        // Nếu đã đăng nhập -> Đá về trang chủ ngay
        router.replace('/')
      } else {
        // Nếu chưa -> Cho phép hiện form
        setCheckingUser(false)
      }
    }
    checkUser()
  }, [router, supabase])

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage(null)

    if (isSignUp) {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { full_name: fullName }
        }
      })
      if (error) setMessage(error.message)
      else setMessage('Đăng ký thành công! Hãy đăng nhập ngay.')
    } else {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })
      if (error) {
        setMessage('Sai email hoặc mật khẩu rồi!')
      } else {
        router.push('/')
        router.refresh()
      }
    }
    setLoading(false)
  }

  // 2. MÀN HÌNH CHỜ (Tránh bị nháy form trước khi redirect)
  if (checkingUser) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-red-900 text-white">
        <Snowflake className="w-16 h-16 animate-spin-slow text-yellow-400 mb-4" />
        <p className="text-xl font-serif animate-pulse">Đang kiểm tra danh sách của Ông già Noel...</p>
      </div>
    )
  }

  // 3. GIAO DIỆN CHÍNH (Chỉ hiện khi chắc chắn chưa đăng nhập)
  return (
    <div className="min-h-screen flex items-center justify-center bg-red-900 relative overflow-hidden">

      {/* NÚT BACK */}
      <Link
        href="/"
        className="absolute top-6 left-6 z-20 p-3 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-full text-white transition-all hover:scale-110"
        title="Quay lại trang chủ"
      >
        <ArrowLeft className="w-6 h-6" />
      </Link>

      {/* Hiệu ứng nền */}
      <div className="absolute inset-0 opacity-20 pointer-events-none">
        <Snowflake className="absolute top-10 left-10 w-12 h-12 text-white animate-spin-slow" />
        <Snowflake className="absolute bottom-20 right-20 w-16 h-16 text-white animate-bounce" />
      </div>

      <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-md z-10 border-4 border-yellow-400 relative animate-fade-in-up">
        <div className="text-center mb-6">
          <Gift className="w-16 h-16 mx-auto text-red-600 mb-2" />
          <h2 className="text-3xl font-bold text-red-800">
            {isSignUp ? 'Đăng Ký Nhận Quà' : 'Đăng Nhập'}
          </h2>
          <p className="text-gray-500 text-sm mt-1">
            {isSignUp ? 'Nhập tên của bạn để Ông già Noel biết nhé!' : 'Chào mừng bạn quay trở lại!'}
          </p>
        </div>

        <form onSubmit={handleAuth} className="space-y-4">

          {isSignUp && (
            <div>
              <label className="block text-sm font-medium text-gray-700">Tên hiển thị</label>
              <div className="relative mt-1">
                <User className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  required={isSignUp}
                  className="block w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-red-500 focus:border-red-500"
                  placeholder="Santa Claus"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <div className="relative mt-1">
              <Mail className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
              <input
                type="email"
                required
                className="block w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-red-500 focus:border-red-500"
                placeholder="santa@northpole.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Mật khẩu</label>
            <div className="relative mt-1">
              <Lock className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
              <input
                type="password"
                required
                className="block w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-red-500 focus:border-red-500"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          {message && (
            <div className={`p-3 rounded text-sm ${message.includes('thành công') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
              {message}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-red-600 text-white py-3 rounded-lg font-bold hover:bg-red-700 transition duration-300 shadow-md"
          >
            {loading ? 'Đang xử lý...' : (isSignUp ? 'Đăng Ký' : 'Đăng Nhập')}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            {isSignUp ? 'Đã có tài khoản?' : 'Chưa có tài khoản?'}
            <button
              onClick={() => {
                setIsSignUp(!isSignUp);
                setMessage(null);
                setFullName('');
              }}
              className="ml-2 text-red-600 font-bold hover:underline"
            >
              {isSignUp ? 'Đăng nhập' : 'Đăng ký ngay'}
            </button>
          </p>
        </div>
      </div>
    </div>
  )
}