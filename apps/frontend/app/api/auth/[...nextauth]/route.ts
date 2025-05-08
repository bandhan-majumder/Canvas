import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials";
import { prismaClient } from "@repo/db/client";
import bcrypt from "bcrypt";

const handler = NextAuth({
    providers: [
        CredentialsProvider({
            name: "Email",
            credentials: {
                email: { label: "Email", type: "text", placeholder: "bandhan@majumder.com" },
                password: { label: "Password", type: "password", placeholder: "* * * * *" }
            },
            async authorize(credentials, req) {
                if (!credentials?.email || !credentials?.password) {
                    return null;
                }

                const existingUser = await prismaClient.user.findUnique({
                    where: { email: credentials.email, password: credentials.password },
                });

                // // signup new user
                // if (!existingUser) {
                //     const newUser = await prismaClient.user.create({
                //         data: {
                //             email: credentials.email,
                //             password: await bcrypt.hash(credentials.password, 10),
                //         },
                //     });
                //     return newUser;
                // }

                // signin user
                // if (existingUser) {
                //     const passwordMatch = await bcrypt.compare(
                //         credentials.password,
                //         existingUser.password
                //     );

                //     if (passwordMatch) {
                //         return existingUser;
                //     }
                // }

                return existingUser;
            }
        })
    ],
    secret: process.env.NEXTAUTH_SECRET
})

export { handler as GET, handler as POST }