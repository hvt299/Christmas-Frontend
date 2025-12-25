import { type NextRequest } from 'next/server'
import { updateSession } from '@/utils/supabase/middleware'

export async function middleware(request: NextRequest) {
  // Gọi hàm xử lý session chúng ta vừa viết
  return await updateSession(request)
}

export const config = {
  // Cấu hình matcher để middleware chạy trên hầu hết các route,
  // trừ các file tĩnh, ảnh, favicon... để tối ưu hiệu năng.
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}