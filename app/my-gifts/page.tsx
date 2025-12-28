'use client'
import { useEffect, useState } from 'react'
import { apiCall } from '@/utils/api'
import Link from 'next/link'
import {
    Gift, Copy, Check, ExternalLink, ArrowLeft, Snowflake,
    Trash2, Edit2, Calendar, Inbox, Send
} from 'lucide-react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/utils/supabase/client'

// URL Frontend để tạo link chia sẻ
const FRONTEND_URL = process.env.NEXT_PUBLIC_FRONTEND_URL || 'http://localhost:3000'

export default function MyGiftsPage() {
    const router = useRouter()

    const [gifts, setGifts] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [copiedId, setCopiedId] = useState<string | null>(null)

    const [userId, setUserId] = useState<string | null>(null) // Để biết mình là người gửi hay nhận
    const [activeTab, setActiveTab] = useState<'sent' | 'received'>('sent') // Tab hiện tại
    const [selectedYear, setSelectedYear] = useState<string>('all') // Năm được chọn

    useEffect(() => {
        const fetchGifts = async () => {
            try {
                const supabase = createClient()
                const { data: { user } } = await supabase.auth.getUser()

                if (!user) {
                    router.push('/login')
                    return
                }
                setUserId(user.id)

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
    }, [router])

    const mySentGifts = gifts.filter(g => g.senderId === userId)
    const myReceivedGifts = gifts.filter(g => g.receiverId === userId)
    const currentList = activeTab === 'sent' ? mySentGifts : myReceivedGifts

    const years = Array.from(new Set(currentList.map(g => new Date(g.createdAt).getFullYear().toString())))
    const filteredGifts = selectedYear === 'all'
        ? currentList
        : currentList.filter(g => new Date(g.createdAt).getFullYear().toString() === selectedYear)

    const handleDelete = async (giftId: string) => {
        if (!window.confirm('Bạn có chắc muốn xóa vĩnh viễn món quà này?')) return
        try {
            await apiCall(`/gifts/${giftId}`, 'DELETE') // Gọi API Delete
            setGifts(prev => prev.filter(g => g.id !== giftId)) // Cập nhật UI
        } catch (err) {
            alert('Lỗi khi xóa quà')
        }
    }

    const handleEdit = (giftId: string) => {
        router.push(`/create?edit=${giftId}`) // Chuyển sang trang tạo với ID để sửa
    }

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
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                    <div className="flex items-center gap-3">
                        <Link href="/" className="p-2 bg-white/10 hover:bg-white/20 rounded-full transition">
                            <ArrowLeft className="w-6 h-6" />
                        </Link>
                        <h1 className="text-2xl md:text-3xl font-bold font-serif text-yellow-400 flex items-center gap-3">
                            Hộp Quà Của Tôi
                            <Gift className="w-6 h-6 md:w-8 md:h-8 animate-bounce" />
                        </h1>
                    </div>

                    {/* TAB SWITCHER & YEAR FILTER */}
                    <div className="flex flex-col sm:flex-row gap-3">

                        {/* Tab Năm */}
                        <div className="relative shrink-0">
                            <Calendar className="absolute left-3 top-2.5 w-4 h-4 text-white/60" />
                            <select
                                value={selectedYear}
                                onChange={(e) => setSelectedYear(e.target.value)}
                                className="w-full sm:w-auto appearance-none bg-black/20 text-white pl-9 pr-8 py-2 rounded-lg border border-white/10 focus:outline-none focus:border-yellow-400 cursor-pointer"
                            >
                                <option value="all" className="bg-green-800">Tất cả năm</option>
                                {years.map(y => <option key={y} value={y} className="bg-green-800">{y}</option>)}
                            </select>
                        </div>

                        {/* Tabs Gửi/Nhận */}
                        <div className="bg-black/20 p-1 rounded-lg flex shrink-0 whitespace-nowrap overflow-x-auto">
                            <button
                                onClick={() => { setActiveTab('sent'); setSelectedYear('all') }}
                                className={`flex-1 flex items-center justify-center gap-2 px-4 py-1.5 rounded-md text-sm font-bold transition ${activeTab === 'sent' ? 'bg-red-600 shadow' : 'text-white/50 hover:text-white'}`}
                            >
                                <Send size={14} /> Đã Gửi
                            </button>
                            <button
                                onClick={() => { setActiveTab('received'); setSelectedYear('all') }}
                                className={`flex-1 flex items-center justify-center gap-2 px-4 py-1.5 rounded-md text-sm font-bold transition ${activeTab === 'received' ? 'bg-green-600 shadow' : 'text-white/50 hover:text-white'}`}
                            >
                                <Inbox size={14} /> Đã Nhận
                            </button>
                        </div>
                    </div>
                </div>

                {/* Loading */}
                {loading && (
                    <div className="text-center py-20">
                        <Snowflake className="w-10 h-10 animate-spin-slow mx-auto mb-4 text-yellow-300" />
                        <p>Đang lục lọi trong túi quà...</p>
                    </div>
                )}

                {/* Empty State */}
                {!loading && filteredGifts.length === 0 && (
                    <div className="text-center py-20 bg-white/5 rounded-2xl border-2 border-dashed border-white/20">
                        {activeTab === 'sent' ? (
                            /* --- NỘI DUNG KHI TAB GỬI TRỐNG --- */
                            <>
                                <Gift className="w-16 h-16 mx-auto mb-4 text-white/50" />
                                <p className="text-xl mb-6">Bạn chưa gửi món quà nào trong khoảng thời gian này!</p>
                                <Link href="/create" className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-full font-bold transition shadow-lg">
                                    Gửi món quà đầu tiên ngay
                                </Link>
                            </>
                        ) : (
                            /* --- NỘI DUNG KHI TAB NHẬN TRỐNG --- */
                            <>
                                <Inbox className="w-16 h-16 mx-auto mb-4 text-white/50" />
                                <p className="text-xl mb-2">Chưa có ai gửi quà cho bạn (trong hệ thống) cả 😢</p>
                                <p className="text-sm opacity-60">Hãy rủ bạn bè tham gia để nhận quà nhé!</p>
                            </>
                        )}
                    </div>
                )}

                {/* Danh sách quà */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                    {filteredGifts.map((gift) => (
                        <div key={gift.id} className="group bg-white/10 backdrop-blur-md border border-white/10 rounded-xl p-4 hover:bg-white/15 transition flex flex-col hover:-translate-y-1 hover:shadow-xl">

                            <div className="flex justify-between items-start mb-3 gap-3">
                                <div className="flex items-center gap-3 overflow-hidden">
                                    <div className={`flex-shrink-0 p-3 rounded-lg ${gift.theme === 'green_box' ? 'bg-green-600' : gift.theme === 'gold_box' ? 'bg-yellow-500' : 'bg-red-600'}`}>
                                        <Gift className="w-5 h-5 text-white" />
                                    </div>

                                    {/* XỬ LÝ TÊN DÀI TRÊN PC */}
                                    <div className="min-w-0 flex-1">
                                        <p className="text-[10px] text-white/60 uppercase tracking-wider truncate">
                                            {activeTab === 'sent' ? 'Gửi tới' : 'Từ'}
                                        </p>
                                        <p className="font-bold text-lg text-yellow-300 truncate" title={activeTab === 'sent' ? gift.receiverName : 'Người gửi'}>
                                            {activeTab === 'sent' ? gift.receiverName : (gift.sender?.displayName || 'Người bí ẩn')}
                                        </p>
                                    </div>
                                </div>
                                <span className="flex-shrink-0 text-xs text-white/40 bg-black/20 px-2 py-1 rounded whitespace-nowrap">
                                    {new Date(gift.createdAt).toLocaleDateString('vi-VN')}
                                </span>
                            </div>

                            <p className="text-sm text-white/80 italic mb-4 line-clamp-2 min-h-[2.5rem]">
                                "{gift.content}"
                            </p>

                            <div className="mt-auto pt-4 border-t border-white/10 flex gap-2">
                                {/* Nút Xem (Luôn hiện) */}
                                <Link
                                    href={`/gifts/${gift.id}`}
                                    className="flex-1 bg-white/20 hover:bg-white/30 text-white py-2 rounded-lg text-sm font-bold transition flex items-center justify-center gap-2"
                                >
                                    <ExternalLink size={14} /> Xem
                                </Link>

                                {/* Nút Copy (Luôn hiện) */}
                                <button
                                    onClick={() => handleCopyLink(gift.id)}
                                    className="w-10 bg-white/10 hover:bg-white/20 text-white rounded-lg flex items-center justify-center transition"
                                    title="Sao chép link"
                                >
                                    {copiedId === gift.id ? <Check size={16} className="text-green-400" /> : <Copy size={16} />}
                                </button>

                                {/* Nút Sửa/Xóa (CHỈ HIỆN KHI Ở TAB "ĐÃ GỬI") */}
                                {activeTab === 'sent' && (
                                    <>
                                        <button
                                            onClick={() => handleEdit(gift.id)}
                                            className="w-10 bg-blue-600/80 hover:bg-blue-600 text-white rounded-lg flex items-center justify-center transition"
                                            title="Sửa"
                                        >
                                            <Edit2 size={16} />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(gift.id)}
                                            className="w-10 bg-red-600/80 hover:bg-red-600 text-white rounded-lg flex items-center justify-center transition"
                                            title="Xóa"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}