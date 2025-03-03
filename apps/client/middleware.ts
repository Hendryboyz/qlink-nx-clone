import { ACCESS_TOKEN } from '@org/common';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import API from './utils/fetch';

async function validateToken(token: string): Promise<boolean> {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/auth/verify`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }
    );

    return response.ok;
  } catch (error) {
    return false;
  }
}

// 這個函數可以是異步的，如果您需要等待 API 響應
const protectedPaths = ['/member', '/garage'];
export async function middleware(request: NextRequest) {
  // 獲取 token，這裡假設它存儲在 cookie 中
  const token = request.cookies.get(ACCESS_TOKEN)?.value;

  // 定義需要保護的路徑

  // 檢查當前路徑是否需要保護
  const isProtectedPath = protectedPaths.some((path) =>
    request.nextUrl.pathname.startsWith(path)
  );

  if (isProtectedPath) {
    // 如果是受保護的路徑，檢查 token
    if (!token) {
      // 如果沒有 token，重定向到首頁
      return NextResponse.redirect(new URL('/', request.url));
    }

    const result = await validateToken(token);
    if (!result) {
      return NextResponse.redirect(new URL('/', request.url));
    }
  } else if (request.nextUrl.pathname === '/' && token) {
    const result = await validateToken(token);
    if (result) {
      return NextResponse.redirect(new URL('/home', request.url));
    } else {
      API.clearToken();
    }
  }

  // 如果不是受保護的路徑或者 token 有效，繼續請求
  return NextResponse.next();
}

// 配置中間件應該運行的路徑
export const config = {
  matcher: protectedPaths.map((path) => `${path}/:path*`),
};
