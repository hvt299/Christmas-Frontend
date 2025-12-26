'use client'
import { useState, useEffect } from 'react'
import { createClient } from '@/utils/supabase/client'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, User, Camera, Lock, Save, Snowflake, Loader2, Settings } from 'lucide-react'

export default function ProfilePage() {
    const supabase = createClient()
    const router = useRouter()

    const [loading, setLoading] = useState(false)
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)

    // State cho thông tin Profile
    const [fullName, setFullName] = useState('')
    const [avatarUrl, setAvatarUrl] = useState('')

    // State cho đổi mật khẩu
    const [newPassword, setNewPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')

    useEffect(() => {
        const getProfile = async () => {
            const { data: { user } } = await supabase.auth.getUser()
            if (!user) {
                router.push('/login')
                return
            }

            // Lấy thông tin từ metadata
            setFullName(user.user_metadata?.full_name || '')
            setAvatarUrl(user.user_metadata?.avatar_url || '')
        }
        getProfile()
    }, [router, supabase])

    // Xử lý cập nhật thông tin chung
    const handleUpdateProfile = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setMessage(null)

        try {
            const { error } = await supabase.auth.updateUser({
                data: {
                    full_name: fullName,
                    avatar_url: avatarUrl
                }
            })

            if (error) throw error

            setMessage({ type: 'success', text: 'Cập nhật hồ sơ thành công!' })
            router.refresh() // Refresh để cập nhật avatar trên thanh menu nếu có
        } catch (error: any) {
            setMessage({ type: 'error', text: error.message })
        } finally {
            setLoading(false)
        }
    }

    // Xử lý đổi mật khẩu
    const handleChangePassword = async (e: React.FormEvent) => {
        e.preventDefault()
        if (newPassword !== confirmPassword) {
            setMessage({ type: 'error', text: 'Mật khẩu xác nhận không khớp!' })
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

            setMessage({ type: 'success', text: 'Đổi mật khẩu thành công! Hãy nhớ mật khẩu mới nhé!' })
            setNewPassword('')
            setConfirmPassword('')
        } catch (error: any) {
            setMessage({ type: 'error', text: error.message })
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-red-900 flex items-center justify-center p-4 relative overflow-hidden">

            {/* Background Decor */}
            <div className="absolute inset-0 pointer-events-none opacity-20">
                <Snowflake className="absolute top-10 left-10 w-20 h-20 text-white animate-spin-slow" />
                <Snowflake className="absolute bottom-20 right-20 w-32 h-32 text-white animate-pulse" />
            </div>

            <div className="w-full max-w-4xl bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row relative z-10 border-4 border-yellow-400">

                {/* Nút Back */}
                <Link href="/" className="absolute top-4 left-4 z-20 p-2 bg-gray-100 hover:bg-gray-200 rounded-full transition">
                    <ArrowLeft className="w-6 h-6 text-gray-700" />
                </Link>

                {/* CỘT TRÁI: Avatar Preview */}
                <div className="md:w-1/3 bg-gradient-to-b from-red-600 to-red-800 p-8 flex flex-col items-center justify-center text-white text-center">
                    <div className="relative w-32 h-32 mb-4 group">
                        <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-yellow-400 bg-white shadow-lg">
                            {avatarUrl ? (
                                <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center bg-gray-200 text-gray-400">
                                    <User className="w-16 h-16" />
                                </div>
                            )}
                        </div>
                        <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition duration-300">
                            <span className="text-xs font-bold">Xem trước</span>
                        </div>
                    </div>
                    <h2 className="text-2xl font-bold font-serif">{fullName || 'Chưa đặt tên'}</h2>
                    <p className="text-red-200 text-sm mt-2">Thành viên ưu tú của Santa Claus</p>
                </div>

                {/* CỘT PHẢI: Form Edit */}
                <div className="md:w-2/3 p-8 bg-white">
                    <h1 className="text-3xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                        <Settings className="text-red-600" /> Cài Đặt Tài Khoản
                    </h1>

                    {message && (
                        <div className={`mb-6 p-4 rounded-lg text-sm font-medium ${message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                            {message.text}
                        </div>
                    )}

                    {/* Phần 1: Thông tin chung */}
                    <form onSubmit={handleUpdateProfile} className="space-y-4 mb-8">
                        <h3 className="text-lg font-semibold text-gray-700 border-b pb-2">Thông tin cá nhân</h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Tên hiển thị</label>
                                <div className="relative">
                                    <User className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                                    <input
                                        type="text"
                                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-red-500 focus:border-red-500"
                                        placeholder="Nhập tên của bạn"
                                        value={fullName}
                                        onChange={(e) => setFullName(e.target.value)}
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Link Avatar (URL)</label>
                                <div className="relative">
                                    <Camera className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                                    <input
                                        type="text"
                                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-red-500 focus:border-red-500"
                                        placeholder="https://..."
                                        value={avatarUrl}
                                        onChange={(e) => setAvatarUrl(e.target.value)}
                                    />
                                </div>
                                <p className="text-xs text-gray-500 mt-1">Dán link ảnh từ internet vào đây</p>
                            </div>
                        </div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex items-center gap-2 px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition disabled:opacity-50"
                        >
                            {loading ? <Loader2 className="animate-spin w-4 h-4" /> : <Save className="w-4 h-4" />}
                            Lưu Thay Đổi
                        </button>
                    </form>

                    {/* Phần 2: Bảo mật */}
                    <form onSubmit={handleChangePassword} className="space-y-4">
                        <h3 className="text-lg font-semibold text-gray-700 border-b pb-2 mt-8">Đổi mật khẩu</h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Mật khẩu mới</label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                                    <input
                                        type="password"
                                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-red-500 focus:border-red-500"
                                        placeholder="••••••"
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Nhập lại mật khẩu</label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                                    <input
                                        type="password"
                                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-red-500 focus:border-red-500"
                                        placeholder="••••••"
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                    />
                                </div>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading || !newPassword}
                            className="flex items-center gap-2 px-6 py-2 bg-gray-800 text-white rounded-lg hover:bg-black transition disabled:opacity-50"
                        >
                            {loading ? <Loader2 className="animate-spin w-4 h-4" /> : <Lock className="w-4 h-4" />}
                            Cập Nhật Mật Khẩu
                        </button>
                    </form>

                </div>
            </div>
        </div>
    )
}