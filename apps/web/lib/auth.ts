import NextAuth, { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials";
import { prismaClient } from "@repo/db/client";
import bcrypt from "bcrypt";

export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            name: "Email",
            credentials: {
                email: { label: "Email", type: "text", placeholder: "bandhan@majumder.com" },
                password: { label: "Password", type: "password", placeholder: "* * * * *" }
            },
            async authorize(credentials, req) {
                if (!credentials?.email || !credentials?.password) {
                    throw new Error("Missing required fields");
                }

                const existingUser = await prismaClient.user.findUnique({
                    where: { email: credentials.email },
                });

                if (!existingUser) {
                    throw new Error("No user found");
                }

                const passwordMatch = await bcrypt.compare(
                    credentials.password,
                    existingUser.password
                );

                if (!passwordMatch) {
                    throw new Error("Invalid credentials");
                }

                return existingUser;
            }
        })
    ],
    secret: process.env.NEXTAUTH_SECRET,
    // session: {
    //     strategy: "jwt",
    //     maxAge: 30 * 24 * 60 * 60, // 30 days
    // },
    pages: {
        newUser: "/auth/signup",
        signIn: "/auth/signin",
    },
    callbacks: {
        async redirect({ url, baseUrl }) {
            return baseUrl;
        },
        async jwt({ token, user }) {
            // these id, email, and name already exist in the default token. For adding new properties, we can do the operations like below after defining type
            if (user){
                token.id = user.id;
                token.email = user.email;
                token.name = user.name;
            }
            return token;
        },
        async session({ session, token }) {
            // Add custom properties to the session object if needed
            if (token) {
                (session as any).id = token.id;
                (session as any).email = token.email;
                (session as any).name = token.name;
            }
            return session;
        }
    },
}