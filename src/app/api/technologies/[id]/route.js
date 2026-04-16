import { connectDB } from "@/lib/db/connectDB"
import Technology from "@/lib/models/Technology"
import { NextResponse } from "next/server"

// GET /api/technologies/[id] - Get a single technology by ID or slug
export async function GET(request, { params }) {
  try {
    await connectDB()
    const { id } = params

    // Try to find by slug first, then by ID if it's a valid ObjectId
    let technology = await Technology.findOne({ slug: id })

    if (!technology && /^[0-9a-fA-F]{24}$/.test(id)) {
      technology = await Technology.findById(id)
    }

    if (!technology) {
      return NextResponse.json({ error: "Technology not found" }, { status: 404 })
    }

    return NextResponse.json(technology)
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: "Server error" }, { status: 500 })
  }
}

// PUT /api/technologies/[id] - Update a technology
export async function PUT(request, { params }) {
  try {
    await connectDB()
    const { id } = await params
    const data = await request.json()

    // Generate new slug if title changed
    if (data.title && !data.slug) {
      data.slug = data.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '')
    }

    const technology = await Technology.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true
    })

    if (!technology) {
      return NextResponse.json({ error: "Technology not found" }, { status: 404 })
    }

    return NextResponse.json(technology)
  } catch (error) {
    console.error(error)
    if (error.code === 11000) {
      return NextResponse.json({ error: "Technology with this slug already exists" }, { status: 400 })
    }
    return NextResponse.json({ error: "Server error" }, { status: 500 })
  }
}

// DELETE /api/technologies/[id] - Delete a technology
export async function DELETE(request, { params }) {
  try {
    await connectDB()
    const { id } = await params

    const technology = await Technology.findByIdAndDelete(id)

    if (!technology) {
      return NextResponse.json({ error: "Technology not found" }, { status: 404 })
    }

    return NextResponse.json({ message: "Technology deleted successfully" })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: "Server error" }, { status: 500 })
  }
}