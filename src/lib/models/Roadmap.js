import mongoose from "mongoose"

const RoadmapSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true },
    quarter: { type: String, required: true },
    title: { type: String, required: true },
    status: {
      type: String,
      enum: ["planned", "in-progress", "completed"],
      default: "planned"
    },
    description: { type: String, required: true },
    milestones: [{ type: String }],
  },
  { timestamps: true }
)

// Add indexes
RoadmapSchema.index({ status: 1 })
RoadmapSchema.index({ quarter: 1 })

export default mongoose.models.Roadmap || mongoose.model("Roadmap", RoadmapSchema)