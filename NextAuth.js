
import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import GitHubProvider from "next-auth/providers/github";
import CredentialsProvider from "next-auth/providers/credentials";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import bcrypt from "bcryptjs";

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    GitHubProvider({
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
    }),
    CredentialsProvider({
      name: "Email & Password",
      credentials: { email: {}, password: {} },
      async authorize(credentials) {
        await connectDB();
        const user = await User.findOne({ email: credentials.email });
        if (!user || !(await bcrypt.compare(credentials.password, user.password))) {
          throw new Error("Invalid credentials");
        }
        return { id: user._id, name: user.name, email: user.email };
      },
    }),
  ],
  callbacks: {
    async session({ session, user }) {
      const dbUser = await User.findOne({ email: session.user.email });
      session.user.id = dbUser._id;
      return session;
    },
  },
  pages: {
    signIn: "/signup",
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
