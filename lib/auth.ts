import { PrismaAdapter } from '@next-auth/prisma-adapter';
import { getServerSession, type NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';
import { prisma } from './prisma';

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  session: { strategy: 'jwt' },
  providers: [CredentialsProvider({
    name: 'Credentials',
    credentials: { email: { label: 'Email', type: 'email' }, password: { label: 'Password', type: 'password' } },
    async authorize(credentials) {
      if (!credentials?.email || !credentials.password) return null;
      const user = await prisma.user.findUnique({ where: { email: credentials.email.toLowerCase() } });
      if (!user || !(await bcrypt.compare(credentials.password, user.passwordHash))) return null;
      return { id: user.id, name: user.name ?? user.username, email: user.email, image: user.image, role: user.role };
    },
  })],
  callbacks: { async jwt({ token, user }) { if (user) { token.id = user.id; token.role = (user as { role?: string }).role; } return token; }, async session({ session, token }) { if (session.user) { session.user.id = token.id as string; (session.user as { role?: string }).role = token.role as string; } return session; } },
  pages: { signIn: '/login' },
  secret: process.env.NEXTAUTH_SECRET,
};

export const getSession = () => getServerSession(authOptions);
