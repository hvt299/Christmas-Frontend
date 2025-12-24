'use client'
import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import confetti from 'canvas-confetti'
import { motion, AnimatePresence } from 'framer-motion'
import { Gift, Music, User, Snowflake } from 'lucide-react'
import { useMusicStore } from '@/store/useMusicStore'
import Link from 'next/link'

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3000'

// 1. BẢNG MÀU THEO THEME HỘP QUÀ 🎨
const themeMap: Record<string, { headerBg: string, headerText: string, accent: string, giftStyle: string, glowColor: string }> = {
    red_box: {
        headerBg: 'bg-red-700',
        headerText: 'text-white',
        accent: 'text-yellow-300',
        giftStyle: 'text-white fill-red-600', // Viền trắng, ruột đỏ
        glowColor: 'bg-red-500'
    },
    green_box: {
        headerBg: 'bg-green-700',
        headerText: 'text-white',
        accent: 'text-yellow-300',
        giftStyle: 'text-white fill-green-500', // Viền trắng, ruột xanh
        glowColor: 'bg-green-400'
    },
    gold_box: {
        headerBg: 'bg-yellow-500',
        headerText: 'text-red-900',
        accent: 'text-red-700',
        giftStyle: 'text-white fill-yellow-400', // Viền trắng, ruột vàng
        glowColor: 'bg-yellow-300'
    },
    default: {
        headerBg: 'bg-red-700',
        headerText: 'text-white',
        accent: 'text-yellow-300',
        giftStyle: 'text-white fill-red-600',
        glowColor: 'bg-red-500'
    }
};

