import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import { auth as firebaseAuth, db } from "@/lib/firebase"
import { signInWithEmailAndPassword } from "firebase/auth"
import { collection, query, where, getDocs } from "firebase/firestore"

export const { handlers, signIn, signOut, auth } = NextAuth({
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

                try {
                    // Firebase Auth ile giriş yap
                    const userCredential = await signInWithEmailAndPassword(
                        firebaseAuth,
                        credentials.email as string,
                        credentials.password as string
                    );
                    const firebaseUser = userCredential.user;

                    // Firestore'dan "team" koleksiyonunu sorgulayıp rol/resim çekelim
                    // Sizin Prisma şemanızda kullanıcılar "team" (@@map("team")) isimli tablodaydı.
                    const q = query(
                        collection(db, "team"),
                        where("email", "==", firebaseUser.email)
                    );
                    const querySnapshot = await getDocs(q);

                    let role = "ADMIN";
                    let name = firebaseUser.displayName || credentials.email as string;
                    let image = firebaseUser.photoURL || "";

                    if (!querySnapshot.empty) {
                        const userData = querySnapshot.docs[0].data();
                        role = userData.role || "ADMIN";
                        if (userData.name) name = userData.name;
                        if (userData.image_url) image = userData.image_url;
                    }

                    console.log("Login successful:", firebaseUser.email);

                    // NextAuth Session'ına veriyi gönder
                    return {
                        id: firebaseUser.uid,
                        email: firebaseUser.email,
                        name: name,
                        role: role,
                        image: image,
                    }
                } catch (error) {
                    console.error("Firebase Login Error:", error);
                    return null;
                }
            }
        })
    ],
    callbacks: {
        async jwt({ token, user, trigger, session }) {
            if (user) {
                token.id = user.id ?? ''
                token.role = (user as any).role
                token.picture = user.image
                token.name = user.name
            }

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
