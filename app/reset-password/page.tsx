'use client'
import { useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Snowflake, Lock, Save, Loader2, ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import api from '@/lib/api'

const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/

function ResetPasswordContent() {
    const searchParams = useSearchParams()
    const token = searchParams.get('token')
    const router = useRouter()

    const [newPassword, setNewPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [loading, setLoading] = useState(false)
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)

    const handleUpdatePassword = async (e: React.FormEvent) => {
        e.preventDefault()
        setMessage(null)

        if (!token) {
            setMessage({ type: 'error', text: 'Không tìm thấy mã khôi phục. Vui lòng kiểm tra email!' })
            return
        }

        if (!passwordRegex.test(newPassword)) {
            setMessage({ type: 'error', text: 'Mật khẩu quá yếu! Yêu cầu tối thiểu 8 ký tự, 1 hoa, 1 thường, 1 số và 1 ký tự đặc biệt.' })
            return
        }

        if (newPassword !== confirmPassword) {
            setMessage({ type: 'error', text: 'Mật khẩu nhập lại không khớp!' })
            return
        }

        setLoading(true)

        try {
            await api.post('/auth/reset-password', { token, newPassword })
            setMessage({ type: 'success', text: 'Đổi mật khẩu thành công! Đang chuyển về trang đăng nhập...' })
            setTimeout(() => router.push('/login'), 2500)
        } catch (error: any) {
            const errorMsg = error.response?.data?.message
            setMessage({ type: 'error', text: Array.isArray(errorMsg) ? errorMsg[0] : (errorMsg || 'Đổi mật khẩu thất bại!') })
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="bg-white p-6 md:p-8 rounded-2xl shadow-2xl w-full max-w-md z-10 border-4 border-yellow-400 relative animate-fade-in-up">
            <Link href="/login" className="absolute top-3 left-3 md:top-4 md:left-4 p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-full transition-all">
                <ArrowLeft className="w-6 h-6" />
            </Link>

            <div className="text-center mb-6 mt-6 md:mt-4">
                <Lock className="w-12 h-12 md:w-16 md:h-16 mx-auto text-red-600 mb-2" />
                <h2 className="text-2xl md:text-3xl font-bold text-red-800">Đặt Mật Khẩu Mới</h2>
                <p className="text-gray-500 text-xs md:text-sm mt-1">Hãy thiết lập một mật khẩu thật mạnh nhé!</p>
            </div>

            <form onSubmit={handleUpdatePassword} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700">Mật khẩu mới</label>
                    <div className="relative mt-1">
                        <Lock className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                        <input type="password" required className="block w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-red-500 focus:border-red-500" placeholder="Min 8 ký tự, 1 hoa, 1 số, 1 đặc biệt" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">Xác nhận mật khẩu</label>
                    <div className="relative mt-1">
                        <Lock className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                        <input type="password" required className="block w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-red-500 focus:border-red-500" placeholder="••••••••" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
                    </div>
                </div>

                {message && (
                    <div className={`p-3 rounded text-sm ${message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                        {message.text}
                    </div>
                )}

                <button type="submit" disabled={loading} className="w-full flex items-center justify-center gap-2 bg-red-600 text-white py-3 rounded-lg font-bold hover:bg-red-700 transition duration-300 shadow-md disabled:opacity-70 mt-2">
                    {loading ? <Loader2 className="animate-spin w-5 h-5" /> : <Save className="w-5 h-5" />}
                    Lưu Mật Khẩu Mới
                </button>
            </form>
        </div>
    )
}

export default function ResetPasswordPage() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-red-900 relative overflow-hidden p-4">
            <div className="absolute inset-0 opacity-20 pointer-events-none">
                <Snowflake className="absolute top-10 left-10 w-12 h-12 text-white animate-spin-slow" />
                <Snowflake className="absolute bottom-20 right-20 w-16 h-16 text-white animate-bounce" />
            </div>
            <Suspense fallback={<div className="text-white z-10 relative">Đang tải dữ liệu...</div>}>
                <ResetPasswordContent />
            </Suspense>
        </div>
    )
}