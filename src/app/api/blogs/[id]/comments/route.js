import { connectDB } from "@/lib/db/connectDB"
import Blog from "@/lib/models/Blog"
import { NextResponse } from "next/server"
import { getAuthUser } from "@/lib/getAuthUser"

// GET /api/blogs/[id]/comments - Get comments for a blog
export async function GET(request, { params }) {
    try {
        await connectDB()
        const { id } = await params

        const blog = await Blog.findById(id).select('comments')
        if (!blog) {
            return NextResponse.json({ error: "Blog not found" }, { status: 404 })
        }

        // Sort comments by newest first
        const comments = blog.comments.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))

        return NextResponse.json(comments)
    } catch (error) {
        console.error("Error fetching comments:", error)
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
    }
}

// POST /api/blogs/[id]/comments - Add a new comment
export async function POST(request, { params }) {
    try {
        const user = await getAuthUser()
        if (!user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        await connectDB()
        const { id } = await params
        const { content } = await request.json()

        if (!content || !content.trim()) {
            return NextResponse.json({ error: "Comment cannot be empty" }, { status: 400 })
        }

        const blog = await Blog.findById(id)
        if (!blog) {
            return NextResponse.json({ error: "Blog not found" }, { status: 404 })
        }

        const newComment = {
            userId: user.id,
            author: user.name || "Anonymous",
            authorEmail: user.email,
            userImage: user.image || "", // Basic avatar support if available
            content: content.trim(),
            createdAt: new Date(),
            likes: [],
            isApproved: true
        }

        blog.comments.push(newComment)
        await blog.save()

        // Return the newly created comment (it will have an _id now)
        const savedComment = blog.comments[blog.comments.length - 1]

        return NextResponse.json(savedComment)
    } catch (error) {
        console.error("Error adding comment:", error)
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
    }
}
