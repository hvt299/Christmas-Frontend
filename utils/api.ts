import { createClient } from '@/utils/supabase/client';

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001"; // Địa chỉ Backend mới

export const apiCall = async (endpoint: string, method: 'GET' | 'POST' = 'GET', body?: any) => {
  const supabase = createClient();
  
  // 1. Lấy Token hiện tại của User
  const { data: { session } } = await supabase.auth.getSession();
  const token = session?.access_token;

  if (!token) {
    throw new Error('Bạn cần đăng nhập để thực hiện thao tác này!');
  }

  // 2. Gọi sang Backend
  const res = await fetch(`${BACKEND_URL}${endpoint}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`, // <--- Chìa khóa để qua cửa AuthGuard
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.message || 'Có lỗi xảy ra khi gọi API');
  }

  return res.json();
};