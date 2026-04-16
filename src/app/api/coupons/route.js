import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db/connectDB';
import Coupon from '@/lib/models/Coupon';
import Hackathon from '@/lib/models/Hackathon';
import { getAuthUser } from '@/lib/getAuthUser';

export async function GET(request) {
    try {
        await connectDB();
        const user = await getAuthUser();

        if (!user || (user.role !== 'admin' && user.role !== 'hackathon_manager')) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const coupons = await Coupon.find({}).populate('applicableHackathons', 'title').sort({ createdAt: -1 });
        return NextResponse.json({ coupons });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function POST(request) {
    try {
        await connectDB();
        const user = await getAuthUser();

        if (!user || (user.role !== 'admin' && user.role !== 'hackathon_manager')) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await request.json();
        const coupon = new Coupon({
            ...body,
            createdBy: user.id
        });

        await coupon.save();
        return NextResponse.json({ message: 'Coupon created successfully', coupon });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
