import mongoose from "mongoose"

const PortfolioItemSchema = new mongoose.Schema({
  company: String,
  percentage: Number,
  invested: Number,
  current: Number,
})

const CommunicationLogSchema = new mongoose.Schema({
  id: String,
  date: String,
  type: {
    type: String,
    enum: ["email", "call", "meeting"]
  },
  subject: String,
  summary: String,
  followUp: String,
})

const InvestorSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: String,
    password: { type: String }, // Hashed password for email auth
    authProvider: { type: String, enum: ['email', 'google'], default: 'email' },
    googleId: { type: String }, // For Google OAuth
    role: { type: String, enum: ['investor', 'admin', 'hackathon_manager'], default: 'investor' },
    resetToken: String,
    resetTokenExpiry: Date,
    investmentAmount: { type: Number, default: 0 },
    currentValue: { type: Number, default: 0 },
    roi: { type: Number, default: 0 },
    joinDate: { type: String },
    profilePicture: String,
    type: {
      type: String,
      enum: ["individual", "institutional", "angel"],
      default: "individual"
    },
    riskProfile: {
      type: String,
      enum: ["conservative", "moderate", "aggressive"],
      default: "moderate"
    },
    investmentStage: {
      type: String,
      enum: ["seed", "series-a", "series-b"],
      default: "seed"
    },
    portfolio: [PortfolioItemSchema],
    communicationLog: [CommunicationLogSchema],
    documents: [{ type: String }],
    status: {
      type: String,
      enum: ["active", "inactive", "exited"],
      default: "active"
    },
    isFirstLogin: { type: Boolean, default: true },
    lastContact: String,
    nextFollowUp: String,
    notes: String,
    tags: [{ type: String }],
  },
  { timestamps: true }
)

// Add indexes
InvestorSchema.index({ type: 1 })
InvestorSchema.index({ status: 1 })
InvestorSchema.index({ investmentStage: 1 })

export default mongoose.models.Investor || mongoose.model("Investor", InvestorSchema)