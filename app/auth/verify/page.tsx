'use client'
import { useEffect, useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Snowflake, CheckCircle, XCircle } from 'lucide-react'
import axios from 'axios'

function VerifyContent() {
    const searchParams = useSearchParams()
    const token = searchParams.get('token')

    const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')
    const [message, setMessage] = useState('Đang kiểm tra danh sách của Ông già Noel...')

    useEffect(() => {
        if (!token) {
            setStatus('error')
            setMessage('Không tìm thấy mã xác thực. Vui lòng kiểm tra lại đường link trong email!')
            return
        }

        const verifyEmailToken = async () => {
            try {
                const API_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3001'
                const response = await axios.get(`${API_URL}/auth/verify?token=${token}`)
                setStatus('success')
                setMessage(response.data.message || 'Tài khoản của bạn đã được kích hoạt thành công!')
            } catch (err: any) {
                setStatus('error')
                setMessage(err.response?.data?.message || 'Link xác thực không hợp lệ hoặc đã hết hạn.')
            }
        }
        verifyEmailToken()
    }, [token])

    if (status === 'loading') {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center text-white z-10 relative">
                <Snowflake className="w-16 h-16 animate-spin-slow text-yellow-400 mb-4" />
                <p className="text-xl font-serif animate-pulse">{message}</p>
            </div>
        )
    }

    return (
        <div className="bg-white p-8 rounded-2xl shadow-2xl max-w-md w-full text-center border-4 border-yellow-400 z-10 relative animate-fade-in-up">
            {status === 'success' ? (
                <>
                    <CheckCircle className="w-20 h-20 text-green-500 mx-auto mb-6 animate-bounce" />
                    <h2 className="text-2xl md:text-3xl font-bold text-red-800 mb-4">Xác Thực Thành Công!</h2>
                    <p className="text-gray-600 text-sm md:text-base mb-8">{message}</p>
                    <Link href="/login" className="bg-red-600 text-white py-3 px-8 rounded-lg font-bold hover:bg-red-700 transition duration-300 shadow-md">
                        Đăng Nhập Ngay
                    </Link>
                </>
            ) : (
                <>
                    <XCircle className="w-20 h-20 text-red-500 mx-auto mb-6" />
                    <h2 className="text-2xl md:text-3xl font-bold text-red-800 mb-4">Xác Thực Thất Bại</h2>
                    <p className="text-gray-600 text-sm md:text-base mb-8">{message}</p>
                    <Link href="/login" className="border-2 border-red-600 text-red-600 py-3 px-8 rounded-lg font-bold hover:bg-red-50 transition duration-300">
                        Về Trang Đăng Nhập
                    </Link>
                </>
            )}
        </div>
    )
}

export default function VerifyPage() {
    return (
        <main className="min-h-screen flex items-center justify-center bg-red-900 relative overflow-hidden p-4">
            <div className="absolute inset-0 opacity-20 pointer-events-none">
                <Snowflake className="absolute top-10 left-10 w-12 h-12 text-white animate-spin-slow" />
                <Snowflake className="absolute bottom-20 right-20 w-16 h-16 text-white animate-bounce" />
            </div>
            <Suspense fallback={<div className="text-white z-10 relative">Đang tải dữ liệu...</div>}>
                <VerifyContent />
            </Suspense>
        </main>
    )
}