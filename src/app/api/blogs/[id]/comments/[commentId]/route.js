import { connectDB } from "@/lib/db/connectDB"
import Blog from "@/lib/models/Blog"
import { NextResponse } from "next/server"
import { getAuthUser } from "@/lib/getAuthUser"

// DELETE /api/blogs/[id]/comments/[commentId] - Delete a comment
export async function DELETE(request, { params }) {
    try {
        const user = await getAuthUser()
        if (!user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        await connectDB()
        const { id, commentId } = await params

        const blog = await Blog.findById(id)
        if (!blog) {
            return NextResponse.json({ error: "Blog not found" }, { status: 404 })
        }

        // Find the comment subdocument
        const comment = blog.comments.id(commentId)
        if (!comment) {
            return NextResponse.json({ error: "Comment not found" }, { status: 404 })
        }

        // Authorization: User must be author of comment OR Admin
        // Note: userId in schema is string, so compare carefully
        if (comment.userId !== user.id && user.role !== 'admin') {
            return NextResponse.json({ error: "Forbidden" }, { status: 403 })
        }

        // Remove the comment
        comment.deleteOne()
        await blog.save()

        return NextResponse.json({ message: "Comment deleted" })
    } catch (error) {
        console.error("Error deleting comment:", error)
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
    }
}
