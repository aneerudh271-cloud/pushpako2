import { NextResponse } from 'next/server';
import Razorpay from 'razorpay';
import { connectDB } from '@/lib/db/connectDB';
import Hackathon from '@/lib/models/Hackathon';
import Coupon from '@/lib/models/Coupon';
import { getAuthUser } from '@/lib/getAuthUser';

const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
});

export async function POST(request) {
    try {
        await connectDB();
        const user = await getAuthUser();
        if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const { hackathonId, couponCode } = await request.json();

        const hackathon = await Hackathon.findById(hackathonId);
        if (!hackathon) return NextResponse.json({ error: 'Hackathon not found' }, { status: 404 });

        let amount = hackathon.registrationFee || 0;
        let discount = 0;
        let couponId = null;

        if (couponCode && amount > 0) {
            const coupon = await Coupon.findOne({
                code: couponCode.toUpperCase(),
                isActive: true
            });

            if (coupon) {
                // Validate coupon (logic same as validate API)
                const isExpired = coupon.expiryDate && new Date(coupon.expiryDate) < new Date();
                const limitReached = coupon.usedCount >= coupon.usageLimit;
                const hackathonMatch = coupon.applicableHackathons.length === 0 || coupon.applicableHackathons.includes(hackathonId);

                if (!isExpired && !limitReached && hackathonMatch && amount >= coupon.minPurchase) {
                    if (coupon.discountType === 'PERCENTAGE') {
                        discount = (amount * coupon.discountValue) / 100;
                        if (coupon.maxDiscount && discount > coupon.maxDiscount) {
                            discount = coupon.maxDiscount;
                        }
                    } else {
                        discount = coupon.discountValue;
                    }
                    couponId = coupon._id;
                }
            }
        }

        const finalAmount = Math.max(0, amount - discount);

        if (finalAmount === 0) {
            // Free registration or 100% discount
            return NextResponse.json({
                order: null,
                finalAmount: 0,
                discount,
                couponId
            });
        }

        const options = {
            amount: Math.round(finalAmount * 100), // in paise
            currency: 'INR',
            receipt: `receipt_${Date.now()}`,
            notes: {
                hackathonId,
                userId: user.id,
                couponId: couponId ? couponId.toString() : ''
            }
        };

        const order = await razorpay.orders.create(options);

        return NextResponse.json({
            order,
            finalAmount,
            discount,
            couponId
        });

    } catch (error) {
        console.error("Razorpay Order Error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
