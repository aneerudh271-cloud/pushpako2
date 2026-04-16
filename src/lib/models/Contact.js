import mongoose from "mongoose"

const ContactSchema = new mongoose.Schema(
  {
    name: String,
    email: String,
    subject: String,
    message: String,
    status: { type: String, default: "new" },
    source: { type: String, default: "website" },
  },
  { timestamps: true }
)

export default mongoose.models.Contact ||
  mongoose.model("Contact", ContactSchema)
