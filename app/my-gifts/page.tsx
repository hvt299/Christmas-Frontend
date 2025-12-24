'use client'
import { useEffect, useState } from 'react'
import { apiCall } from '@/utils/api'
import Link from 'next/link'
import { Gift, Copy, Check, ExternalLink, ArrowLeft, Snowflake } from 'lucide-react'

// URL Frontend để tạo link chia sẻ
const FRONTEND_URL = process.env.NEXT_PUBLIC_FRONTEND_URL || 'http://localhost:3000'

export default function MyGiftsPage() {
    const [gifts, setGifts] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [copiedId, setCopiedId] = useState<string | null>(null)

    useEffect(() => {
        const fetchGifts = async () => {
            try {
                // Gọi API lấy danh sách (Hàm apiCall đã tự đính kèm Token)
                const data = await apiCall('/gifts')
                setGifts(data)
            } catch (error) {
                console.error(error)
            } finally {
                setLoading(false)
            }
        }
        fetchGifts()
    }, [])

    const handleCopyLink = (giftId: string) => {
        const link = `${window.location.origin}/gifts/${giftId}`
        navigator.clipboard.writeText(link)
        setCopiedId(giftId)
        setTimeout(() => setCopiedId(null), 2000) // Reset icon sau 2s
    }

    return (
        <div className="min-h-screen bg-green-900 text-white p-4 md:p-8 relative overflow-hidden">

            {/* Background trang trí */}
            <div className="absolute inset-0 opacity-10 pointer-events-none">
                <Snowflake className="absolute top-10 left-10 w-20 h-20 animate-spin-slow" />
                <Snowflake className="absolute bottom-20 right-20 w-32 h-32 animate-bounce" />
            </div>

            <div className="max-w-4xl mx-auto relative z-10">
                {/* Header */}
                <div className="flex items-center gap-4 mb-8">
                    <Link href="/" className="p-2 bg-white/10 hover:bg-white/20 rounded-full transition">
                        <ArrowLeft className="w-6 h-6" />
                    </Link>
                    <h1 className="text-3xl font-bold font-serif text-yellow-400">Hộp Quà Của Tôi 🎁</h1>
                </div>

                {/* Loading */}
                {loading && (
                    <div className="text-center py-20">
                        <Snowflake className="w-10 h-10 animate-spin-slow mx-auto mb-4 text-yellow-300" />
                        <p>Đang lục lọi trong túi quà...</p>
                    </div>
                )}

                {/* Empty State */}
                {!loading && gifts.length === 0 && (
                    <div className="text-center py-20 bg-white/5 rounded-2xl border-2 border-dashed border-white/20">
                        <Gift className="w-16 h-16 mx-auto mb-4 text-white/50" />
                        <p className="text-xl mb-6">Bạn chưa gửi món quà nào cả!</p>
                        <Link href="/create" className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-full font-bold transition shadow-lg">
                            Gửi món quà đầu tiên ngay
                        </Link>
                    </div>
                )}

                {/* Danh sách quà */}
                <div className="grid gap-4 md:grid-cols-2">
                    {gifts.map((gift) => (
                        <div key={gift.id} className="bg-white/10 backdrop-blur-md border border-white/10 rounded-xl p-5 hover:bg-white/15 transition flex flex-col">

                            <div className="flex justify-between items-start mb-3">
                                <div className="flex items-center gap-3">
                                    <div className={`p-3 rounded-lg ${gift.theme === 'green_box' ? 'bg-green-600' : gift.theme === 'gold_box' ? 'bg-yellow-500' : 'bg-red-600'}`}>
                                        <Gift className="w-6 h-6 text-white" />
                                    </div>
                                    <div>
                                        <p className="text-xs text-white/60 uppercase tracking-wider">Người nhận</p>
                                        <p className="font-bold text-lg text-yellow-300">{gift.receiverName}</p>
                                    </div>
                                </div>
                                <span className="text-xs text-white/40 bg-black/20 px-2 py-1 rounded">
                                    {new Date(gift.createdAt).toLocaleDateString('vi-VN')}
                                </span>
                            </div>

                            <p className="text-sm text-white/80 italic mb-4 line-clamp-2">
                                "{gift.content}"
                            </p>

                            <div className="mt-auto pt-4 border-t border-white/10 flex gap-2">
                                {/* Nút Copy Link */}
                                <button
                                    onClick={() => handleCopyLink(gift.id)}
                                    className="flex-1 flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 py-2 rounded-lg text-sm font-bold transition"
                                >
                                    {copiedId === gift.id ? (
                                        <><Check className="w-4 h-4 text-green-400" /> Đã copy</>
                                    ) : (
                                        <><Copy className="w-4 h-4" /> Copy Link</>
                                    )}
                                </button>

                                {/* Nút Xem Quà */}
                                <Link
                                    href={`/gifts/${gift.id}`}
                                    className="flex-1 flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 py-2 rounded-lg text-sm font-bold transition shadow-md"
                                >
                                    <ExternalLink className="w-4 h-4" /> Xem thử
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}