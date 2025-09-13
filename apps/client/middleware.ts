import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { withAuth } from "next-auth/middleware";
import { ACCESS_TOKEN } from '@org/common';
import API from './utils/fetch';

async function validateToken(token: string | undefined): Promise<boolean> {
  if (!token) { return false; }
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
const protectedRoutes = ['/member', '/garage'];

const guestOnlyRoutes = ['/sign-in', '/sign-up', '/reset-password'];

const publicRoutes = ['/', '/news', '/privacy-policy', '/terms-of-service'];

async function middlewareV1(request: NextRequest) {
  // 獲取 token，這裡假設它存儲在 cookie 中
  const token = request.cookies.get(ACCESS_TOKEN)?.value;

  const requestPath = request.nextUrl.pathname;

  // 檢查當前路徑是否需要保護
  const isProtectedPath = protectedRoutes.some((path) =>
    requestPath !== '/' && requestPath.startsWith(path)
  );

  if (isProtectedPath && !token) {
    return NextResponse.redirect(new URL('/sign-in', request.url));
  }

  const isTokenValid = await validateToken(token);
  if (!isTokenValid) {
    API.clearToken();
    if (isProtectedPath) {
      return NextResponse.redirect(new URL('/sign-in', request.url));
    }
  }

  if (await isRedirectMemberAfterSignIn(requestPath, isTokenValid)) {
    return NextResponse.redirect(new URL('/member', request.url));
  }

  // 如果不是受保護的路徑或者 token 有效，繼續請求
  return NextResponse.next();
}

async function middleware(request: NextRequest) {
  return NextResponse.next();
}

export default withAuth(middleware, {
  callbacks: {
    authorized: ({ token, req }) => {
      const requestPath = req.nextUrl.pathname;

      if (publicRoutes.includes(requestPath)) {
        return true
      }

      if (protectedRoutes.includes(requestPath)) {
        return !!token;
      }

      if (guestOnlyRoutes.includes(requestPath)) {
        return !token;
      }
      return false;
    },

  },
});


async function isRedirectMemberAfterSignIn(requestPath: string, isTokenValid: boolean) {
  const isLoginHidden = guestOnlyRoutes.some((path) =>
    requestPath.startsWith(path)
  );
  return isLoginHidden && isTokenValid;
}


// 配置中間件應該運行的路徑
export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|woff|woff2|ttf|eot)).*)",
  ],
};

