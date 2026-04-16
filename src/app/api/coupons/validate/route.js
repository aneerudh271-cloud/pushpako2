import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db/connectDB';
import Coupon from '@/lib/models/Coupon';
import Hackathon from '@/lib/models/Hackathon';

export async function POST(request) {
    try {
        await connectDB();
        const { code, hackathonId, amount } = await request.json();

        if (!code) return NextResponse.json({ error: 'Coupon code is required' }, { status: 400 });

        const coupon = await Coupon.findOne({
            code: code.toUpperCase(),
            isActive: true
        });

        if (!coupon) {
            return NextResponse.json({ error: 'Invalid or expired coupon code' }, { status: 400 });
        }

        // Check expiry
        if (coupon.expiryDate && new Date(coupon.expiryDate) < new Date()) {
            return NextResponse.json({ error: 'Coupon has expired' }, { status: 400 });
        }

        // Check usage limit
        if (coupon.usedCount >= coupon.usageLimit) {
            return NextResponse.json({ error: 'Coupon usage limit reached' }, { status: 400 });
        }

        // Check applicability
        if (coupon.applicableHackathons.length > 0 && !coupon.applicableHackathons.includes(hackathonId)) {
            return NextResponse.json({ error: 'Coupon is not applicable for this hackathon' }, { status: 400 });
        }

        // Check min purchase
        if (amount < coupon.minPurchase) {
            return NextResponse.json({ error: `Minimum amount of ₹${coupon.minPurchase} required` }, { status: 400 });
        }

        let discount = 0;
        if (coupon.discountType === 'PERCENTAGE') {
            discount = (amount * coupon.discountValue) / 100;
            if (coupon.maxDiscount && discount > coupon.maxDiscount) {
                discount = coupon.maxDiscount;
            }
        } else {
            discount = coupon.discountValue;
        }

        const finalAmount = Math.max(0, amount - discount);

        return NextResponse.json({
            valid: true,
            discount,
            finalAmount,
            couponId: coupon._id
        });

    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
