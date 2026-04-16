import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { connectDB } from '@/lib/db/connectDB';
import Investor from '@/lib/models/Investor';

export async function POST(request) {
  try {
    const { name, email, password, userType = 'investor' } = await request.json();

    if (!name || !email || !password) {
      return NextResponse.json({ error: 'All fields are required' }, { status: 400 });
    }

    await connectDB();

    const hashedPassword = await bcrypt.hash(password, 12);

    if (userType === 'user') {
      const HackathonUser = (await import('@/lib/models/HackathonUser')).default;

      const existingUser = await HackathonUser.findOne({ email });
      if (existingUser) {
        return NextResponse.json({ error: 'User already exists' }, { status: 400 });
      }

      const newUser = new HackathonUser({
        name,
        email,
        password: hashedPassword,
        status: 'active',
      });

      await newUser.save();
    } else {
      // Investor/Admin signup
      const existingUser = await Investor.findOne({ email });
      if (existingUser) {
        return NextResponse.json({ error: 'User already exists' }, { status: 400 });
      }

      const newUser = new Investor({
        name,
        email,
        password: hashedPassword,
        authProvider: 'email',
        role: 'investor',
        joinDate: new Date().toISOString().split('T')[0],
      });

      await newUser.save();
    }

    return NextResponse.json({ message: 'Account created successfully' }, { status: 201 });
  } catch (error) {
    console.error('Sign-up error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}