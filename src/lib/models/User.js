import mongoose from "mongoose"

const UserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: String,
    type: {
      type: String,
      enum: ["lead", "subscriber", "inquiry"],
      required: true
    },
    source: {
      type: String,
      enum: ["Stay Updated", "Contact Us"],
      required: true
    },
    message: String,
    status: {
      type: String,
      enum: ["new", "contacted", "qualified", "converted"],
      default: "new"
    },
    tags: [{ type: String }],
    followUpDate: Date,
    assignedTo: { type: String, default: "admin" },
    notes: String,
  },
  { timestamps: true }
)

// Add indexes
UserSchema.index({ email: 1 })
UserSchema.index({ type: 1 })
UserSchema.index({ status: 1 })
UserSchema.index({ source: 1 })
UserSchema.index({ createdAt: -1 })

export default mongoose.models.User || mongoose.model("User", UserSchema)