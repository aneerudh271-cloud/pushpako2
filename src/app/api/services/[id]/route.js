import { connectDB } from "@/lib/db/connectDB"
import Service from "@/lib/models/Service"
import { NextResponse } from "next/server"

// GET /api/services/[id] - Get a single service by ID or slug
export async function GET(request, { params }) {
  try {
    await connectDB()
    const { id } = await params

    // Try to find by slug first, then by ID if it's a valid ObjectId
    let service = await Service.findOne({ slug: id })

    if (!service && /^[0-9a-fA-F]{24}$/.test(id)) {
      service = await Service.findById(id)
    }

    if (!service) {
      return NextResponse.json({ error: "Service not found" }, { status: 404 })
    }

    return NextResponse.json(service)
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: "Server error" }, { status: 500 })
  }
}

// PUT /api/services/[id] - Update a service
export async function PUT(request, { params }) {
  try {
    await connectDB()
    const { id } = await params
    const data = await request.json()

    // Generate new slug if title changed
    if (data.title && !data.slug) {
      data.slug = data.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '')
    }

    const service = await Service.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true
    })

    if (!service) {
      return NextResponse.json({ error: "Service not found" }, { status: 404 })
    }

    return NextResponse.json(service)
  } catch (error) {
    console.error(error)
    if (error.code === 11000) {
      return NextResponse.json({ error: "Service with this slug already exists" }, { status: 400 })
    }
    return NextResponse.json({ error: "Server error" }, { status: 500 })
  }
}

// DELETE /api/services/[id] - Delete a service
export async function DELETE(request, { params }) {
  try {
    await connectDB()
    const { id } = await params

    const service = await Service.findByIdAndDelete(id)

    if (!service) {
      return NextResponse.json({ error: "Service not found" }, { status: 404 })
    }

    return NextResponse.json({ message: "Service deleted successfully" })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: "Server error" }, { status: 500 })
  }
}