import { connectDB } from "@/lib/db/connectDB"
import Technology from "@/lib/models/Technology"
import { NextResponse } from "next/server"

// GET /api/technologies - Get all technologies with optional filtering
export async function GET(request) {
  try {
    await connectDB()

    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')
    const status = searchParams.get('status')
    const featured = searchParams.get('featured')

    let query = {}

    if (category && category !== 'all') {
      query.category = category
    }

    if (status && status !== 'all') {
      query.status = status
    }

    if (featured === 'true') {
      query.isFeatured = true
    }

    const technologies = await Technology.find(query).sort({ createdAt: -1 })

    return NextResponse.json(technologies)
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: "Server error" }, { status: 500 })
  }
}

// POST /api/technologies - Create a new technology
export async function POST(request) {
  try {
    await connectDB()
    const data = await request.json()

    // Generate slug if not provided
    if (!data.slug) {
      data.slug = data.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '')
    }

    const technology = await Technology.create(data)
    return NextResponse.json(technology, { status: 201 })
  } catch (error) {
    console.error(error)
    if (error.code === 11000) {
      return NextResponse.json({ error: "Technology with this slug already exists" }, { status: 400 })
    }
    return NextResponse.json({ error: "Server error" }, { status: 500 })
  }
}