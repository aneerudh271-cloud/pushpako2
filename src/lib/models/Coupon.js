import mongoose from "mongoose";

const CouponSchema = new mongoose.Schema(
    {
        code: { type: String, required: true, unique: true, uppercase: true },
        discountType: { type: String, enum: ["PERCENTAGE", "FLAT"], default: "PERCENTAGE" },
        discountValue: { type: Number, required: true },
        minPurchase: { type: Number, default: 0 },
        maxDiscount: { type: Number },
        expiryDate: { type: Date },
        usageLimit: { type: Number, default: 100 },
        usedCount: { type: Number, default: 0 },
        applicableHackathons: [{ type: mongoose.Schema.Types.ObjectId, ref: "Hackathon" }], // Empty means all
        isActive: { type: Boolean, default: true },
        createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "Investor" }
    },
    { timestamps: true }
);

export default mongoose.models.Coupon || mongoose.model("Coupon", CouponSchema);
