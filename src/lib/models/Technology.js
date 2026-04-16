import mongoose from "mongoose"

const SpecificationSchema = new mongoose.Schema({
  [String]: String
}, { _id: false })

const TechnologySchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    description: { type: String, required: true },
    category: { type: String, required: true }, // Aircraft, Propulsion, Infrastructure, Software
    status: {
      type: String,
      enum: ["active", "development", "deprecated"],
      default: "active"
    },
    version: String,
    releaseDate: String,
    lastUpdated: String,
    featuredImage: String,
    images: [{ type: String }],
    videos: [{ type: String }],
    specifications: mongoose.Schema.Types.Mixed, // Allow flexible specifications structure
    features: [{ type: String }],
    partners: [{ type: String }],
    documentation: [{ type: String }],
    downloads: { type: Number, default: 0 },
    views: { type: Number, default: 0 },
    isFeatured: { type: Boolean, default: false },
  },
  { timestamps: true }
)

// Add indexes
TechnologySchema.index({ category: 1 })
TechnologySchema.index({ status: 1 })
TechnologySchema.index({ isFeatured: 1 })

export default mongoose.models.Technology || mongoose.model("Technology", TechnologySchema)