import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { compare } from "bcrypt";
import prisma from "@/lib/prisma"; // ✅ Make sure this is default export

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
        secretCode: { label: "Secret Code", type: "text" }, // ✅ Added here
      },
      async authorize(credentials) {
        if (credentials.secretCode !== process.env.ADMIN_SECRET_CODE) {
          throw new Error("Invalid secret code"); // ✅ Validate
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });

        if (!user) {
          throw new Error("User not found");
        }

        const isValid = await compare(credentials.password, user.password);
        if (!isValid) {
          throw new Error("Invalid password");
        }

        return {
          id: user.id,
          email: user.email,
          role: user.role,
        };
      },
    }),
  ],
  pages: {
    signIn: "/admin/login",
  },
  callbacks: {
    async session({ session, token }) {
      const user = await prisma.user.findUnique({
        where: { email: session.user.email },
      });

      if (user) session.user.role = user.role;
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET, // ✅ Prevents JWE decryption error
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
