'use client'
import { useState, useEffect } from 'react'
import { createClient } from '@/utils/supabase/client'
import { useRouter } from 'next/navigation'
import { Snowflake, Lock, Save, Loader2 } from 'lucide-react'

export default function ResetPasswordPage() {
    const [newPassword, setNewPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [loading, setLoading] = useState(false)
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)

    const router = useRouter()
    const supabase = createClient()

    // Bảo vệ route: Nếu không có session (link lỗi hoặc hết hạn) -> Về trang chủ
    useEffect(() => {
        const checkSession = async () => {
            const { data: { session } } = await supabase.auth.getSession()
            if (!session) {
                router.replace('/login')
            }
        }
        checkSession()
    }, [router, supabase])

    const handleUpdatePassword = async (e: React.FormEvent) => {
        e.preventDefault()

        if (newPassword !== confirmPassword) {
            setMessage({ type: 'error', text: 'Mật khẩu nhập lại không khớp!' })
            return
        }
        if (newPassword.length < 6) {
            setMessage({ type: 'error', text: 'Mật khẩu phải có ít nhất 6 ký tự' })
            return
        }

        setLoading(true)
        setMessage(null)

        try {
            const { error } = await supabase.auth.updateUser({
                password: newPassword
            })

            if (error) throw error

            setMessage({ type: 'success', text: 'Đổi mật khẩu thành công! Đang chuyển về trang chủ...' })

            // Đợi 2 giây rồi về trang chủ
            setTimeout(() => {
                router.push('/')
            }, 2000)

        } catch (error: any) {
            setMessage({ type: 'error', text: error.message })
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-green-900 relative overflow-hidden p-4">

            <div className="absolute inset-0 opacity-20 pointer-events-none">
                <Snowflake className="absolute top-10 left-10 w-12 h-12 text-white animate-spin-slow" />
                <Snowflake className="absolute bottom-20 right-20 w-16 h-16 text-white animate-bounce" />
            </div>

            <div className="bg-white p-6 md:p-8 rounded-2xl shadow-2xl w-full max-w-md z-10 border-4 border-yellow-400 relative">

                <div className="text-center mb-6">
                    <h2 className="text-2xl md:text-3xl font-bold text-green-800">Đặt Mật Khẩu Mới</h2>
                    <p className="text-gray-500 text-sm mt-2">Nhập mật khẩu mới của bạn bên dưới nhé</p>
                </div>

                <form onSubmit={handleUpdatePassword} className="space-y-4">

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Mật khẩu mới</label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                            <input
                                type="password"
                                required
                                className="block w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500"
                                placeholder="••••••••"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Xác nhận mật khẩu</label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                            <input
                                type="password"
                                required
                                className="block w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500"
                                placeholder="••••••••"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                            />
                        </div>
                    </div>

                    {message && (
                        <div className={`p-3 rounded text-sm font-medium ${message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                            {message.text}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full flex items-center justify-center gap-2 bg-green-600 text-white py-3 rounded-lg font-bold hover:bg-green-700 transition shadow-md"
                    >
                        {loading ? <Loader2 className="animate-spin w-5 h-5" /> : <Save className="w-5 h-5" />}
                        Lưu Mật Khẩu Mới
                    </button>
                </form>
            </div>
        </div>
    )
}