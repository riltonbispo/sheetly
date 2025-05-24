import NextAuth from "next-auth"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { prisma } from "@/services/database"
import Google from "next-auth/providers/google"

export const { handlers, signIn, signOut, auth } = NextAuth({
  pages: {
    signIn: '/auth',
    signOut: '/auth',
    error: '/auth',
    verifyRequest: '/auth',
    newUser: '/'
  },
  adapter: PrismaAdapter(prisma),
  providers: [
    Google
  ],
  callbacks: {
    async session({ session, user }) {
      session.user.id = user.id;
      return session;
    },
  }
})