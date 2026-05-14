'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, User, Camera, Lock, Save, Snowflake, Loader2, Settings, KeyRound } from 'lucide-react'
import api from '@/lib/api'

const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/

export default function ProfilePage() {
    const router = useRouter()

    const [loading, setLoading] = useState(false)
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)

    const [fullName, setFullName] = useState('')
    const [avatarUrl, setAvatarUrl] = useState('')

    const [currentPassword, setCurrentPassword] = useState('')
    const [newPassword, setNewPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')

    useEffect(() => {
        const userInfoStr = localStorage.getItem('user_info')
        const token = localStorage.getItem('access_token')

        if (!userInfoStr || !token) {
            router.push('/login')
            return
        }

        try {
            const user = JSON.parse(userInfoStr)
            setFullName(user.fullName || user.username || '')
            setAvatarUrl(user.avatar || '')
        } catch (error) {
            console.error('Lỗi đọc thông tin user', error)
        }
    }, [router])

    const handleUpdateProfile = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setMessage(null)

        try {
            const res = await api.put('/users/profile', {
                fullName: fullName,
                avatar: avatarUrl
            })

            const updatedUser = res.data.user || res.data;
            const currentUserStr = localStorage.getItem('user_info')
            if (currentUserStr) {
                const currentUser = JSON.parse(currentUserStr)
                localStorage.setItem('user_info', JSON.stringify({ ...currentUser, fullName: updatedUser.fullName, avatar: updatedUser.avatar }))
            }

            setMessage({ type: 'success', text: 'Cập nhật hồ sơ thành công!' })

            setTimeout(() => {
                window.location.reload()
            }, 1000)

        } catch (error: any) {
            const errorMsg = error.response?.data?.message
            setMessage({ type: 'error', text: Array.isArray(errorMsg) ? errorMsg[0] : (errorMsg || 'Cập nhật thất bại!') })
        } finally {
            setLoading(false)
        }
    }

    const handleChangePassword = async (e: React.FormEvent) => {
        e.preventDefault()
        setMessage(null)

        if (!currentPassword) {
            setMessage({ type: 'error', text: 'Vui lòng nhập mật khẩu hiện tại!' })
            return
        }

        if (!passwordRegex.test(newPassword)) {
            setMessage({ type: 'error', text: 'Mật khẩu mới quá yếu! Yêu cầu tối thiểu 8 ký tự, gồm 1 chữ hoa, 1 chữ thường, 1 số và 1 đặc biệt.' })
            return
        }

        if (newPassword !== confirmPassword) {
            setMessage({ type: 'error', text: 'Mật khẩu xác nhận không khớp!' })
            return
        }

        setLoading(true)

        try {
            await api.put('/auth/change-password', {
                currentPassword,
                newPassword
            })

            setMessage({ type: 'success', text: 'Đổi mật khẩu thành công! Hãy nhớ mật khẩu mới nhé!' })
            setCurrentPassword('')
            setNewPassword('')
            setConfirmPassword('')
        } catch (error: any) {
            const errorMsg = error.response?.data?.message
            setMessage({ type: 'error', text: Array.isArray(errorMsg) ? errorMsg[0] : (errorMsg || 'Đổi mật khẩu thất bại!') })
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
                <div className="md:w-1/3 bg-linear-to-b from-red-600 to-red-800 p-6 md:p-8 flex flex-col items-center justify-center text-white text-center relative overflow-hidden">
                    <div className="absolute inset-0 opacity-30 pointer-events-none">
                        <Snowflake className="absolute top-5 right-5 w-8 h-8 animate-spin-slow" />
                        <Snowflake className="absolute bottom-10 left-5 w-10 h-10 animate-bounce" />
                    </div>

                    <div className="relative w-32 h-32 mb-4 group z-10">
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
                    <h2 className="text-2xl font-bold font-serif z-10">{fullName || 'Chưa đặt tên'}</h2>
                    <p className="text-red-200 text-sm mt-2 z-10">Thành viên ưu tú của Santa Claus</p>
                </div>

                {/* CỘT PHẢI: Form Edit */}
                <div className="md:w-2/3 p-5 md:p-8 bg-white">
                    <h1 className="text-xl md:text-3xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                        <Settings className="text-red-600" /> Cài Đặt Tài Khoản
                    </h1>

                    {message && (
                        <div className={`mb-6 p-4 rounded-lg text-sm font-medium border ${message.type === 'success' ? 'bg-green-50 border-green-200 text-green-700' : 'bg-red-50 border-red-200 text-red-700'}`}>
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
                            className="w-full md:w-auto justify-center flex items-center gap-2 px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition shadow-md disabled:opacity-50"
                        >
                            {loading ? <Loader2 className="animate-spin w-4 h-4" /> : <Save className="w-4 h-4" />}
                            Lưu Thay Đổi
                        </button>
                    </form>

                    {/* Phần 2: Bảo mật */}
                    <form onSubmit={handleChangePassword} className="space-y-4">
                        <h3 className="text-lg font-semibold text-gray-700 border-b pb-2 mt-8">Đổi mật khẩu</h3>

                        <div className="space-y-4">
                            {/* Mật khẩu hiện tại */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Mật khẩu hiện tại</label>
                                <div className="relative">
                                    <KeyRound className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                                    <input
                                        type="password"
                                        required
                                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-red-500 focus:border-red-500"
                                        placeholder="••••••••"
                                        value={currentPassword}
                                        onChange={(e) => setCurrentPassword(e.target.value)}
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Mật khẩu mới</label>
                                    <div className="relative">
                                        <Lock className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                                        <input
                                            type="password"
                                            required
                                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-red-500 focus:border-red-500"
                                            placeholder="Min 8 ký tự, 1 hoa, 1 số, 1 đặc biệt"
                                            value={newPassword}
                                            onChange={(e) => setNewPassword(e.target.value)}
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Nhập lại mật khẩu mới</label>
                                    <div className="relative">
                                        <Lock className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                                        <input
                                            type="password"
                                            required
                                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-red-500 focus:border-red-500"
                                            placeholder="••••••••"
                                            value={confirmPassword}
                                            onChange={(e) => setConfirmPassword(e.target.value)}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading || !newPassword}
                            className="w-full md:w-auto justify-center flex items-center gap-2 px-6 py-2 mt-2 bg-gray-800 text-white rounded-lg hover:bg-black transition shadow-md disabled:opacity-50"
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