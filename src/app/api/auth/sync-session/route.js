import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../[...nextauth]/route';
import jwt from 'jsonwebtoken';

export async function POST(request) {
    try {
        const session = await getServerSession(authOptions);

        if (!session) {
            return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
        }

        // Create the custom JWT token expected by middleware
        const tokenPayload = {
            id: session.user.id,
            email: session.user.email,
            role: session.user.role,
        };

        const token = jwt.sign(
            tokenPayload,
            process.env.JWT_SECRET || 'fallback-secret',
            { expiresIn: '7d' }
        );

        const response = NextResponse.json({ success: true, user: session.user });

        // Set the auth-token cookie
        response.cookies.set({
            name: 'auth-token',
            value: token,
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            path: '/',
            maxAge: 7 * 24 * 60 * 60, // 7 days
        });

        return response;
    } catch (error) {
        console.error('Sync session error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
