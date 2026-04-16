import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import CredentialsProvider from 'next-auth/providers/credentials';
import { connectDB } from '@/lib/db/connectDB';
import Investor from '@/lib/models/Investor';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

const GoogleProviderFn = GoogleProvider.default || GoogleProvider;
const CredentialsProviderFn = CredentialsProvider.default || CredentialsProvider;

export const authOptions = {
  providers: [
    GoogleProviderFn({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    CredentialsProviderFn({
      name: 'Credentials',
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Email and password are required');
        }

        await connectDB();

        if (credentials.userType === 'user') {
          // Hackathon Participant Login
          const HackathonUser = (await import('@/lib/models/HackathonUser')).default;
          const user = await HackathonUser.findOne({ email: credentials.email });

          if (!user || !user.password) {
            throw new Error('Invalid credentials');
          }

          const isValid = await bcrypt.compare(credentials.password, user.password);

          if (!isValid) {
            throw new Error('Invalid credentials');
          }

          if (user.status !== 'active') {
            throw new Error('Account is not active');
          }

          return {
            id: user._id.toString(),
            name: user.name,
            email: user.email,
            role: 'hackathon_user', // Distinct role for participants
          };
        } else if (credentials.userType === 'manager') {
          // Manager Login
          const user = await Investor.findOne({ email: credentials.email });

          if (!user || !user.password) {
            throw new Error('Invalid credentials');
          }

          const isValid = await bcrypt.compare(credentials.password, user.password);

          if (!isValid) {
            throw new Error('Invalid credentials');
          }

          if (user.status !== 'active') {
            throw new Error('Account is not active');
          }

          if (user.role !== 'hackathon_manager') {
            throw new Error('Restricted to Hackathon Managers only');
          }

          return {
            id: user._id.toString(),
            name: user.name,
            email: user.email,
            role: user.role,
          };
        } else {
          // Investor/Admin Login
          const user = await Investor.findOne({ email: credentials.email });

          if (!user || !user.password) {
            throw new Error('Invalid credentials');
          }

          const isValid = await bcrypt.compare(credentials.password, user.password);

          if (!isValid) {
            throw new Error('Invalid credentials');
          }

          if (user.status !== 'active') {
            throw new Error('Account is not active');
          }

          // Strict separation: Prevent Hackathon Managers from logging in here
          if (user.role === 'hackathon_manager') {
            throw new Error('Please use the Manager Login page');
          }

          return {
            id: user._id.toString(),
            name: user.name,
            email: user.email,
            role: user.role,
          };
        }
      }
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      if (account.provider === 'credentials') return true;

      try {
        await connectDB();
        const { cookies } = await import("next/headers");
        const cookieStore = await cookies();
        const userType = cookieStore.get('login-user-type')?.value;

        const HackathonUser = (await import('@/lib/models/HackathonUser')).default;

        // 1. Check if user exists in HackathonUser
        let existingHackathonUser = await HackathonUser.findOne({ email: user.email });

        // 2. Check if user exists in Investor
        let existingInvestor = await Investor.findOne({ email: user.email });

        let finalUser = null;

        if (existingHackathonUser) {
          finalUser = existingHackathonUser;
          if (!finalUser.googleId) {
            finalUser.googleId = user.id;
            finalUser.authProvider = 'google';
            await finalUser.save();
          }
        } else if (existingInvestor) {
          finalUser = existingInvestor;
          if (finalUser.authProvider !== 'google') {
            finalUser.authProvider = 'google';
            finalUser.googleId = user.id;
            await finalUser.save();
          }
        } else {
          // New User - Decided by cookie or default
          if (userType === 'user') {
            const newUser = new HackathonUser({
              name: user.name,
              email: user.email,
              googleId: user.id,
              authProvider: 'google',
              role: 'hackathon_user',
              status: 'active',
            });
            await newUser.save();
            finalUser = newUser;
          } else {
            // Default to Investor if no cookie context or 'investor'
            const newUser = new Investor({
              name: user.name,
              email: user.email,
              googleId: user.id,
              authProvider: 'google',
              role: 'investor',
              status: 'active',
            });
            await newUser.save();
            finalUser = newUser;
          }
        }

        // Add user info to token object (mutating the user object passed to jwt)
        user.id = finalUser._id.toString();
        user.role = finalUser.role || (finalUser instanceof HackathonUser ? 'hackathon_user' : 'investor');

        return true;
      } catch (error) {
        console.error('Google sign-in error:', error);
        return false;
      }
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      session.user.id = token.id;
      session.user.role = token.role;

      // Also set the JWT cookie for compatibility with existing middleware
      const jwtToken = jwt.sign(
        { id: token.id, email: session.user.email, role: token.role },
        process.env.JWT_SECRET || 'fallback-secret',
        { expiresIn: '7d' }
      );

      // Note: Cookies are set in the response, but here we can prepare the token
      session.jwt = jwtToken;

      return session;
    },
  },
  cookies: {
    sessionToken: {
      name: process.env.NODE_ENV === 'production' ? '__Secure-next-auth.session-token' : 'next-auth.session-token',
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: process.env.NODE_ENV === 'production',
      },
    },
  },
  pages: {
    signIn: '/sign-in',
  },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = (NextAuth.default || NextAuth)(authOptions);

export { handler as GET, handler as POST };