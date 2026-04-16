import mongoose from "mongoose"

const TokenSchema = new mongoose.Schema(
    {
        participation: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Participation",
            required: true
        },
        code: { type: String, required: true, unique: true },
        isUsed: { type: Boolean, default: false },
        expiresAt: { type: Date, required: true },
    },
    { timestamps: true }
)

// Add indexes
// Code index is created automatically by unique: true
TokenSchema.index({ participation: 1 })
TokenSchema.index({ expiresAt: 1 })

export default mongoose.models.Token || mongoose.model("Token", TokenSchema)