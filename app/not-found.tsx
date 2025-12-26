import Link from 'next/link'
import { Snowflake, Home, MapPinOff } from 'lucide-react'

export default function NotFound() {
    return (
        <div className="min-h-screen bg-green-900 flex items-center justify-center p-4 relative overflow-hidden text-white">

            {/* 1. Hiệu ứng tuyết rơi nền */}
            <div className="absolute inset-0 opacity-10 pointer-events-none">
                <Snowflake className="absolute top-10 left-10 w-20 h-20 animate-spin-slow" />
                <Snowflake className="absolute bottom-20 right-20 w-32 h-32 animate-bounce" />
                <Snowflake className="absolute top-1/2 left-1/2 w-40 h-40 opacity-5" />
            </div>

            <div className="relative z-10 text-center max-w-lg mx-auto">

                {/* Icon chính */}
                <div className="flex justify-center mb-6">
                    <div className="bg-white/10 p-6 rounded-full border-2 border-white/20 backdrop-blur-sm shadow-[0_0_30px_rgba(255,255,255,0.2)]">
                        <MapPinOff className="w-16 h-16 md:w-20 md:h-20 text-yellow-400" />
                    </div>
                </div>

                {/* Số 404 lớn */}
                <h1 className="text-8xl md:text-9xl font-bold font-serif text-transparent bg-clip-text bg-gradient-to-b from-yellow-300 to-yellow-600 drop-shadow-lg mb-2">
                    404
                </h1>

                <h2 className="text-2xl md:text-3xl font-bold mb-4">Lạc đường rồi! 🦌</h2>

                <p className="text-white/80 text-base md:text-lg mb-8 leading-relaxed px-4">
                    Có vẻ như trang bạn đang tìm đã bị tuyết phủ kín hoặc Ông già Noel đã mang nó đi mất rồi.
                </p>

                {/* Nút về trang chủ */}
                <Link
                    href="/"
                    className="group inline-flex items-center gap-3 bg-red-600 hover:bg-red-700 text-white px-8 py-4 rounded-full font-bold text-lg transition-all shadow-[0_0_20px_rgba(220,38,38,0.4)] hover:shadow-[0_0_40px_rgba(220,38,38,0.6)] hover:scale-105"
                >
                    <Home className="w-5 h-5 group-hover:-translate-y-1 transition-transform" />
                    <span>Quay về trang chủ</span>
                </Link>
            </div>

            {/* Footer nhỏ */}
            <div className="absolute bottom-4 text-white/30 text-xs">
                Lost in the snow?
            </div>
        </div>
    )
}