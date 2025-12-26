'use client'
import Link from 'next/link'
import { AlertTriangle, Home, ArrowLeft } from 'lucide-react'

export default function AuthErrorPage() {
    return (
        <div className="min-h-screen bg-red-900 flex items-center justify-center p-4 text-center">
            <div className="bg-white p-8 rounded-2xl shadow-2xl max-w-md w-full border-4 border-yellow-400">

                <div className="flex justify-center mb-4">
                    <div className="bg-red-100 p-4 rounded-full">
                        <AlertTriangle className="w-12 h-12 text-red-600" />
                    </div>
                </div>

                <h1 className="text-2xl font-bold text-gray-800 mb-2">Đăng nhập không thành công</h1>

                <p className="text-gray-600 mb-6">
                    Có vẻ như bạn đã hủy quá trình đăng nhập hoặc phiên làm việc đã hết hạn. Đừng lo, hãy thử lại nhé!
                </p>

                <div className="flex flex-col gap-3">
                    <Link
                        href="/login"
                        className="w-full bg-red-600 text-white py-3 rounded-lg font-bold hover:bg-red-700 transition flex items-center justify-center gap-2"
                    >
                        <ArrowLeft className="w-5 h-5" /> Thử đăng nhập lại
                    </Link>

                    <Link
                        href="/"
                        className="w-full bg-gray-100 text-gray-700 py-3 rounded-lg font-bold hover:bg-gray-200 transition flex items-center justify-center gap-2"
                    >
                        <Home className="w-5 h-5" /> Về trang chủ
                    </Link>
                </div>
            </div>
        </div>
    )
}