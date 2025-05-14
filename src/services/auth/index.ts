import NextAuth from "next-auth"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { prisma } from "@/services/database"
import Nodemailer from "next-auth/providers/nodemailer" 

export const { handlers, signIn, signOut, auth } = NextAuth({
  pages: {
    signIn: '/auth',
  },
  adapter: PrismaAdapter(prisma),
  providers: [
    Nodemailer({
      server: process.env.EMAIL_SERVER,
      from: process.env.EMAIL_FROM,
    }),
  ]
})