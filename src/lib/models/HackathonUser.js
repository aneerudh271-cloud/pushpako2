import mongoose from "mongoose"

const HackathonUserSchema = new mongoose.Schema(
    {
        name: { type: String, required: true },
        email: { type: String, required: true, unique: true },
        phone: String,
        password: { type: String }, // Optional, for future auth
        authProvider: { type: String, default: 'email' },
        googleId: { type: String },
        role: { type: String, default: 'hackathon_user' },
        profilePicture: String,
        status: {
            type: String,
            enum: ["active", "inactive"],
            default: "active"
        },
    },
    { timestamps: true }
)

// Add indexes
// Email index is created automatically by unique: true
HackathonUserSchema.index({ status: 1 })

export default mongoose.models.HackathonUser || mongoose.model("HackathonUser", HackathonUserSchema)