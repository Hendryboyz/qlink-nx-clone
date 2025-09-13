import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { type CookieSerializeOptions } from "cookie";
import API from '$/utils/fetch';
import { cookies } from 'next/headers';
import { ACCESS_TOKEN, HEADER_USER_ID } from '@org/common';

const oneMonth = 30 * 24 * 60 * 60;
const isProd = false;
async function setLoginCookies(loginInfo: any, rememberMe: boolean) {
  const { access_token, user_id } = loginInfo;
  const cookiesStore = await cookies();
  const cookieOptions: CookieSerializeOptions = {
    secure: isProd,
  }
  if (rememberMe) {
    cookieOptions.sameSite = 'strict';
    cookieOptions.maxAge = oneMonth;
  }
  cookiesStore.set(ACCESS_TOKEN, access_token, cookieOptions);
  cookiesStore.set(HEADER_USER_ID, user_id, cookieOptions);
}

const handler = NextAuth({
  providers: [
    Credentials({
      name: 'Credentials',
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
        rememberMe: { label: "Remember me", type: "checkbox" },
      },
      authorize: async (credentials) => {
        if (!credentials) return;
        try {
          const resp = await API.post('auth/login', {
            email: credentials.email,
            password: credentials.password,
            rememberMe: credentials.rememberMe,
          });
          await setLoginCookies(resp, credentials.rememberMe === 'true');
          return resp;
        } catch (e) {
          console.error('error');
          console.error(e);
          throw e;
        }
      },
    }),
  ],
  session: {
    strategy: 'jwt',
  },
  pages: {
    signIn: '/sign-in',
  },
  events: {
    signOut: async (message) => {
      const cookiesStore = await cookies();
      cookiesStore.delete(ACCESS_TOKEN);
      cookiesStore.delete(HEADER_USER_ID);
    },
  },
});

export { handler as GET, handler as POST}
