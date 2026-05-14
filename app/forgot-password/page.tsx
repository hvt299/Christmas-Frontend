'use client'
import { useState } from 'react'
import Link from 'next/link'
import { Snowflake, Mail, ArrowLeft, Send, Loader2 } from 'lucide-react'
import api from '@/lib/api'

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState('')
    const [loading, setLoading] = useState(false)
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)

    const handleReset = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setMessage(null)

        try {
            const res = await api.post('/auth/forgot-password', { email })
            setMessage({ type: 'success', text: res.data.message || 'Đã gửi link khôi phục! Vui lòng kiểm tra email (cả mục spam nhé).' })
            setEmail('')
        } catch (error: any) {
            const errorMsg = error.response?.data?.message
            setMessage({ type: 'error', text: errorMsg || 'Có lỗi xảy ra!' })
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-red-900 relative overflow-hidden p-4">
            <div className="absolute inset-0 opacity-20 pointer-events-none">
                <Snowflake className="absolute top-10 left-10 w-12 h-12 text-white animate-spin-slow" />
                <Snowflake className="absolute bottom-20 right-20 w-16 h-16 text-white animate-bounce" />
            </div>

            <div className="bg-white p-6 md:p-8 rounded-2xl shadow-2xl w-full max-w-md z-10 border-4 border-yellow-400 relative animate-fade-in-up">
                <Link href="/login" className="absolute top-3 left-3 md:top-4 md:left-4 p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-full transition-all" title="Quay lại trang đăng nhập">
                    <ArrowLeft className="w-6 h-6" />
                </Link>

                <div className="text-center mb-6 mt-6 md:mt-4">
                    <div className="flex justify-center mb-4">
                        <LockResetIcon className="w-12 h-12 md:w-16 md:h-16 text-red-600 mb-2" />
                    </div>
                    <h2 className="text-2xl md:text-3xl font-bold text-red-800">Quên Mật Khẩu?</h2>
                    <p className="text-gray-500 text-xs md:text-sm mt-1">Đừng lo, hãy nhập email để Ông già Noel gửi chìa khóa mới cho bạn!</p>
                </div>

                <form onSubmit={handleReset} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Email đã đăng ký</label>
                        <div className="relative mt-1">
                            <Mail className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                            <input type="email" required className="block w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-red-500 focus:border-red-500" placeholder="santa@northpole.com" value={email} onChange={(e) => setEmail(e.target.value)} />
                        </div>
                    </div>

                    {message && (
                        <div className={`p-3 rounded text-sm ${message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                            {message.text}
                        </div>
                    )}

                    <button type="submit" disabled={loading} className="w-full flex items-center justify-center gap-2 bg-red-600 text-white py-3 rounded-lg font-bold hover:bg-red-700 transition duration-300 shadow-md disabled:opacity-70 mt-2">
                        {loading ? <Loader2 className="animate-spin w-5 h-5" /> : <Send className="w-5 h-5" />}
                        Gửi Link Khôi Phục
                    </button>
                </form>
            </div>
        </div>
    )
}

function LockResetIcon({ className }: { className?: string }) {
    return (
        <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
            <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            <path d="M12 16v1" />
        </svg>
    )
}