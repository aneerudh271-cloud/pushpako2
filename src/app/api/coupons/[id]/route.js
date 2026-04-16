import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db/connectDB';
import Coupon from '@/lib/models/Coupon';
import { getAuthUser } from '@/lib/getAuthUser';

export async function PUT(request, { params }) {
    try {
        await connectDB();
        const user = await getAuthUser();
        const { id } = await params;

        if (!user || (user.role !== 'admin' && user.role !== 'hackathon_manager')) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await request.json();
        const coupon = await Coupon.findByIdAndUpdate(id, body, { new: true });

        if (!coupon) return NextResponse.json({ error: 'Coupon not found' }, { status: 404 });

        return NextResponse.json({ message: 'Coupon updated successfully', coupon });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function DELETE(request, { params }) {
    try {
        await connectDB();
        const user = await getAuthUser();
        const { id } = await params;

        if (!user || (user.role !== 'admin' && user.role !== 'hackathon_manager')) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        await Coupon.findByIdAndDelete(id);
        return NextResponse.json({ message: 'Coupon deleted successfully' });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
