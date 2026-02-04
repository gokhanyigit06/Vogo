import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import { PrismaAdapter } from "@auth/prisma-adapter"
import prisma from "@/lib/prisma"
import bcrypt from "bcryptjs"

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const { handlers, signIn, signOut, auth } = NextAuth({
    adapter: PrismaAdapter(prisma) as any,
    session: {
        strategy: "jwt",
    },
    pages: {
        signIn: "/login",
    },
    providers: [
        Credentials({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials) {
                console.log("Login attempt for:", credentials?.email);

                if (!credentials?.email || !credentials?.password) {
                    console.log("Missing credentials");
                    return null
                }

                const user = await prisma.user.findUnique({
                    where: { email: credentials.email as string }
                })

                if (!user) {
                    console.log("User not found");
                    return null;
                }

                if (!user.password) {
                    console.log("User has no password set");
                    return null;
                }

                const isPasswordValid = await bcrypt.compare(
                    credentials.password as string,
                    user.password
                )

                if (!isPasswordValid) {
                    console.log("Password invalid");
                    return null
                }

                console.log("Login successful:", user.email);

                // Kullanıcı nesnesini döndür
                return {
                    id: user.id,
                    email: user.email,
                    name: user.name,
                    role: user.role,
                    image: user.image, // Avatar için önemli
                }
            }
        })
    ],
    callbacks: {
        async jwt({ token, user, trigger, session }) {
            // İlk login anı
            if (user) {
                token.id = user.id ?? ''
                token.role = (user as any).role
                token.picture = user.image
                token.name = user.name
            }

            // Session update tetiklenirse (örn: profil güncelleme)
            if (trigger === "update" && session) {
                token.name = session.name
                token.picture = session.image
            }

            return token
        },
        async session({ session, token }) {
            if (session.user) {
                session.user.id = token.id as string
                (session.user as any).role = token.role as string
                session.user.name = token.name as string
                session.user.image = token.picture as string
            }
            return session
        },
    },
})
