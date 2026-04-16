import mongoose from "mongoose"

const CommentSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  author: { type: String, required: true },
  authorEmail: String,
  userImage: String, // Store profile image URL
  content: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  likes: [{ type: String }], // Array of userIds who liked
  isApproved: { type: Boolean, default: true }, // Auto-approve for now
})

const BlogSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    excerpt: { type: String, required: true },
    content: { type: String, required: true },
    author: { type: String, required: true },
    authorId: { type: String, default: "admin" },
    category: { type: String, required: true },
    tags: [{ type: String }],
    featuredImage: String,
    images: [{ type: String }],
    videos: [{ type: String }],
    readTime: { type: Number, default: 5 },
    views: { type: Number, default: 0 },
    likes: { type: Number, default: 0 },
    comments: [CommentSchema],
    isPublished: { type: Boolean, default: true },
    isFeatured: { type: Boolean, default: false },
  },
  { timestamps: true }
)

// Add indexes for better performance
BlogSchema.index({ category: 1 })
BlogSchema.index({ isPublished: 1 })
BlogSchema.index({ isFeatured: 1 })
BlogSchema.index({ createdAt: -1 })

export default mongoose.models.Blog || mongoose.model("Blog", BlogSchema)