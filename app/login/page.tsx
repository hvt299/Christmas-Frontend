'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Snowflake, Gift, User, Mail, Lock, ArrowLeft } from 'lucide-react'
import { useGoogleLogin } from '@react-oauth/google'
import Cookies from 'js-cookie'
import api from '@/lib/api'

const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/

export default function LoginPage() {
  const router = useRouter()

  const [formData, setFormData] = useState({
    username: '',
    fullName: '',
    email: '',
    password: '',
  })

  const [loading, setLoading] = useState(false)
  const [isSignUp, setIsSignUp] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)
  const [checkingUser, setCheckingUser] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('access_token')
    if (token) {
      router.replace('/')
    } else {
      setCheckingUser(false)
    }
  }, [router])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage(null)

    if (isSignUp && !passwordRegex.test(formData.password)) {
      setMessage({ type: 'error', text: 'Mật khẩu quá yếu! Vui lòng nhập tối thiểu 8 ký tự, gồm 1 chữ hoa, 1 chữ thường, 1 số và 1 ký tự đặc biệt.' })
      setLoading(false)
      return
    }

    try {
      if (isSignUp) {
        await api.post('/users/register', {
          username: formData.username,
          fullName: formData.fullName,
          email: formData.email,
          password: formData.password
        })
        setMessage({ type: 'success', text: 'Đăng ký thành công! Hãy kiểm tra email để xác nhận nhé.' })
        setTimeout(() => setIsSignUp(false), 2500)
      } else {
        const res = await api.post('/auth/login', {
          username: formData.username,
          password: formData.password
        })

        const { access_token, user } = res.data
        localStorage.setItem('access_token', access_token)
        localStorage.setItem('user_info', JSON.stringify(user))
        Cookies.set('access_token', access_token, { expires: 7 })

        router.push('/')
      }
    } catch (error: any) {
      const errorMsg = error.response?.data?.message
      setMessage({ type: 'error', text: Array.isArray(errorMsg) ? errorMsg[0] : (errorMsg || 'Có lỗi xảy ra!') })
    } finally {
      setLoading(false)
    }
  }

  const loginWithGoogle = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        setLoading(true)
        const res = await api.post('/auth/google', { token: tokenResponse.access_token })
        const { access_token, user } = res.data

        localStorage.setItem('access_token', access_token)
        localStorage.setItem('user_info', JSON.stringify(user))
        Cookies.set('access_token', access_token, { expires: 7 })

        router.push('/')
      } catch (error) {
        setMessage({ type: 'error', text: 'Đăng nhập Google thất bại!' })
        setLoading(false)
      }
    },
    onError: () => setMessage({ type: 'error', text: 'Lỗi khởi tạo Google Login' })
  })

  if (checkingUser) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-red-900 text-white">
        <Snowflake className="w-16 h-16 animate-spin-slow text-yellow-400 mb-4" />
        <p className="text-xl font-serif animate-pulse">Đang kiểm tra danh sách của Ông già Noel...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-red-900 relative overflow-hidden p-4">
      <div className="absolute inset-0 opacity-20 pointer-events-none">
        <Snowflake className="absolute top-10 left-10 w-12 h-12 text-white animate-spin-slow" />
        <Snowflake className="absolute bottom-20 right-20 w-16 h-16 text-white animate-bounce" />
      </div>

      <div className="bg-white p-6 md:p-8 rounded-2xl shadow-2xl w-full max-w-md z-10 border-4 border-yellow-400 relative animate-fade-in-up">
        <Link href="/" className="absolute top-3 left-3 md:top-4 md:left-4 p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-full transition-all" title="Quay lại trang chủ">
          <ArrowLeft className="w-6 h-6" />
        </Link>

        <div className="text-center mb-6 mt-6 md:mt-4">
          <Gift className="w-12 h-12 md:w-16 md:h-16 mx-auto text-red-600 mb-2" />
          <h2 className="text-2xl md:text-3xl font-bold text-red-800">
            {isSignUp ? 'Đăng Ký Nhận Quà' : 'Đăng Nhập'}
          </h2>
          <p className="text-gray-500 text-xs md:text-sm mt-1">
            {isSignUp ? 'Nhập thông tin để Ông già Noel biết nhé!' : 'Chào mừng bạn quay trở lại!'}
          </p>
        </div>

        <form onSubmit={handleAuth} className="space-y-4">
          {isSignUp && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700">Tên hiển thị</label>
                <div className="relative mt-1">
                  <User className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                  <input type="text" name="fullName" required className="block w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-red-500 focus:border-red-500" placeholder="Santa Claus" value={formData.fullName} onChange={handleChange} />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Tên đăng nhập (Viết liền, không dấu)</label>
                <div className="relative mt-1">
                  <User className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                  <input type="text" name="username" required className="block w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-red-500 focus:border-red-500" placeholder="santaclaus123" value={formData.username} onChange={handleChange} />
                </div>
              </div>
            </>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700">
              {isSignUp ? 'Email' : 'Tên đăng nhập hoặc Email'}
            </label>
            <div className="relative mt-1">
              {isSignUp ? <Mail className="absolute left-3 top-3 w-5 h-5 text-gray-400" /> : <User className="absolute left-3 top-3 w-5 h-5 text-gray-400" />}
              <input type={isSignUp ? "email" : "text"} name={isSignUp ? "email" : "username"} required className="block w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-red-500 focus:border-red-500" placeholder={isSignUp ? "santa@northpole.com" : "santa@northpole.com"} value={isSignUp ? formData.email : formData.username} onChange={handleChange} />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Mật khẩu</label>
            <div className="relative mt-1">
              <Lock className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
              <input type="password" name="password" required className="block w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-red-500 focus:border-red-500" placeholder={isSignUp ? "Min 8 ký tự, 1 hoa, 1 số, 1 đặc biệt" : "••••••••"} value={formData.password} onChange={handleChange} />
            </div>
            {!isSignUp && (
              <div className="text-right mt-1">
                <Link href="/forgot-password" className="text-xs font-bold text-red-600 hover:text-red-800 hover:underline">Quên mật khẩu?</Link>
              </div>
            )}
          </div>

          {message && (
            <div className={`p-3 rounded text-sm ${message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
              {message.text}
            </div>
          )}

          <button type="submit" disabled={loading} className="w-full bg-red-600 text-white py-3 rounded-lg font-bold hover:bg-red-700 transition duration-300 shadow-md disabled:opacity-70">
            {loading ? 'Đang xử lý...' : (isSignUp ? 'Đăng Ký' : 'Đăng Nhập')}
          </button>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-300"></div></div>
            <div className="relative flex justify-center text-sm"><span className="px-2 bg-white text-gray-500 font-medium">Hoặc</span></div>
          </div>

          <button type="button" onClick={() => loginWithGoogle()} disabled={loading} className="w-full flex items-center justify-center gap-3 bg-white text-gray-700 border-2 border-gray-200 py-3 rounded-lg font-bold hover:bg-gray-50 hover:border-red-200 transition duration-300 shadow-sm group">
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
            </svg>
            <span className="group-hover:text-red-600 transition-colors">Đăng nhập bằng Google</span>
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            {isSignUp ? 'Đã có tài khoản?' : 'Chưa có tài khoản?'}
            <button onClick={() => { setIsSignUp(!isSignUp); setMessage(null) }} className="ml-2 text-red-600 font-bold hover:underline">
              {isSignUp ? 'Đăng nhập ngay' : 'Đăng ký ngay'}
            </button>
          </p>
        </div>
      </div>
    </div>
  )
}