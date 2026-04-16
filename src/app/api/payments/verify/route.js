import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { connectDB } from '@/lib/db/connectDB';
import Participation from '@/lib/models/Participation';
import Coupon from '@/lib/models/Coupon';
import HackathonUser from '@/lib/models/HackathonUser';
import { getAuthUser } from '@/lib/getAuthUser';

export async function POST(request) {
    try {
        await connectDB();
        const user = await getAuthUser();
        if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const {
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature,
            hackathonId,
            couponId,
            discount,
            amountPaid,
            teamName,
            teamMembers
        } = await request.json();

        // If amountPaid is 0, skip signature verification
        if (amountPaid > 0) {
            const body = razorpay_order_id + "|" + razorpay_payment_id;
            const expectedSignature = crypto
                .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
                .update(body.toString())
                .digest("hex");

            const isAuthentic = expectedSignature === razorpay_signature;

            if (!isAuthentic) {
                return NextResponse.json({ error: "Invalid payment signature" }, { status: 400 });
            }
        }

        // Find or Create HackathonUser
        let hUser = await HackathonUser.findOne({ email: user.email });
        if (!hUser) {
            hUser = await HackathonUser.create({
                name: user.name,
                email: user.email,
                role: 'PARTICIPANT'
            });
        }

        // Update or Create Participation
        const participationData = {
            user: hUser._id,
            hackathon: hackathonId,
            status: "REGISTERED",
            paymentStatus: amountPaid > 0 ? "COMPLETED" : "NA",
            razorpayOrderId: razorpay_order_id,
            razorpayPaymentId: razorpay_payment_id,
            amountPaid: amountPaid,
            discountApplied: discount || 0,
            couponUsed: couponId || null,
            participationCode: Math.random().toString(36).substring(2, 8).toUpperCase(),
            teamName: teamName || null,
            teamMembers: teamMembers || []
        };

        const participation = await Participation.findOneAndUpdate(
            { user: hUser._id, hackathon: hackathonId },
            participationData,
            { upsert: true, new: true }
        );

        // Increment coupon use count if applicable
        if (couponId) {
            await Coupon.findByIdAndUpdate(couponId, { $inc: { usedCount: 1 } });
        }

        return NextResponse.json({
            message: "Payment verified and registration successful",
            participation
        });

    } catch (error) {
        console.error("Payment Verification Error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