export default function OpenGiftPage() {
    const params = useParams()
    const [gift, setGift] = useState<any>(null)
    const [loading, setLoading] = useState(true)
    const [isOpened, setIsOpened] = useState(false)
    const [error, setError] = useState('')
    const { setSong } = useMusicStore()

    useEffect(() => {
        const fetchGift = async () => {
            try {
                const res = await fetch(`${BACKEND_URL}/gifts/${params.id}`)
                if (!res.ok) throw new Error('Hộp quà này không tồn tại hoặc đã bị lạc mất!')
                const data = await res.json()
                setGift(data)
                if (data.musicUrl) setSong(data.musicUrl)
            } catch (err: any) {
                setError(err.message)
            } finally {
                setLoading(false)
            }
        }
        fetchGift()
    }, [params.id, setSong])

    const handleOpen = () => {
        setIsOpened(true)
        // Hiệu ứng pháo giấy: Bắn màu theo theme của hộp quà
        const colors = gift.theme === 'gold_box'
            ? ['#FFD700', '#FFA500', '#FFFFFF']
            : ['#ff0000', '#00ff00', '#ffffff'];

        const duration = 3000
        const end = Date.now() + duration
        const frame = () => {
            confetti({ particleCount: 5, angle: 60, spread: 55, origin: { x: 0 }, colors })
            confetti({ particleCount: 5, angle: 120, spread: 55, origin: { x: 1 }, colors })
            if (Date.now() < end) requestAnimationFrame(frame)
        }
        frame()

        const audioBtn = document.querySelector('button[aria-label="Play Music"]') as HTMLButtonElement
        if (audioBtn) audioBtn.click()
    }

    // Xác định theme màu hiện tại
    const currentTheme = gift ? (themeMap[gift.theme] || themeMap.default) : themeMap.default;


    // --- GIAO DIỆN LOADING (NỀN XANH) ---
    if (loading) return (
        // Đổi thành bg-green-900 👇
        <div className="min-h-screen bg-green-900 flex items-center justify-center text-white relative overflow-hidden">
            <div className="absolute inset-0 opacity-20 pointer-events-none">
                <Snowflake className="absolute top-10 left-10 w-12 h-12 text-white animate-spin-slow" />
                <Snowflake className="absolute bottom-20 right-20 w-16 h-16 text-white animate-bounce" />
            </div>
            <div className="z-10 flex items-center">
                <Snowflake className="animate-spin-slow w-10 h-10 text-yellow-300" />
                <span className="ml-2 font-serif animate-pulse">Đang tìm hộp quà...</span>
            </div>
        </div>
    )

    // --- GIAO DIỆN ERROR (NỀN XANH) ---
    if (error) return (
        // Đổi thành bg-green-900 👇
        <div className="min-h-screen bg-green-900 flex items-center justify-center text-white relative overflow-hidden">
            <div className="absolute inset-0 opacity-20 pointer-events-none">
                <Snowflake className="absolute top-10 left-10 w-12 h-12 text-white animate-spin-slow" />
                <Snowflake className="absolute bottom-20 right-20 w-16 h-16 text-white animate-bounce" />
            </div>
            <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-md z-10 border-4 border-yellow-400 text-center relative">
                <h1 className="text-4xl mb-4">😢</h1>
                <p className="text-xl font-serif text-green-800">{error}</p>
                <Link href="/" className="mt-6 inline-block bg-green-600 text-white px-6 py-2 rounded-full font-bold hover:bg-green-700 transition">
                    Về trang chủ
                </Link>
            </div>
        </div>
    )

    // --- GIAO DIỆN CHÍNH (NỀN XANH) ---
    return (
        // Đổi thành bg-green-900 👇
        <div className="min-h-screen flex items-center justify-center bg-green-900 relative overflow-hidden p-4">

            {/* Trang trí nền */}
            <div className="absolute inset-0 opacity-20 pointer-events-none">
                <Snowflake className="absolute top-10 left-10 w-12 h-12 text-white animate-spin-slow" />
                <Snowflake className="absolute bottom-20 right-20 w-16 h-16 text-white animate-bounce" />
            </div>

            {/* KHUNG CHỨA NỘI DUNG */}
            <div className="relative z-10 w-full max-w-lg">
                <AnimatePresence mode='wait'>
                    {!isOpened ? (
                        /* --- TRẠNG THÁI 1: HỘP QUÀ ĐÓNG --- */
                        <motion.div
                            key="closed-box"
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 1.5, opacity: 0 }}
                            className="flex flex-col items-center justify-center cursor-pointer w-full"
                            onClick={handleOpen}
                        >
                            <div className="relative group flex flex-col items-center justify-center text-center">

                                {/* 1. HỘP QUÀ (Thêm hiệu ứng hào quang phía sau để tách nền) */}
                                <motion.div
                                    animate={{
                                        rotate: [0, -5, 5, -5, 5, 0],
                                        y: [0, -10, 0]
                                    }}
                                    transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}
                                    className="relative flex items-center justify-center mb-6"
                                >
                                    {/* 1. Hào quang màu phía sau (Glow) - Lấy màu từ themeMap */}
                                    <div className={`absolute inset-0 blur-[60px] rounded-full scale-125 animate-pulse opacity-60 ${currentTheme.glowColor}`}></div>

                                    {/* 2. Hộp quà: Viền trắng (text-white) + Ruột màu (fill-...) */}
                                    <Gift
                                        size={220}
                                        strokeWidth={1.5} // Viền mỏng lại chút cho đẹp
                                        className={`relative z-10 drop-shadow-[0_10px_20px_rgba(0,0,0,0.5)] ${currentTheme.giftStyle}`}
                                    />
                                </motion.div>

                                {/* 2. NÚT BẤM (Style Vàng Kim Loại - Cực kỳ nổi trên nền xanh) */}
                                <div className="relative z-20 group-hover:scale-105 transition-transform duration-300">
                                    <div className="absolute inset-0 bg-yellow-600 rounded-full blur opacity-50 offset-y-2"></div>
                                    <p className="relative text-2xl text-red-900 font-bold font-serif animate-bounce text-center bg-gradient-to-b from-yellow-300 to-yellow-500 px-10 py-4 rounded-full border-2 border-yellow-200 shadow-[0_5px_15px_rgba(0,0,0,0.3)]">
                                        Chạm để mở quà
                                    </p>
                                </div>

                                {/* 3. THẺ TÊN (Style Gift Tag - Giấy trắng chữ đậm) */}
                                <div className="mt-8 relative z-10">
                                    {/* Dây treo thẻ (Trang trí) */}
                                    <div className="w-[2px] h-8 bg-white/50 mx-auto -mt-4 mb-0"></div>

                                    {/* Nội dung thẻ */}
                                    <div className="bg-white/95 backdrop-blur-sm px-6 py-2 rounded-lg shadow-lg border-2 border-white/20 transform rotate-[-2deg] hover:rotate-0 transition-transform">
                                        <p className="text-gray-500 text-xs uppercase tracking-widest mb-0.5">Gửi tới</p>
                                        <p className={`text-2xl font-bold ${currentTheme.headerBg.replace('bg-', 'text-')}`}>
                                            {gift.receiverName}
                                        </p>
                                    </div>
                                </div>

                            </div>
                        </motion.div>
                    ) : (
                        /* --- TRẠNG THÁI 2: THIỆP (Header màu động) --- */
                        <motion.div
                            key="message-card"
                            initial={{ y: 50, opacity: 0, rotateX: 90 }}
                            animate={{ y: 0, opacity: 1, rotateX: 0 }}
                            transition={{ type: "spring", stiffness: 100, damping: 20 }}
                            // Bỏ padding ở container chính để header tràn viền
                            className="bg-white rounded-2xl shadow-2xl w-full border-4 border-yellow-400 relative overflow-hidden"
                        >
                            {/* 2. HEADER THIỆP ĐỘNG (Dynamic Color Header) 🎨 */}
                            <div className={`${currentTheme.headerBg} ${currentTheme.headerText} p-6 text-center relative`}>
                                <Snowflake className="absolute top-3 left-3 w-6 h-6 opacity-40 animate-spin-slow" />
                                <Snowflake className="absolute bottom-3 right-3 w-8 h-8 opacity-40 animate-pulse" />

                                <h2 className="text-3xl font-bold font-serif mb-1">Giáng Sinh An Lành</h2>
                                {/* Đường gạch chân màu accent */}
                                <div className={`w-16 h-1 mx-auto rounded-full mb-3 opacity-80 bg-current ${currentTheme.accent.replace('text', 'bg')}`}></div>

                                <div className={`flex items-center justify-center gap-2 text-sm py-1 px-4 rounded-full inline-flex backdrop-blur-sm bg-white/10`}>
                                    <User size={16} />
                                    <span>Người gửi:</span>
                                    <span className={`font-bold text-lg ${currentTheme.accent}`}>
                                        {gift.sender ? gift.sender.displayName : 'Người bí ẩn 🎅'}
                                    </span>
                                </div>
                            </div>

                            {/* Nội dung lời chúc (Có padding ở đây) */}
                            <div className="p-6 md:p-8 text-center">
                                <p className="text-gray-500 italic mb-4 font-serif text-sm text-left">Thân gửi {gift.receiverName},</p>
                                <div className="text-xl md:text-2xl font-handwriting leading-relaxed text-gray-800 mb-8 whitespace-pre-wrap">
                                    "{gift.content}"
                                </div>

                                <div className={`flex justify-center gap-4 mb-6 opacity-50 ${gift.theme === 'green_box' ? 'text-green-300' : gift.theme === 'gold_box' ? 'text-yellow-500' : 'text-red-300'}`}>
                                    <Gift /> <Music className="animate-bounce" /> <Gift />
                                </div>
                            </div>

                            <div className="bg-gray-50 p-4 text-center border-t">
                                <Link href="/" className={`text-sm hover:underline font-bold ${gift.theme === 'green_box' ? 'text-green-700' : 'text-red-700'}`}>
                                    Tạo hộp quà của riêng bạn
                                </Link>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    )
}