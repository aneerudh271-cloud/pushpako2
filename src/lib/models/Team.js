import mongoose from "mongoose"

// Force model recompilation on hot reload
if (mongoose.models.Team) {
  delete mongoose.models.Team
}

const TeamSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    role: { type: String, required: true },
    bio: { type: String, required: true },
    image: String,
    department: {
      type: String,
      enum: ["Executive", "Technology", "Engineering", "Operations", "Safety", "Marketing", "Sales", "IT"],
      required: true
    },
    order: { type: Number, default: 99 },
  },
  { timestamps: true }
)

// Add indexes
TeamSchema.index({ department: 1 })

export default mongoose.models.Team || mongoose.model("Team", TeamSchema)
