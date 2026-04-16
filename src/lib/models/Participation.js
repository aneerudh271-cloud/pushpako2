import mongoose from "mongoose"

const ParticipationSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "HackathonUser",
            required: true
        },
        hackathon: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Hackathon",
            required: true
        },
        teamName: { type: String },
        teamMembers: [{
            name: { type: String, required: true },
            email: { type: String, required: true },
            gender: { type: String, enum: ['MALE', 'FEMALE', 'OTHER'], required: true },
            college: { type: String },
            role: { type: String },
            phone: { type: String }
        }],
        status: {
            type: String,
            enum: ["PENDING", "REGISTERED", "APPROVED", "SUBMITTED"],
            default: "PENDING"
        },
        participationCode: { type: String },
        approvedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Investor"
        },
        tokenSent: { type: Boolean, default: false },
        registeredAt: { type: Date, default: Date.now },
        paymentStatus: {
            type: String,
            enum: ["PENDING", "COMPLETED", "FAILED", "NA"],
            default: "PENDING"
        },
        razorpayOrderId: { type: String },
        razorpayPaymentId: { type: String },
        amountPaid: { type: Number, default: 0 },
        discountApplied: { type: Number, default: 0 },
        couponUsed: { type: mongoose.Schema.Types.ObjectId, ref: "Coupon" }
    },
    { timestamps: true }
)

// Add indexes
ParticipationSchema.index({ user: 1, hackathon: 1 }, { unique: true }) // One participation per user per hackathon
ParticipationSchema.index({ hackathon: 1 })
ParticipationSchema.index({ status: 1 })

export default mongoose.models.Participation || mongoose.model("Participation", ParticipationSchema)