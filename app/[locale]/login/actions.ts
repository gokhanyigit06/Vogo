'use server'

import { signIn, signOut } from "@/lib/auth"
import { AuthError } from "next-auth"
import { redirect } from "next/navigation"


export async function loginAction(email: string, password: string) {
    try {
        await signIn("credentials", {
            email,
            password,
            redirect: false,
        })
        return { success: true }
    } catch (error) {
        if (error instanceof AuthError) {
            switch (error.type) {
                case "CredentialsSignin":
                    return { success: false, error: "Geçersiz email veya şifre" }
                default:
                    return { success: false, error: "Bir hata oluştu" }
            }
        }
        // Next.js redirect hatasını fırlatmamak için kontrol
        // Ancak redirect: false kullandığımız için bu blok genelde AuthError dışındaki hatalar içindir
        console.error("Login error:", error)
        return { success: false, error: "Beklenmeyen bir hata oluştu" }
    }
}

export async function logoutAction() {
    await signOut({ redirectTo: "/login" })
}
