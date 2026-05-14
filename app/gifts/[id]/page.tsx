'use client'
import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import confetti from 'canvas-confetti'
import { motion, AnimatePresence } from 'framer-motion'
import { Gift, Music, User, Snowflake } from 'lucide-react'
import { useMusicStore } from '@/store/useMusicStore'
import Link from 'next/link'
import api from '@/lib/api'

const themeMap: Record<string, { headerBg: string, headerText: string, accent: string, giftStyle: string, glowColor: string }> = {
    red_box: {
        headerBg: 'bg-red-700',
        headerText: 'text-white',
        accent: 'text-yellow-300',
        giftStyle: 'text-white fill-red-600',
        glowColor: 'bg-red-500'
    },
    green_box: {
        headerBg: 'bg-green-700',
        headerText: 'text-white',
        accent: 'text-yellow-300',
        giftStyle: 'text-white fill-green-500',
        glowColor: 'bg-green-400'
    },
    gold_box: {
        headerBg: 'bg-yellow-500',
        headerText: 'text-red-900',
        accent: 'text-red-700',
        giftStyle: 'text-white fill-yellow-400',
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
                const res = await api.get(`/gifts/${params.id}`)
                const data = res.data
                setGift(data)

                if (data.musicUrl) setSong(data.musicUrl)
            } catch (err: any) {
                const errorMsg = err.response?.data?.message || 'Hộp quà này không tồn tại hoặc đã bị lạc mất!'
                setError(Array.isArray(errorMsg) ? errorMsg[0] : errorMsg)
            } finally {
                setLoading(false)
            }
        }
        fetchGift()
    }, [params.id, setSong])

    const handleOpen = () => {
        setIsOpened(true)
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

    const currentTheme = gift ? (themeMap[gift.theme] || themeMap.default) : themeMap.default;

    if (loading) return (
        <div className="min-h-screen bg-green-900 flex items-center justify-center text-white relative overflow-hidden">
            <div className="absolute inset-0 opacity-20 pointer-events-none">
                <Snowflake className="absolute top-10 left-10 w-12 h-12 text-white animate-spin-slow" />
                <Snowflake className="absolute bottom-20 right-20 w-16 h-16 text-white animate-bounce" />
            </div>
            <div className="z-10 flex items-center">
                <Snowflake className="animate-spin-slow w-10 h-10 text-yellow-300" />
                <span className="ml-2 font-serif animate-pulse text-xl">Đang tìm hộp quà...</span>
            </div>
        </div>
    )

    if (error) return (
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

    const senderName = gift.sender ? (gift.sender.fullName || gift.sender.username) : 'Người bí ẩn 🎅';

    return (
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

                                {/* HỘP QUÀ */}
                                <motion.div
                                    animate={{
                                        rotate: [0, -5, 5, -5, 5, 0],
                                        y: [0, -10, 0]
                                    }}
                                    transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}
                                    className="relative flex items-center justify-center mb-6"
                                >
                                    <div className={`absolute inset-0 blur-[60px] rounded-full scale-125 animate-pulse opacity-60 ${currentTheme.glowColor}`}></div>
                                    <Gift
                                        strokeWidth={1.5}
                                        className={`relative z-10 w-40 h-40 md:w-56 md:h-56 drop-shadow-[0_10px_20px_rgba(0,0,0,0.5)] ${currentTheme.giftStyle}`}
                                    />
                                </motion.div>

                                {/* NÚT BẤM */}
                                <div className="relative z-20 group-hover:scale-105 transition-transform duration-300">
                                    <div className="absolute inset-0 bg-yellow-600 rounded-full blur opacity-50 offset-y-2"></div>
                                    <p className="relative text-lg md:text-2xl text-red-900 font-bold font-serif animate-bounce text-center bg-linear-to-b from-yellow-300 to-yellow-500 px-6 py-3 md:px-10 md:py-4 rounded-full border-2 border-yellow-200 shadow-[0_5px_15px_rgba(0,0,0,0.3)]">
                                        Chạm để mở quà
                                    </p>
                                </div>

                                {/* THẺ TÊN */}
                                <div className="mt-8 relative z-10">
                                    <div className="w-0.5 h-8 bg-white/50 mx-auto -mt-4 mb-0"></div>
                                    <div className="bg-white/95 backdrop-blur-sm px-6 py-2 rounded-lg shadow-lg border-2 border-white/20 transform -rotate-2 hover:rotate-0 transition-transform">
                                        <p className="text-gray-500 text-xs uppercase tracking-widest mb-0.5">Gửi tới</p>
                                        <p className={`text-xl md:text-2xl font-bold ${currentTheme.headerBg.replace('bg-', 'text-')}`}>
                                            {gift.receiverName}
                                        </p>
                                    </div>
                                </div>

                            </div>
                        </motion.div>
                    ) : (
                        /* --- TRẠNG THÁI 2: THIỆP MỞ --- */
                        <motion.div
                            key="message-card"
                            initial={{ y: 50, opacity: 0, rotateX: 90 }}
                            animate={{ y: 0, opacity: 1, rotateX: 0 }}
                            transition={{ type: "spring", stiffness: 100, damping: 20 }}
                            className="bg-white rounded-2xl shadow-2xl w-full border-4 border-yellow-400 relative overflow-hidden"
                        >
                            {/* HEADER THIỆP */}
                            <div className={`${currentTheme.headerBg} ${currentTheme.headerText} p-6 text-center relative`}>
                                <Snowflake className="absolute top-3 left-3 w-6 h-6 opacity-40 animate-spin-slow" />
                                <Snowflake className="absolute bottom-3 right-3 w-8 h-8 opacity-40 animate-pulse" />

                                <h2 className="text-2xl md:text-3xl font-bold font-serif mb-1">Giáng Sinh An Lành</h2>
                                <div className={`w-16 h-1 mx-auto rounded-full mb-3 opacity-80 bg-current ${currentTheme.accent.replace('text', 'bg')}`}></div>

                                <div className={`flex flex-wrap items-center justify-center gap-2 text-sm py-1 px-4 rounded-full backdrop-blur-sm bg-white/10`}>
                                    <User size={16} />
                                    <span>Người gửi:</span>
                                    <span className={`font-bold text-lg ${currentTheme.accent}`}>
                                        {senderName}
                                    </span>
                                </div>
                            </div>

                            {/* NỘI DUNG LỜI CHÚC */}
                            <div className="p-4 md:p-8 text-center">
                                <p className="text-gray-500 italic mb-4 font-serif text-sm text-left">Thân gửi {gift.receiverName},</p>
                                <div className="text-lg md:text-2xl font-handwriting leading-relaxed text-gray-800 mb-8 whitespace-pre-wrap">
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