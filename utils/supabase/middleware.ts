import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
  // 1. Tạo response ban đầu (để có thể ghi cookie vào header trả về)
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  // 2. Khởi tạo Supabase Client trong môi trường Middleware
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          // Bước này quan trọng: đồng bộ cookie từ Supabase vào Response
          cookiesToSet.forEach(({ name, value, options }) => {
            request.cookies.set(name, value)
            response.cookies.set(name, value, options)
          })
        },
      },
    }
  )

  // 3. Lấy thông tin user hiện tại
  // Dùng getUser() an toàn hơn getSession() trong middleware
  const {
    data: { user },
  } = await supabase.auth.getUser()

  // 4. LOGIC CHẶN TRANG (PROTECTED ROUTES)
  // Danh sách các trang cần bảo vệ
  const protectedPaths = ['/create', '/my-gifts']
  
  // Kiểm tra: Nếu user chưa đăng nhập VÀ đang cố vào trang bảo mật
  const isPathProtected = protectedPaths.some(path => request.nextUrl.pathname.startsWith(path))

  if (!user && isPathProtected) {
    // Chuyển hướng về trang login
    const url = request.nextUrl.clone()
    url.pathname = '/login'
    return NextResponse.redirect(url)
  }

  // 5. Trả về response (đã kèm theo cookie được làm mới nếu có)
  return response
}