import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db/connectDB';
import PageView from '@/lib/models/PageView';

export async function POST(request) {
    try {
        const { path } = await request.json();

        if (!path) {
            return NextResponse.json({ error: 'Path is required' }, { status: 400 });
        }

        await connectDB();

        // Upsert the page view counter
        // Simple implementation: increment views. 
        // For unique visitors, we would need session tracking or IP hashing, 
        // but for now let's just count hits to keep it fast and GDPR-friendly.

        await PageView.findOneAndUpdate(
            { path: path },
            {
                $inc: { views: 1 },
                $set: { lastVisited: new Date() }
            },
            { upsert: true, new: true }
        );

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Tracking Error:', error);
        // Return 200 even on error to not break the client client-side
        return NextResponse.json({ success: false }, { status: 200 });
    }
}
