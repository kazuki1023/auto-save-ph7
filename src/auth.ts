import NextAuth from 'next-auth';
import Google from 'next-auth/providers/google';

import { CustomSession } from './lib/auth/types';

export const { handlers, signIn, signOut, auth } = NextAuth({
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60,
    updateAge: 600,
  },
  logger: {
    warn: code => {
      console.warn(code);
    },
    error: code => {
      console.error(code);
    },
  },
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      authorization: {
        params: {
          prompt: 'consent',
          access_type: 'offline',
          scope: [
            'openid',
            'email',
            'https://www.googleapis.com/auth/calendar',
          ].join(' '),
          response_type: 'code',
        },
      },
    }),
  ],
  callbacks: {
    session: async ({ session, token }) => {
      const CustomSession = {
        ...session,
        google: {
          accessToken: token.accessToken,
          refreshToken: token.refreshToken,
        },
      } as CustomSession;
      return CustomSession;
    },
    jwt: async ({ token, account }) => {
      // 初回ログイン時にトークンを保存
      if (account?.provider === 'google') {
        token.accessToken = account.access_token;
        token.refreshToken = account.refresh_token;
        token.expiresAt = account.expires_at;
        return token;
      }

      // アクセストークンの期限をチェック
      if (token.expiresAt && Date.now() < (token.expiresAt as number) * 1000) {
        return token;
      }

      // アクセストークンが期限切れの場合、リフレッシュトークンで更新
      try {
        const response = await fetch('https://oauth2.googleapis.com/token', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: new URLSearchParams({
            client_id: process.env.GOOGLE_CLIENT_ID!,
            client_secret: process.env.GOOGLE_CLIENT_SECRET!,
            grant_type: 'refresh_token',
            refresh_token: token.refreshToken as string,
          }),
        });

        if (!response.ok) {
          throw new Error('トークンのリフレッシュに失敗しました');
        }

        const refreshedTokens = await response.json();

        return {
          ...token,
          accessToken: refreshedTokens.access_token,
          expiresAt: Math.floor(Date.now() / 1000) + refreshedTokens.expires_in,
          refreshToken: refreshedTokens.refresh_token ?? token.refreshToken,
        };
      } catch (error) {
        console.error('トークンリフレッシュエラー:', error);
        return {
          ...token,
          error: 'RefreshAccessTokenError',
        };
      }
    },
    signIn: async () => {
      return true;
    },
  },
  secret: process.env.AUTH_SECRET,
  basePath: '/api/auth',
  pages: {
    signIn: '/auth/signin',
    signOut: '/auth/signout',
    error: '/auth/error',
  },
});
