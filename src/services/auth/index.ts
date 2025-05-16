import NextAuth from "next-auth"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { prisma } from "@/services/database"
import Google from "next-auth/providers/google"

export const { handlers, signIn, signOut, auth } = NextAuth({
  pages: {
    signIn: '/auth',
  },
  adapter: PrismaAdapter(prisma),
  providers: [
    Google
  ]
})