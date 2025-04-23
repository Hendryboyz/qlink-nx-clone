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

  if (request.nextUrl.pathname === '/' && token) {
    const isTokenValid = await validateToken(token);
    console.log(isTokenValid);
  }

  // 定義需要保護的路徑

  // 檢查當前路徑是否需要保護
  const isProtectedPath = protectedPaths.some((path) =>
    request.nextUrl.pathname.startsWith(path)
  );

  if (!isProtectedPath) {
    // 如果不是受保護的路徑或者 token 有效，繼續請求
    return NextResponse.next();
  }

  const withoutLoginToken = !token;
  if (withoutLoginToken) {
    return NextResponse.redirect(new URL('/sign-in', request.url));
  }

  const isTokenValid = await validateToken(token);
  if (!isTokenValid) {
    API.clearToken();
    return NextResponse.redirect(new URL('/', request.url));
  }
}

// 配置中間件應該運行的路徑
export const config = {
  matcher: protectedPaths.map((path) => `${path}/:path*`),
};
