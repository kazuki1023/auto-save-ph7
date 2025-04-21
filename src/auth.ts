import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
  
export const { handlers, signIn, signOut, auth } = NextAuth({
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60,
    updateAge: 600
  },
  logger: {
    warn: (code) => {
      console.warn(code);
    },
    error: (code) => {
      console.error(code);
    },
  },
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          scope: [
            'openid',
            'email',
            'https://www.googleapis.com/auth/calendar',
          ].join(' '),
          response_type: "code",
        },
      },
    }),
  ],
  callbacks: {
    session: async ({ session, token }) => {
      return session;
    },
    jwt: async ({ token, account }) => {
      if (account?.provider === "google") {
        token.accessToken = account.access_token;
        token.refreshToken = account.refresh_token;
      }
      return token;
    },
    signIn: async ({ user }) => {
      return true;
    },
  },
  secret: process.env.AUTH_SECRET,
  basePath: "/api/auth",
  pages: {
    signIn: "/auth/signin",
    signOut: "/auth/signout",
    error: "/auth/error",
  },
});

