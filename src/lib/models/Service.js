import mongoose from "mongoose"

const PricingSchema = new mongoose.Schema({
  price: { type: Number, required: true },
  currency: { type: String, default: "USD" },
  period: { type: String, required: true }, // one-time, monthly, etc.
}, { _id: false })

const TestimonialSchema = new mongoose.Schema({
  id: String,
  name: String,
  company: String,
  rating: { type: Number, min: 1, max: 5 },
  comment: String,
  date: String,
})


const ServiceSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    description: { type: String, required: true },
    category: { type: String, required: true }, // Products, Services
    status: {
      type: String,
      enum: ["active", "development", "discontinued"],
      default: "active"
    },
    icon: String,
    featuredImage: String,
    images: [{ type: String }],
    pricing: mongoose.Schema.Types.Mixed, // Allow flexible pricing structure
    features: [{ type: String }],
    testimonials: [TestimonialSchema],
    specifications: mongoose.Schema.Types.Mixed, // Allow flexible specifications structure
    bookingUrl: String,
    inquirySystem: {
      type: String,
      enum: ["integrated", "external", "none"],
      default: "integrated"
    },
    isPopular: { type: Boolean, default: false },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
)

// Add indexes
ServiceSchema.index({ category: 1 })
ServiceSchema.index({ status: 1 })
ServiceSchema.index({ isPopular: 1 })
ServiceSchema.index({ order: 1 })

export default mongoose.models.Service || mongoose.model("Service", ServiceSchema)