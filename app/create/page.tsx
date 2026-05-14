'use client'
import { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import api from '@/lib/api'
import { Gift, Send, Type, Music, ArrowLeft, Copy, Check, ExternalLink, Snowflake, User, Search, X, Smile } from 'lucide-react'
import EmojiPicker from 'emoji-picker-react';

const themeMap: Record<string, {
  headerBg: string,
  headerText: string,
  iconColor: string,
  btnColor: string,
  boxColor: string
}> = {
  red_box: {
    headerBg: 'bg-red-700',
    headerText: 'text-white',
    iconColor: 'text-red-600',
    btnColor: 'bg-red-600 hover:bg-red-700',
    boxColor: 'bg-red-600'
  },
  green_box: {
    headerBg: 'bg-green-700',
    headerText: 'text-white',
    iconColor: 'text-green-600',
    btnColor: 'bg-green-600 hover:bg-green-700',
    boxColor: 'bg-green-600'
  },
  gold_box: {
    headerBg: 'bg-yellow-500',
    headerText: 'text-red-900',
    iconColor: 'text-yellow-600',
    btnColor: 'bg-yellow-500 hover:bg-yellow-600',
    boxColor: 'bg-yellow-400'
  },
  blue_box: {
    headerBg: 'bg-blue-600',
    headerText: 'text-white',
    iconColor: 'text-blue-500',
    btnColor: 'bg-blue-500 hover:bg-blue-600',
    boxColor: 'bg-blue-500'
  },
  purple_box: {
    headerBg: 'bg-purple-700',
    headerText: 'text-white',
    iconColor: 'text-purple-600',
    btnColor: 'bg-purple-600 hover:bg-purple-700',
    boxColor: 'bg-purple-600'
  },
  pink_box: {
    headerBg: 'bg-pink-500',
    headerText: 'text-white',
    iconColor: 'text-pink-500',
    btnColor: 'bg-pink-500 hover:bg-pink-600',
    boxColor: 'bg-pink-500'
  },
  orange_box: {
    headerBg: 'bg-orange-500',
    headerText: 'text-white',
    iconColor: 'text-orange-600',
    btnColor: 'bg-orange-500 hover:bg-orange-600',
    boxColor: 'bg-orange-500'
  },
  brown_box: {
    headerBg: 'bg-amber-900',
    headerText: 'text-amber-100',
    iconColor: 'text-amber-800',
    btnColor: 'bg-amber-800 hover:bg-amber-900',
    boxColor: 'bg-amber-800'
  },
  default: {
    headerBg: 'bg-red-700',
    headerText: 'text-white',
    iconColor: 'text-red-600',
    btnColor: 'bg-red-600 hover:bg-red-700',
    boxColor: 'bg-red-600'
  }
};

function CreateGiftContent() {
  const router = useRouter()

  const [formData, setFormData] = useState({
    receiverName: '',
    receiverId: '',
    content: '',
    theme: 'red_box',
  })

  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState<any[]>([])
  const searchParams = useSearchParams()
  const editId = searchParams.get('edit')
  const [showDropdown, setShowDropdown] = useState(false)
  const [isSearching, setIsSearching] = useState(false)

  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [createdGiftId, setCreatedGiftId] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)
  const [showEmoji, setShowEmoji] = useState(false);

  const currentTheme = themeMap[formData.theme] || themeMap.default;

  const onEmojiClick = (emojiObject: any) => {
    setFormData(prev => ({
      ...prev,
      content: prev.content + emojiObject.emoji
    }));
  };

  useEffect(() => {
    let isMounted = true;
    const timer = setTimeout(async () => {
      if (searchQuery.trim().length > 0) {
        setIsSearching(true)
        try {
          const response = await api.get(`/users/search?q=${encodeURIComponent(searchQuery)}`)

          if (isMounted) {
            const usersArray = Array.isArray(response.data) ? response.data : [];
            setSearchResults(usersArray)
            setShowDropdown(usersArray.length > 0)
          }
        } catch (error) {
          if (isMounted) setSearchResults([])
        } finally {
          if (isMounted) setIsSearching(false)
        }
      } else {
        if (isMounted) {
          setSearchResults([])
          setShowDropdown(false)
        }
      }
    }, 500)

    return () => {
      isMounted = false;
      clearTimeout(timer)
    }
  }, [searchQuery])

  useEffect(() => {
    const checkSeason = () => {
      const currentMonth = new Date().getMonth() + 1;
      if (currentMonth !== 12) {
        alert("Ho ho ho! Cỗ xe tuần lộc chưa khởi hành. Hãy quay lại vào tháng 12 nhé! 🎅");
        router.push('/');
      }
    };
    checkSeason();
  }, [router]);

  const selectUser = (user: any) => {
    const displayName = user.fullName || user.username;
    setFormData({
      ...formData,
      receiverName: displayName,
      receiverId: user._id
    })
    setSearchQuery(displayName)
    setShowDropdown(false)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage('')

    try {
      const response = await api.post('/gifts', {
        ...formData,
        receiverId: formData.receiverName === searchQuery ? formData.receiverId : undefined
      })

      setCreatedGiftId(response.data._id || response.data.id)
      setMessage('Gói quà thành công! Đang chuyển hướng...')

    } catch (error: any) {
      const errorMsg = error.response?.data?.message || error.message;
      setMessage(Array.isArray(errorMsg) ? errorMsg[0] : errorMsg);
    } finally {
      setLoading(false)
    }
  }

  const handleCopyLink = () => {
    if (!createdGiftId) return
    const link = `${window.location.origin}/gifts/${createdGiftId}`
    navigator.clipboard.writeText(link)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="min-h-screen bg-green-900 flex items-center justify-center p-4 relative overflow-hidden">

      {/* Background */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <Snowflake className="absolute top-10 left-10 w-20 h-20 text-white animate-spin-slow" />
        <Snowflake className="absolute bottom-20 right-20 w-32 h-32 text-white animate-bounce" />
      </div>

      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden border-4 border-yellow-500 relative z-10 my-4">

        <Link href="/" className="absolute top-4 left-4 p-2 bg-white/20 hover:bg-black/10 rounded-full transition text-white z-10">
          <ArrowLeft className="w-6 h-6" />
        </Link>

        {/* Header */}
        <div className={`${currentTheme.headerBg} ${currentTheme.headerText} p-6 text-center transition-colors duration-500`}>
          <Gift className={`w-12 h-12 mx-auto mb-2 animate-bounce ${currentTheme.headerText}`} />
          <h1 className="text-2xl md:text-3xl font-bold font-serif">Gửi Quà Giáng Sinh</h1>
          <p className="opacity-90 text-sm md:text-base">Trao yêu thương, nhận nụ cười</p>
        </div>

        <div className="p-4 md:p-8">
          {createdGiftId ? (
            /* MÀN HÌNH THÀNH CÔNG */
            <div className="text-center animate-fade-in">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Check className="w-10 h-10 text-green-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Đã gói quà xong rồi! 🎅</h2>

              <div className="bg-gray-100 p-4 rounded-xl flex items-center justify-between gap-2 border border-gray-200 mb-6">
                <code className="text-sm text-gray-600 truncate flex-1 text-left">
                  {typeof window !== 'undefined' ? `${window.location.origin}/gifts/${createdGiftId}` : '...'}
                </code>
                <button
                  onClick={handleCopyLink}
                  className="bg-white hover:bg-gray-50 text-gray-700 px-3 py-2 rounded-lg border border-gray-300 font-bold text-sm transition flex items-center gap-1 min-w-25 justify-center"
                >
                  {copied ? <><Check size={14} className="text-green-500" /> Đã chép</> : <><Copy size={14} /> Copy</>}
                </button>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <a href={`/gifts/${createdGiftId}`} target="_blank" className="flex-1 bg-yellow-400 hover:bg-yellow-500 text-red-900 font-bold py-3 rounded-xl transition flex items-center justify-center gap-2">
                  <ExternalLink size={18} /> Xem quà ngay
                </a>
                <button onClick={() => { setCreatedGiftId(null); setFormData({ ...formData, receiverName: '', receiverId: '', content: '' }); setSearchQuery(''); }} className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-3 rounded-xl transition flex items-center justify-center gap-2">
                  <Gift size={18} /> Gửi tiếp
                </button>
              </div>
            </div>
          ) : (
            /* FORM NHẬP LIỆU */
            <form onSubmit={handleSubmit} className="space-y-6">

              <div className="relative">
                <label className="flex items-center gap-2 font-bold text-gray-700 mb-2">
                  <Type className={`w-5 h-5 ${currentTheme.iconColor}`} />
                  Người nhận là ai?
                </label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    className="w-full border-2 border-gray-200 rounded-lg p-3 pl-10 focus:border-red-500 outline-none transition"
                    placeholder="Nhập tên bạn bè (hoặc tên tài khoản nếu có)..."
                    value={searchQuery || formData.receiverName}
                    onChange={e => {
                      setSearchQuery(e.target.value)
                      setFormData({ ...formData, receiverName: e.target.value, receiverId: '' })
                    }}
                    onFocus={() => searchQuery.length > 1 && setShowDropdown(true)}
                  />
                  <Search className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />

                  {isSearching && (
                    <div className="absolute right-3 top-3.5 animate-spin w-5 h-5 border-2 border-gray-300 border-t-red-500 rounded-full"></div>
                  )}

                  {!isSearching && searchQuery && (
                    <button
                      type="button"
                      onClick={() => { setSearchQuery(''); setFormData({ ...formData, receiverName: '', receiverId: '' }); setShowDropdown(false); }}
                      className="absolute right-3 top-3.5 text-gray-400 hover:text-red-500"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  )}
                </div>

                {/* DROPDOWN KẾT QUẢ TÌM KIẾM */}
                {showDropdown && searchResults.length > 0 && (
                  <div className="absolute top-full left-0 right-0 bg-white border-2 border-yellow-400 rounded-b-xl shadow-2xl z-100 max-h-60 overflow-y-auto">
                    {searchResults.map(user => (
                      <div
                        key={user._id}
                        onClick={() => selectUser(user)}
                        className="p-3 hover:bg-yellow-50 cursor-pointer flex items-center gap-3 transition border-b border-gray-50 last:border-0"
                      >
                        <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center text-red-600 font-bold overflow-hidden">
                          {user.avatar ? (
                            <img src={user.avatar} alt={user.fullName} className="w-full h-full object-cover" />
                          ) : (
                            (user.fullName || user.username)?.charAt(0) || <User size={16} />
                          )}
                        </div>
                        <div>
                          <p className="font-bold text-gray-800">{user.fullName || user.username}</p>
                          <p className="text-xs text-gray-500">{user.email}</p>
                        </div>
                        <span className="ml-auto text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">Thành viên</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div>
                <label className="flex items-center gap-2 font-bold text-gray-700 mb-2">
                  <Music className={`w-5 h-5 ${currentTheme.iconColor}`} />
                  Lời chúc ngọt ngào
                </label>

                <div className="relative">
                  <textarea
                    required
                    rows={4}
                    className="w-full border-2 border-gray-200 rounded-lg p-3 focus:border-red-500 outline-none transition"
                    placeholder="Chúc bạn một mùa giáng sinh an lành và... 🎄"
                    value={formData.content}
                    onChange={e => setFormData({ ...formData, content: e.target.value })}
                  />

                  <button
                    type="button"
                    onClick={() => setShowEmoji(!showEmoji)}
                    className="absolute bottom-3 right-3 text-gray-400 hover:text-yellow-500 transition"
                  >
                    <Smile size={24} />
                  </button>

                  {showEmoji && (
                    <div className="absolute bottom-full right-0 mb-2 z-50 shadow-xl">
                      <div
                        className="fixed inset-0 z-40"
                        onClick={() => setShowEmoji(false)}
                      />

                      <div className="relative z-50">
                        <EmojiPicker
                          onEmojiClick={onEmojiClick}
                          width={300}
                          height={350}
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-2 text-sm md:text-base">Chọn màu hộp quà</label>
                <div className="flex gap-4 flex-wrap justify-center sm:justify-start">
                  {[
                    'red_box',
                    'green_box',
                    'gold_box',
                    'blue_box',
                    'purple_box',
                    'pink_box',
                    'orange_box',
                    'brown_box'
                  ].map((theme) => {
                    const themeConfig = themeMap[theme] || themeMap.default;
                    return (
                      <button
                        key={theme}
                        type="button"
                        onClick={() => setFormData({ ...formData, theme })}
                        className={`w-12 h-12 rounded-full border-4 shadow-sm transition-transform hover:scale-110 
                          ${formData.theme === theme ? 'border-blue-500 scale-110' : 'border-transparent'}
                          ${themeConfig.boxColor}
                        `}
                        title={theme.replace('_box', '')}
                      />
                    );
                  })}
                </div>
              </div>

              {message && !createdGiftId && (
                <div className="p-4 rounded-lg text-center font-bold bg-red-100 text-red-800 animate-pulse">
                  {message}
                </div>
              )}

              <div className="flex flex-col-reverse sm:flex-row gap-3">
                <button
                  type="button"
                  onClick={() => router.push('/')}
                  className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold py-4 rounded-xl transition shadow-sm"
                >
                  Hủy bỏ
                </button>

                <button
                  type="submit"
                  disabled={loading}
                  className="flex-2 bg-red-600 hover:bg-red-700 text-white font-bold py-4 rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 text-lg"
                >
                  {loading ? (editId ? 'Đang cập nhật...' : 'Đang gói...') : (
                    <>
                      <Send className="w-6 h-6" />
                      {editId ? 'Lưu thay đổi' : 'Gửi Ngay'}
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}

export default function CreateGiftPage() {
  return (
    <Suspense fallback={<div className="text-white text-center p-10">Đang tải...</div>}>
      <CreateGiftContent />
    </Suspense>
  )
}