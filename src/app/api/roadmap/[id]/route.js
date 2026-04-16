import { connectDB } from "@/lib/db/connectDB"
import Roadmap from "@/lib/models/Roadmap"
import { NextResponse } from "next/server"

// GET /api/roadmap/[id] - Get a single roadmap item by ID
export async function GET(request, { params }) {
  try {
    await connectDB()
    const { id } = params

    const roadmapItem = await Roadmap.findById(id)

    if (!roadmapItem) {
      return NextResponse.json({ error: "Roadmap item not found" }, { status: 404 })
    }

    return NextResponse.json(roadmapItem)
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: "Server error" }, { status: 500 })
  }
}

// PUT /api/roadmap/[id] - Update a roadmap item
export async function PUT(request, { params }) {
  try {
    await connectDB()
    const { id } = await params
    const data = await request.json()

    const roadmapItem = await Roadmap.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true
    })

    if (!roadmapItem) {
      return NextResponse.json({ error: "Roadmap item not found" }, { status: 404 })
    }

    return NextResponse.json(roadmapItem)
  } catch (error) {
    console.error(error)
    if (error.code === 11000) {
      return NextResponse.json({ error: "Roadmap item with this ID already exists" }, { status: 400 })
    }
    return NextResponse.json({ error: "Server error" }, { status: 500 })
  }
}

// DELETE /api/roadmap/[id] - Delete a roadmap item
export async function DELETE(request, { params }) {
  try {
    await connectDB()
    const { id } = params

    const roadmapItem = await Roadmap.findByIdAndDelete(id)

    if (!roadmapItem) {
      return NextResponse.json({ error: "Roadmap item not found" }, { status: 404 })
    }

    return NextResponse.json({ message: "Roadmap item deleted successfully" })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: "Server error" }, { status: 500 })
  }
}